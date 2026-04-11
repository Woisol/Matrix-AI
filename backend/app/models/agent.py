from collections.abc import AsyncIterable
from tortoise import fields
from tortoise.models import Model

from app.models.ai import AI
from app.schemas.agent import AIAgentEvent, AIAgentEventType

class AIAgentConservation(Model):
    """AI Agent 对话记录模型"""
    id = fields.CharField(max_length=50, pk=True, description="对话记录ID，")
    assign_id = fields.CharField(max_length=50, description="关联的作业ID")
    user_id = fields.CharField(max_length=50, description="用户ID")
    title = fields.CharField(max_length=200, description="会话标题")
    deleted_at = fields.DatetimeField(null=True, description="删除时间")
    created_at = fields.DatetimeField(auto_now_add=True, description="创建时间")
    updated_at = fields.DatetimeField(auto_now=True, description="更新时间")
    events = fields.JSONField(description="对话内容，包含用户输入和AI回复的列表")

    class Meta:
        table = "ai_agent_conversations"
        table_description = "AI Agent 对话记录表"
        indexes = [
            ("assign_id",),  # 按作业ID查询对话记录
        ]
class AIAgent:
    """AI Agent 实现，主要负责转发模型数据以及持久化"""
    @classmethod
    async def append_events(
        cls,
        conversation: AIAgentConservation,
        expected_event_count: int,
        events: list[AIAgentEvent],
    ) -> None:
        """将一批事件顺序追加到会话中，并校验前端预期事件数。"""
        current_events = list(conversation.events or [])
        if len(current_events) != expected_event_count:
            raise ValueError(f"expected_event_count mismatch: expected {expected_event_count}, got {len(current_events)}")

        # JSONField 里只存可序列化字典，避免后续读取时对象/字典混用。
        current_events.extend(event.model_dump() for event in events)
        conversation.events = current_events
        try:
            await conversation.save()
        except Exception as e:
            raise Exception("保存事件失败：" + str(e))
        return

    @classmethod
    def _normalize_event(cls, event: AIAgentEvent | dict) -> tuple[str, dict]:
        if isinstance(event, dict):
            return str(event.get("type", "")), event.get("payload", {}) or {}
        return event.type.value, event.payload or {}

    @classmethod
    def _tool_call_to_message_content(cls, payload: dict) -> str:
        tool_name = str(payload.get("toolName", "")).strip()
        inputs = payload.get("input", [])
        if not isinstance(inputs, list):
            inputs = [str(inputs)]
        joined_inputs = ", ".join(str(item) for item in inputs)
        if tool_name and joined_inputs:
            return f"{tool_name}({joined_inputs})"
        if tool_name:
            return f"{tool_name}()"
        return joined_inputs

    @classmethod
    async def request_ai_from_event_stream(cls, events: list[AIAgentEvent] | list[dict]) -> AsyncIterable[str]:
        """接收前端新 event 请求，转发到实际模型并持久化存储"""
        messages = []
        for event in events:
            event_type, payload = cls._normalize_event(event)
            content = str(payload.get("content", ""))

            match event_type:
                case AIAgentEventType.USER_MESSAGE.value:
                    messages.append({"role": "user", "content": content})
                case AIAgentEventType.THINK.value | AIAgentEventType.FINAL.value:
                    messages.append({"role": "assistant", "content": content})
                case AIAgentEventType.TOOL_CALL.value:
                    messages.append({"role": "user", "content": cls._tool_call_to_message_content(payload)})
                case AIAgentEventType.TOOL_RESULT.value:
                    # OpenAI tool 角色通常要求 tool_call_id；缺失时降级为 user 内容避免请求报错。
                    # 怪不得 5.4 一直说要有个 callId 原来是官方 SDK 的 tool 角色要求
                    tool_call_id = payload.get("callId")
                    output = str(payload.get("output", ""))
                    if tool_call_id:
                        messages.append({"role": "tool", "content": output, "tool_call_id": tool_call_id})
                    else:
                        messages.append({"role": "user", "content": output})
                case AIAgentEventType.TURN_END.value:
                    continue

        return AI.get_response_stream(messages)

