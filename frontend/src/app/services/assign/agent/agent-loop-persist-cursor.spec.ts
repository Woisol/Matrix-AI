import { AgentLoopPersistCursor } from './agent-loop-persist-cursor';
import type { MatrixAgentEvent } from '../../../api/type/agent';

describe('AgentLoopPersistCursor', () => {
  it('persists only the newly stable prefix of a pass', async () => {
    const persistSpy = jasmine.createSpy('persistSpy').and.callFake(async (expectedEventCount: number, events: MatrixAgentEvent[]) => expectedEventCount + events.length);
    const cursor = new AgentLoopPersistCursor(1, persistSpy);
    const displayEvents: MatrixAgentEvent[] = [
      { type: 'output', payload: { content: 'plain' } },
      { type: 'think', payload: { content: 'draft' } },
      { type: 'output', payload: { content: 'tail' } },
    ];

    await cursor.persistStablePrefix(displayEvents, 1);
    await cursor.persistStablePrefix(displayEvents, 2);
    await cursor.persistStablePrefix(displayEvents, 2);

    expect(persistSpy.calls.count()).toBe(2);
    expect(persistSpy.calls.argsFor(0)).toEqual([
      1,
      [{ type: 'output', payload: { content: 'plain' } }],
    ]);
    expect(persistSpy.calls.argsFor(1)).toEqual([
      2,
      [{ type: 'think', payload: { content: 'draft' } }],
    ]);
    expect(cursor.acknowledgedEventCount).toBe(3);
  });
});
