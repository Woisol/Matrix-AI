import { parseAgentLoopPass } from './agent-loop-pass-parser';
import type { AgentLoopToolName } from './agent-loop.service';

describe('parseAgentLoopPass', () => {
  const enabledTools: AgentLoopToolName[] = ['read_editor', 'read_problem_info'];

  it('creates a draft think block as soon as a think tag starts', () => {
    const snapshot = parseAgentLoopPass({
      rawText: 'plain<think>draft',
      existingToolCallIds: [],
      enabledTools,
      finalize: false,
      nextCallId: () => 'call-1',
    });

    expect(snapshot.displayEvents).toEqual([
      { type: 'output', payload: { content: 'plain' } },
      { type: 'think', payload: { content: 'draft' } },
    ]);
    expect(snapshot.stableCount).toBe(1);
    expect(snapshot.toolCalls).toEqual([]);
  });

  it('stabilizes a closed think block and trailing output', () => {
    const snapshot = parseAgentLoopPass({
      rawText: 'plain<think>draft</think>tail',
      existingToolCallIds: [],
      enabledTools,
      finalize: false,
      nextCallId: () => 'call-1',
    });

    expect(snapshot.displayEvents).toEqual([
      { type: 'output', payload: { content: 'plain' } },
      { type: 'think', payload: { content: 'draft' } },
      { type: 'output', payload: { content: 'tail' } },
    ]);
    expect(snapshot.stableCount).toBe(3);
  });

  it('reuses existing tool call ids and degrades malformed tool_call blocks to output', () => {
    const snapshot = parseAgentLoopPass({
      rawText: 'before<tool_call>{"toolName":"read_editor","input":[]}</tool_call>broken<tool_call>{"toolName":"read_editor","input":}</tool_call>',
      existingToolCallIds: ['call-7'],
      enabledTools,
      finalize: true,
      nextCallId: () => 'call-new',
    });

    expect(snapshot.displayEvents).toEqual([
      { type: 'output', payload: { content: 'before' } },
      { type: 'tool_call', payload: { callId: 'call-7', toolName: 'read_editor', input: [] } },
      { type: 'output', payload: { content: 'broken' } },
      { type: 'output', payload: { content: '<tool_call>{"toolName":"read_editor","input":}</tool_call>' } },
    ]);
    expect(snapshot.toolCalls).toEqual([
      { type: 'tool_call', payload: { callId: 'call-7', toolName: 'read_editor', input: [] } },
    ]);
  });
});
