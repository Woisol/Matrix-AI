import type { MatrixAgentEvent } from "../../../api/type/agent";

export class AgentLoopPersistCursor {
  acknowledgedEventCount: number;

  private persistedStableCount = 0;

  constructor(
    initialEventCount: number,
    private readonly persistFn: (expectedEventCount: number, events: MatrixAgentEvent[]) => Promise<number>,
  ) {
    this.acknowledgedEventCount = initialEventCount;
  }

  async persistStablePrefix(displayEvents: MatrixAgentEvent[], stableCount: number): Promise<number> {
    if (stableCount <= this.persistedStableCount) {
      return this.acknowledgedEventCount;
    }

    const newStableEvents = displayEvents.slice(this.persistedStableCount, stableCount);
    if (!newStableEvents.length) {
      this.persistedStableCount = stableCount;
      return this.acknowledgedEventCount;
    }

    this.acknowledgedEventCount = await this.persistFn(this.acknowledgedEventCount, newStableEvents);
    this.persistedStableCount = stableCount;
    return this.acknowledgedEventCount;
  }
}
