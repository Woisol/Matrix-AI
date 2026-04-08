import { AssignId } from "./general"

export type ConversationId = string

export type MatrixAgentConversation = {
  conversationUuid: ConversationId
  title: string
  createdAt: string
  updatedAt: string
  events: MatrixAgentEvent[]
}

//! woq Extract
// export type MatrixAgentEventUserMessage = Extract<MatrixAgentEvent, { type: 'user_message' }>
// export type MatrixAgentEventThink = Extract<MatrixAgentEvent, { type: 'think' }>
// export type MatrixAgentEventToolCall = Extract<MatrixAgentEvent, { type: 'tool_call' }>
// export type MatrixAgentEventToolResult = Extract<MatrixAgentEvent, { type: 'tool_result' }>
// export type MatrixAgentEventAssistantFinal = Extract<MatrixAgentEvent, { type: 'assistant_final' }>
// export type MatrixAgentEventTurnEnd = Extract<MatrixAgentEvent, { type: 'turn_end' }>

export type MatrixAgentEventUserMessage = {
  type: 'user_message'
  payload: {
    content: string
  }
}
export type MatrixAgentEventThink = {
  type: 'think'
  payload: {
    content: string
  }
}
export type MatrixAgentEventToolCall = {
  type: 'tool_call'
  payload: {
    callId: string
    toolName: string
    input: string[]
  }
}
export type MatrixAgentEventToolResult = {
  type: 'tool_result'
  payload: {
    callId: string
    success: boolean
    output: string
  }
}
export type MatrixAgentEventAssistantFinal = {
  type: 'assistant_final'
  payload: {
    content: string
  }
}
export type MatrixAgentEventTurnEndReason =
  | 'completed'
  | 'aborted'
  | 'page_unload'
  | 'max_turn_limit_reached'
  | 'tool_retry_limit_reached'
  | 'client_error'
  | 'server_error'
export type MatrixAgentEventTurnEnd = {
  type: 'turn_end'
  payload: {
    reason: MatrixAgentEventTurnEndReason
  }
}
export type MatrixAgentEvent =
  | MatrixAgentEventUserMessage
  | MatrixAgentEventThink
  | MatrixAgentEventToolCall
  | MatrixAgentEventToolResult
  | MatrixAgentEventAssistantFinal
  | MatrixAgentEventTurnEnd
