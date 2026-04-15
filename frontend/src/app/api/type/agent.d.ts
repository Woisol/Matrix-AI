export type ConversationId = string
export type CheckpointId = string

export type MatrixAgentConversationSummary = {
  conversationId: ConversationId
  title: string
  createdAt: string
  updatedAt: string
}

export type MatrixAgentConversation = MatrixAgentConversationSummary & {
  events: MatrixAgentEvent[]
}

//! woq Extract
// export type MatrixAgentEventUserMessage = Extract<MatrixAgentEvent, { type: 'user_message' }>
// export type MatrixAgentEventThink = Extract<MatrixAgentEvent, { type: 'think' }>
// export type MatrixAgentEventToolCall = Extract<MatrixAgentEvent, { type: 'tool_call' }>
// export type MatrixAgentEventToolResult = Extract<MatrixAgentEvent, { type: 'tool_result' }>
// export type MatrixAgentEventOutput = Extract<MatrixAgentEvent, { type: 'output' }>
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
export type MatrixAgentToolResultOutputObject = {
  // message: string
  checkpointId?: CheckpointId
  toString?: () => string
}
export type MatrixAgentToolResultOutput = string | MatrixAgentToolResultOutputObject
export type MatrixAgentEventToolResult = {
  type: 'tool_result'
  payload: {
    callId: string
    success: boolean
    output?: MatrixAgentToolResultOutput
  }
}
export type MatrixAgentEventOutput = {
  type: 'output'
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
    detail?: string
  }
}
export type MatrixAgentEvent =
  | MatrixAgentEventUserMessage
  | MatrixAgentEventThink
  | MatrixAgentEventToolCall
  | MatrixAgentEventToolResult
  | MatrixAgentEventOutput
  | MatrixAgentEventTurnEnd

export type MatrixAgentAppendEventsRequest = {
  conversationId: ConversationId
  expectedEventCount: number
  events: MatrixAgentEvent[]
}

export type MatrixAgentOverrideEventsRequest = {
  conversationId: ConversationId
  events: MatrixAgentEvent[]
}

export type MatrixAgentOperationResponse = {
  message: string
}
