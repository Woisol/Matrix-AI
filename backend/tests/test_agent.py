import sys
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from tortoise.fields.relational import ForeignKeyFieldInstance


BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))


from app.models.agent import AIAgent  # noqa: E402
from app.models.agent import AIAgentConservation  # noqa: E402
from app.models.agent import AIAgentConservationCheckpoint  # noqa: E402
from app.models.ai import AI  # noqa: E402
from app.controller.agent import AIAgentController  # noqa: E402
from app.routers.agent import agent_route  # noqa: E402
from app.schemas.agent import AIAgentEventType  # noqa: E402


def test_conversation_model_uses_assignment_foreign_key():
    field = AIAgentConservation._meta.fields_map["assignment"]

    assert isinstance(field, ForeignKeyFieldInstance)
    assert "assign_id" not in AIAgentConservation._meta.fields_map


def test_checkpoint_model_uses_assignment_foreign_key_and_original_code():
    assignment_field = AIAgentConservationCheckpoint._meta.fields_map["assignment"]
    original_code_field = AIAgentConservationCheckpoint._meta.fields_map["original_code"]

    assert isinstance(assignment_field, ForeignKeyFieldInstance)
    assert "assign_id" not in AIAgentConservationCheckpoint._meta.fields_map
    assert getattr(original_code_field, "max_length", None) == 10000


@pytest.mark.asyncio
async def test_create_conversation_uses_assignment_id_foreign_key(monkeypatch):
    assignment = SimpleNamespace(id="assign-1")
    mocked_assignment_get = AsyncMock(return_value=assignment)
    mocked_create = AsyncMock(
        return_value=SimpleNamespace(
            id="conv-1",
            title="新的对话",
            created_at="2026-04-08T12:00:00Z",
            updated_at="2026-04-08T12:00:00Z",
            events=[],
        )
    )

    monkeypatch.setattr("app.controller.agent.Assignment.get", mocked_assignment_get)
    monkeypatch.setattr("app.controller.agent.AIAgentConservation.create", mocked_create)

    await AIAgentController.create_conversation("assign-1", "user-1")

    mocked_assignment_get.assert_awaited_once_with(id="assign-1")
    assert mocked_create.await_args.kwargs["assignment"] == assignment
    assert "assign_id" not in mocked_create.await_args.kwargs


@pytest.mark.asyncio
async def test_get_conversation_filters_by_assignment_id(monkeypatch):
    captured: dict[str, object] = {}
    conversation = SimpleNamespace(
        id="conv-1",
        title="新的对话",
        created_at="2026-04-08T12:00:00Z",
        updated_at="2026-04-08T12:00:00Z",
        events=[],
    )

    class FakeQuery:
        async def first(self):
            return conversation

    def fake_filter(**kwargs):
        captured.update(kwargs)
        return FakeQuery()

    assignment = SimpleNamespace(
        id="assign-1",
        agent_conversations=SimpleNamespace(filter=fake_filter),
    )
    monkeypatch.setattr("app.controller.agent.Assignment.get", AsyncMock(return_value=assignment))

    await AIAgentController.get_conversation("conv-1", "assign-1", "user-1")

    assert captured == {
        "id": "conv-1",
        "user_id": "user-1",
        "deleted_at": None,
    }


@pytest.mark.asyncio
async def test_request_ai_from_event_stream_supports_persisted_dict_events(monkeypatch):
    captured: dict[str, object] = {}

    async def fake_stream(messages):
        captured["messages"] = messages
        yield "ok"

    monkeypatch.setattr("app.models.agent.AI.get_response_stream", fake_stream)

    events = [
        {"type": "user_message", "payload": {"content": "你好"}},
        {"type": "think", "payload": {"content": "先分析一下"}},
        {"type": "tool_call", "payload": {"callId": "c1", "toolName": "read_editor", "input": ["main.cpp"]}},
        {"type": "tool_result", "payload": {"callId": "c1", "success": True, "output": "int main() {}"}},
        {"type": "final", "payload": {"content": "这是结果"}},
    ]

    stream = await AIAgent.request_ai_from_event_stream(events)
    output = []
    async for chunk in stream:
        output.append(chunk)

    assert output == ["ok"]
    assert captured["messages"] == [
        {"role": "user", "content": "你好"},
        {"role": "assistant", "content": "先分析一下"},
        {"role": "user", "content": "read_editor(main.cpp)"},
        {"role": "tool", "content": "int main() {}", "tool_call_id": "c1"},
        {"role": "assistant", "content": "这是结果"},
    ]


def build_agent_test_client():
    app = FastAPI()
    app.include_router(agent_route)
    return TestClient(app)


def test_agent_router_supports_get_conversation(monkeypatch):
    client = build_agent_test_client()
    mocked = AsyncMock(
        return_value={
            "conversation_id": "conv-1",
            "title": "新的对话",
            "created_at": "2026-04-08T12:00:00Z",
            "updated_at": "2026-04-08T12:00:00Z",
            "events": [],
        }
    )
    monkeypatch.setattr("app.routers.agent.AIAgentController.get_conversation", mocked)

    response = client.get(
        "/courses/course-1/assignments/assign-1/agent/conversations/conv-1",
        headers={"user_id": "user-1"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "conversation_id": "conv-1",
        "title": "新的对话",
        "created_at": "2026-04-08T12:00:00Z",
        "updated_at": "2026-04-08T12:00:00Z",
        "events": [],
    }
    mocked.assert_awaited_once_with(
        conversation_id="conv-1",
        assignment_id="assign-1",
        user_id="user-1",
    )


def test_agent_router_supports_create_conversation(monkeypatch):
    client = build_agent_test_client()
    mocked = AsyncMock(
        return_value={
            "conversation_id": "conv-1",
            "title": "新的对话",
            "created_at": "2026-04-08T12:00:00Z",
            "updated_at": "2026-04-08T12:00:00Z",
            "events": [],
        }
    )
    monkeypatch.setattr("app.routers.agent.AIAgentController.create_conversation", mocked)

    response = client.post(
        "/courses/course-1/assignments/assign-1/agent/conversations",
        headers={"user_id": "user-1"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "conversation_id": "conv-1",
        "title": "新的对话",
        "created_at": "2026-04-08T12:00:00Z",
        "updated_at": "2026-04-08T12:00:00Z",
        "events": [],
    }
    mocked.assert_awaited_once_with(assignment_id="assign-1", user_id="user-1")


def test_agent_router_supports_patch_conversation_title(monkeypatch):
    client = build_agent_test_client()
    mocked = AsyncMock(return_value={"message": "对话标题已更新"})
    monkeypatch.setattr("app.routers.agent.AIAgentController.update_conversation_title", mocked)

    response = client.patch(
        "/courses/course-1/assignments/assign-1/agent/conversations/conv-1/title",
        headers={"user_id": "user-1"},
        json={"title": "新的标题"},
    )

    assert response.status_code == 200
    assert response.json() == {"message": "对话标题已更新"}
    mocked.assert_awaited_once_with(
        conversation_id="conv-1",
        assignment_id="assign-1",
        user_id="user-1",
        title="新的标题",
    )


def test_agent_router_supports_batch_append_events(monkeypatch):
    client = build_agent_test_client()
    mocked = AsyncMock(return_value={"message": "事件追加成功"})
    monkeypatch.setattr("app.routers.agent.AIAgentController.append_events", mocked)

    response = client.post(
        "/courses/course-1/assignments/assign-1/agent/event",
        headers={"user_id": "user-1"},
        json={
            "conversation_id": "conv-1",
            "expected_event_count": 2,
            "events": [
                {"type": "think", "payload": {"content": "先分析一下"}},
                {"type": "turn_end", "payload": {"reason": "completed"}},
            ],
        },
    )

    assert response.status_code == 200
    assert response.json() == {"message": "事件追加成功"}
    mocked.assert_awaited_once()
    kwargs = mocked.await_args.kwargs
    assert kwargs["conversation_id"] == "conv-1"
    assert kwargs["assignment_id"] == "assign-1"
    assert kwargs["user_id"] == "user-1"
    assert kwargs["expected_event_count"] == 2
    assert [event.type for event in kwargs["events"]] == [
        AIAgentEventType.THINK,
        AIAgentEventType.TURN_END,
    ]
    assert [event.payload for event in kwargs["events"]] == [
        {"content": "先分析一下"},
        {"reason": "completed"},
    ]


def test_agent_router_supports_stream_messages(monkeypatch):
    client = build_agent_test_client()

    async def fake_stream_messages(assignment_id, user_id, messages):
        assert assignment_id == "assign-1"
        assert user_id == "user-1"
        assert messages == [
            {"role": "system", "content": "sys"},
            {"role": "user", "content": "hello"},
        ]

        async def _stream():
            yield "hello"
            yield " world"

        return _stream()

    monkeypatch.setattr("app.routers.agent.AIAgentController.stream_messages", fake_stream_messages)

    response = client.post(
        "/courses/course-1/assignments/assign-1/agent/stream",
        headers={"user_id": "user-1"},
        json={
            "messages": [
                {"role": "system", "content": "sys"},
                {"role": "user", "content": "hello"},
            ],
        },
    )

    assert response.status_code == 200
    assert response.text == "hello world"


def test_agent_router_supports_create_checkpoint(monkeypatch):
    client = build_agent_test_client()
    mocked = AsyncMock(return_value="cp-1")
    monkeypatch.setattr("app.routers.agent.AIAgentController.create_checkpoint", mocked)

    response = client.post(
        "/courses/course-1/assignments/assign-1/agent/checkpoints",
        json={"original_code": '[{"path":"main.cpp","content":"int main() {}"}]'},
    )

    assert response.status_code == 200
    assert response.json() == "cp-1"
    mocked.assert_awaited_once_with(
        assignment_id="assign-1",
        original_code='[{"path":"main.cpp","content":"int main() {}"}]',
    )


def test_agent_router_supports_get_checkpoint(monkeypatch):
    client = build_agent_test_client()
    mocked = AsyncMock(return_value='[{"path":"main.cpp","content":"int main() {}"}]')
    monkeypatch.setattr("app.routers.agent.AIAgentController.get_checkpoint", mocked)

    response = client.get(
        "/courses/course-1/assignments/assign-1/agent/checkpoints/cp-1",
    )

    assert response.status_code == 200
    assert response.json() == '[{"path":"main.cpp","content":"int main() {}"}]'
    mocked.assert_awaited_once_with(
        checkpoint_id="cp-1",
        assignment_id="assign-1",
    )


@pytest.mark.asyncio
async def test_ai_get_response_stream_accepts_message_list(monkeypatch):
    captured: dict[str, object] = {}

    class FakeDelta:
        content = "你好"

    class FakeChoice:
        delta = FakeDelta()

    class FakeChunk:
        choices = [FakeChoice()]

    def fake_create(**kwargs):
        captured["messages"] = kwargs["messages"]
        return [FakeChunk()]

    monkeypatch.setattr(AI.client.chat.completions, "create", fake_create)

    messages = [
        {"role": "system", "content": "你是助手"},
        {"role": "user", "content": "你好"},
    ]

    output = []
    async for chunk in AI.get_response_stream(messages):
        output.append(chunk)

    assert captured["messages"] == messages
    assert output == ["你好"]


@pytest.mark.asyncio
async def test_ai_get_response_stream_skips_chunks_without_choices(monkeypatch):
    class EmptyChunk:
        choices = []

    class FakeDelta:
        content = "你好"

    class FakeChoice:
        delta = FakeDelta()

    class ValidChunk:
        choices = [FakeChoice()]

    def fake_create(**kwargs):
        return [EmptyChunk(), ValidChunk()]

    monkeypatch.setattr(AI.client.chat.completions, "create", fake_create)

    output = []
    async for chunk in AI.get_response_stream("你好"):
        output.append(chunk)

    assert output == ["你好"]
