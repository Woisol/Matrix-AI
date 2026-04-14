import { parseAgentLoopPass } from './agent-loop-pass-parser';
import type { AgentLoopToolName } from './agent-loop.service';

describe('parseAgentLoopPass', () => {
  const enabledTools: AgentLoopToolName[] = ['read_editor', 'read_problem_info'];

  it('keeps trailing plain output unstable until finalize so persistence does not truncate a growing text block', () => {
    const draftSnapshot = parseAgentLoopPass({
      rawText: 'plain text',
      existingToolCallIds: [],
      enabledTools,
      finalize: false,
      nextCallId: () => 'call-1',
    });

    expect(draftSnapshot.displayEvents).toEqual([
      { type: 'output', payload: { content: 'plain text' } },
    ]);
    expect(draftSnapshot.stableCount).toBe(0);

    const finalSnapshot = parseAgentLoopPass({
      rawText: 'plain text',
      existingToolCallIds: [],
      enabledTools,
      finalize: true,
      nextCallId: () => 'call-1',
    });

    expect(finalSnapshot.displayEvents).toEqual([
      { type: 'output', payload: { content: 'plain text' } },
    ]);
    expect(finalSnapshot.stableCount).toBe(1);
  });

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
    expect(snapshot.stableCount).toBe(2);
  });

  it('supports comma-delimited tool_call payloads', () => {
    const snapshot = parseAgentLoopPass({
      rawText: '<tool_call>read_editor, main.cpp, selected line</tool_call>',
      existingToolCallIds: [],
      enabledTools,
      finalize: true,
      nextCallId: () => 'call-1',
    });

    expect(snapshot.displayEvents).toEqual([
      { type: 'tool_call', payload: { callId: 'call-1', toolName: 'read_editor', input: ['main.cpp', 'selected line'] } },
    ]);
    expect(snapshot.toolCalls).toEqual([
      { type: 'tool_call', payload: { callId: 'call-1', toolName: 'read_editor', input: ['main.cpp', 'selected line'] } },
    ]);
  });

  it('reuses existing tool call ids and turns malformed closed tool_call blocks into tool errors instead of plain output', () => {
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
      {
        type: 'tool_result',
        payload: {
          callId: 'call-new',
          success: false,
          output: 'Invalid tool_call payload. Use JSON {"toolName":"...","input":["..."]} or comma-separated "toolName, arg1, arg2".',
        },
      },
    ]);
    expect(snapshot.toolCalls).toEqual([
      { type: 'tool_call', payload: { callId: 'call-7', toolName: 'read_editor', input: [] } },
    ]);
    expect(snapshot.stableCount).toBe(4);
  });
});
