import sys
from pathlib import Path
from unittest.mock import AsyncMock

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient


BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))


from app.models.agent import AIAgent  # noqa: E402
from app.routers.agent import agent_route  # noqa: E402
from app.schemas.agent import AIAgentEventType  # noqa: E402


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
        {"type": "assistant_final", "payload": {"content": "这是结果"}},
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
        params={"user_id": "user-1"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "conversation_id": "conv-1",
        "title": "新的对话",
        "created_at": "2026-04-08T12:00:00Z",
        "updated_at": "2026-04-08T12:00:00Z",
        "events": [],
    }
    mocked.assert_awaited_once_with("conv-1", "assign-1", "user-1")


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
        params={"user_id": "user-1"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "conversation_id": "conv-1",
        "title": "新的对话",
        "created_at": "2026-04-08T12:00:00Z",
        "updated_at": "2026-04-08T12:00:00Z",
        "events": [],
    }
    mocked.assert_awaited_once_with("assign-1", "user-1")


def test_agent_router_supports_patch_conversation_title(monkeypatch):
    client = build_agent_test_client()
    mocked = AsyncMock(return_value={"message": "对话标题已更新"})
    monkeypatch.setattr("app.routers.agent.AIAgentController.update_conversation_title", mocked)

    response = client.patch(
        "/courses/course-1/assignments/assign-1/agent/conversations/conv-1/title",
        params={"user_id": "user-1"},
        json={"title": "新的标题"},
    )

    assert response.status_code == 200
    assert response.json() == {"message": "对话标题已更新"}
    mocked.assert_awaited_once_with("conv-1", "assign-1", "user-1", "新的标题")


def test_agent_router_supports_batch_append_events(monkeypatch):
    client = build_agent_test_client()
    mocked = AsyncMock(return_value={"message": "事件追加成功"})
    monkeypatch.setattr("app.routers.agent.AIAgentController.append_events", mocked)

    response = client.post(
        "/courses/course-1/assignments/assign-1/agent/event",
        params={"user_id": "user-1"},
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
    args = mocked.await_args.args
    assert args[:4] == ("conv-1", "assign-1", "user-1", 2)
    assert [event.type for event in args[4]] == [
        AIAgentEventType.THINK,
        AIAgentEventType.TURN_END,
    ]
    assert [event.payload for event in args[4]] == [
        {"content": "先分析一下"},
        {"reason": "completed"},
    ]
