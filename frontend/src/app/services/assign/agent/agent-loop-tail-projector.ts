import type { MatrixAgentConversation, MatrixAgentEvent } from "../../../api/type/agent";

/**
 * 根据 stable 的 start index 将 snapshot 中的 event 更新到 conversation 中
 */
export function projectAgentLoopPassTail(
  conversation: MatrixAgentConversation,
  startIndex: number,
  events: MatrixAgentEvent[],
): MatrixAgentConversation {
  return {
    ...conversation,
    updatedAt: new Date().toISOString(),
    events: [
      ...conversation.events.slice(0, startIndex),
      ...events,
    ],
  };
}
