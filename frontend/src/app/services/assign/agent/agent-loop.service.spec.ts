import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { signal, WritableSignal } from '@angular/core';

import { AssignData } from '../../../api/type/assigment';
import { MatrixAgentConversation, MatrixAgentEvent } from '../../../api/type/agent';
import { AgentService } from './agent.service';
import { AgentLoopService, AgentLoopToolName } from './agent-loop.service';
import { SYSTEM_PROMPT } from './agent.constant';

type AppendResult = { ok: true; status: number } | { ok: false; status: number; detail?: string };

describe('AgentLoopService', () => {
  const agentServiceStub = {
    appendEventsWithResult$: jasmine.createSpy('appendEventsWithResult$').and.returnValue(of({ ok: true, status: 200 } satisfies AppendResult)),
    getConversation$: jasmine.createSpy('getConversation$').and.returnValue(of(undefined)),
    streamMessages: jasmine.createSpy('streamMessages'),
    appendLocalEvents: jasmine.createSpy('appendLocalEvents').and.callFake((
      conversationSignal: WritableSignal<MatrixAgentConversation | null | undefined>,
      events: MatrixAgentEvent[],
    ) => {
      const conversation = conversationSignal();
      if (!conversation) return;
      conversationSignal.set({
        ...conversation,
        updatedAt: 'updated',
        events: [...conversation.events, ...events],
      });
    }),
  };

  beforeEach(() => {
    agentServiceStub.appendEventsWithResult$.calls.reset();
    agentServiceStub.appendEventsWithResult$.and.returnValue(of({ ok: true, status: 200 } satisfies AppendResult));
    agentServiceStub.getConversation$.calls.reset();
    agentServiceStub.getConversation$.and.returnValue(of(undefined));
    agentServiceStub.streamMessages.calls.reset();
    agentServiceStub.appendLocalEvents.calls.reset();

    TestBed.configureTestingModule({
      providers: [
        AgentLoopService,
        { provide: AgentService, useValue: agentServiceStub },
      ],
    });
  });

  function asyncChunks(chunks: string[], onChunkConsumed?: (index: number) => void) {
    return (async function* () {
      for (let index = 0; index < chunks.length; index += 1) {
        yield chunks[index];
        onChunkConsumed?.(index);
      }
    })();
  }

  function createConversation(): MatrixAgentConversation {
    return {
      conversationId: 'conv-1',
      title: 'New conversation',
      createdAt: '2026-04-11T10:00:00Z',
      updatedAt: '2026-04-11T10:00:00Z',
      events: [],
    };
  }

  function createAssignData(): AssignData {
    return {
      assignId: 'assign-1' as any,
      title: 'Problem title',
      description: 'Problem description',
      assignOriginalCode: [{ fileName: 'main.cpp', content: 'int main() { return 0; }' }],
      submit: undefined,
    };
  }

  function runConfig(
    conversationSignal: WritableSignal<MatrixAgentConversation | null>,
    overrides: Partial<ReturnType<typeof runConfigBase>> = {},
  ) {
    return {
      ...runConfigBase(conversationSignal),
      ...overrides,
    };
  }

  function runConfigBase(conversationSignal: WritableSignal<MatrixAgentConversation | null>) {
    return {
      courseId: 'course-1' as any,
      assignId: 'assign-1' as any,
      userId: 'Matrix AI',
      userMessageContent: 'help me',
      conversationSignal,
      assignData: createAssignData(),
      analysis: undefined,
      updateConversationTitle: () => undefined,
      getEditorContent: () => 'int main() { return 0; }',
      getSelectionContent: () => null,
      writeEditorContent: async () => ({ success: true, output: 'Content written to editor successfully.' }),
      playground: async () => 'playground result',
      enabledTools: ['read_editor', 'read_problem_info'] as AgentLoopToolName[],
    };
  }

  it('builds system prompt with xml protocol and enabled tools', () => {
    const prompt = SYSTEM_PROMPT('read_editor, read_problem_info');

    expect(prompt).toContain('<think>');
    expect(prompt).toContain('<tool_call>');
    expect(prompt).toContain('<output>');
    expect(prompt).toContain('read_editor');
    expect(prompt).toContain('read_problem_info');
    expect(prompt).not.toContain('write_editor');
  });

  it('rewrites draft output into stable output and think blocks when think closes', async () => {
    const conversationSignal = signal<MatrixAgentConversation | null>(createConversation());
    const snapshots: MatrixAgentEvent[][] = [];

    agentServiceStub.streamMessages.and.returnValue(asyncChunks(
      ['plain<think>draft', '</think>tail'],
      (index) => {
        snapshots[index] = [...(conversationSignal()?.events ?? [])];
      },
    ));

    const service = TestBed.inject(AgentLoopService);

    await service.emitAgentLoop(runConfig(conversationSignal));

    expect(snapshots[0]).toEqual([
      { type: 'user_message', payload: { content: 'help me' } },
      { type: 'output', payload: { content: 'plain' } },
      { type: 'think', payload: { content: 'draft' } },
    ]);
    expect(snapshots[1]).toEqual([
      { type: 'user_message', payload: { content: 'help me' } },
      { type: 'output', payload: { content: 'plain' } },
      { type: 'think', payload: { content: 'draft' } },
      { type: 'output', payload: { content: 'tail' } },
    ]);

    expect(agentServiceStub.appendEventsWithResult$.calls.argsFor(0)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 0,
      events: [{ type: 'user_message', payload: { content: 'help me' } }],
    });
    expect(agentServiceStub.appendEventsWithResult$.calls.argsFor(1)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 1,
      events: [{ type: 'output', payload: { content: 'plain' } }],
    });
    expect(agentServiceStub.appendEventsWithResult$.calls.argsFor(2)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 2,
      events: [
        { type: 'think', payload: { content: 'draft' } },
      ],
    });
    expect(agentServiceStub.appendEventsWithResult$.calls.argsFor(3)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 3,
      events: [
        { type: 'output', payload: { content: 'tail' } },
      ],
    });
    expect(agentServiceStub.appendEventsWithResult$.calls.argsFor(4)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 4,
      events: [{ type: 'turn_end', payload: { reason: 'completed' } }],
    });

    expect(conversationSignal()?.events).toEqual([
      { type: 'user_message', payload: { content: 'help me' } },
      { type: 'output', payload: { content: 'plain' } },
      { type: 'think', payload: { content: 'draft' } },
      { type: 'output', payload: { content: 'tail' } },
      { type: 'turn_end', payload: { reason: 'completed' } },
    ]);
  });

  it('persists the full plain-text response after the pass finishes even when the text streamed in multiple chunks', async () => {
    const conversationSignal = signal<MatrixAgentConversation | null>(createConversation());

    agentServiceStub.streamMessages.and.returnValue(asyncChunks(['plain ', 'text']));

    const service = TestBed.inject(AgentLoopService);

    await service.emitAgentLoop(runConfig(conversationSignal));

    expect(agentServiceStub.appendEventsWithResult$.calls.argsFor(1)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 1,
      events: [{ type: 'output', payload: { content: 'plain text' } }],
    });
    expect(agentServiceStub.appendEventsWithResult$.calls.argsFor(2)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 2,
      events: [{ type: 'turn_end', payload: { reason: 'completed' } }],
    });

    expect(conversationSignal()?.events).toEqual([
      { type: 'user_message', payload: { content: 'help me' } },
      { type: 'output', payload: { content: 'plain text' } },
      { type: 'turn_end', payload: { reason: 'completed' } },
    ]);
  });

  it('keeps tool calls in place, delays tool execution until pass end, and appends tool results afterward', async () => {
    const conversationSignal = signal<MatrixAgentConversation | null>(createConversation());
    const snapshots: MatrixAgentEvent[][] = [];

    agentServiceStub.streamMessages.and.returnValues(
      asyncChunks(
        [
          'before<tool_call>{"toolName":"read_editor","input":[]}</tool_call>',
          'after<tool_call>{"toolName":"read_problem_info","input":[]}</tool_call>end',
        ],
        (index) => {
          snapshots[index] = [...(conversationSignal()?.events ?? [])];
        },
      ),
      asyncChunks(['<output>done</output>']),
    );

    const service = TestBed.inject(AgentLoopService);

    await service.emitAgentLoop(runConfig(conversationSignal));

    expect(snapshots[0]).toEqual([
      { type: 'user_message', payload: { content: 'help me' } },
      { type: 'output', payload: { content: 'before' } },
      { type: 'tool_call', payload: { callId: 'call-1', toolName: 'read_editor', input: [] } },
    ]);
    expect(snapshots[1]).toEqual([
      { type: 'user_message', payload: { content: 'help me' } },
      { type: 'output', payload: { content: 'before' } },
      { type: 'tool_call', payload: { callId: 'call-1', toolName: 'read_editor', input: [] } },
      { type: 'output', payload: { content: 'after' } },
      { type: 'tool_call', payload: { callId: 'call-2', toolName: 'read_problem_info', input: [] } },
      { type: 'output', payload: { content: 'end' } },
    ]);

    expect(agentServiceStub.appendEventsWithResult$.calls.argsFor(0)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 0,
      events: [{ type: 'user_message', payload: { content: 'help me' } }],
    });
    expect(agentServiceStub.appendEventsWithResult$.calls.argsFor(1)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 1,
      events: [
        { type: 'output', payload: { content: 'before' } },
        { type: 'tool_call', payload: { callId: 'call-1', toolName: 'read_editor', input: [] } },
      ],
    });
    expect(agentServiceStub.appendEventsWithResult$.calls.argsFor(2)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 3,
      events: [
        { type: 'output', payload: { content: 'after' } },
        { type: 'tool_call', payload: { callId: 'call-2', toolName: 'read_problem_info', input: [] } },
      ],
    });
    expect(agentServiceStub.appendEventsWithResult$.calls.argsFor(3)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 5,
      events: [
        { type: 'output', payload: { content: 'end' } },
      ],
    });
    expect(agentServiceStub.appendEventsWithResult$.calls.argsFor(4)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 6,
      events: [{ type: 'tool_result', payload: { callId: 'call-1', success: true, output: 'int main() { return 0; }' } }],
    });

    const secondToolResult = agentServiceStub.appendEventsWithResult$.calls.argsFor(5)[3].events[0];
    expect(secondToolResult.type).toBe('tool_result');
    expect(secondToolResult.payload.callId).toBe('call-2');
    expect(secondToolResult.payload.success).toBeTrue();
    expect(secondToolResult.payload.output).toContain('Problem title');
    expect(secondToolResult.payload.output).toContain('Problem description');

    expect(agentServiceStub.appendEventsWithResult$.calls.argsFor(6)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 8,
      events: [{ type: 'output', payload: { content: 'done' } }],
    });
    expect(agentServiceStub.appendEventsWithResult$.calls.argsFor(7)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 9,
      events: [{ type: 'turn_end', payload: { reason: 'completed' } }],
    });

    expect(agentServiceStub.streamMessages.calls.count()).toBe(2);
    expect(conversationSignal()?.events).toEqual([
      { type: 'user_message', payload: { content: 'help me' } },
      { type: 'output', payload: { content: 'before' } },
      { type: 'tool_call', payload: { callId: 'call-1', toolName: 'read_editor', input: [] } },
      { type: 'output', payload: { content: 'after' } },
      { type: 'tool_call', payload: { callId: 'call-2', toolName: 'read_problem_info', input: [] } },
      { type: 'output', payload: { content: 'end' } },
      { type: 'tool_result', payload: { callId: 'call-1', success: true, output: 'int main() { return 0; }' } },
      secondToolResult,
      { type: 'output', payload: { content: 'done' } },
      { type: 'turn_end', payload: { reason: 'completed' } },
    ]);
  });

  it('feeds malformed closed tool_call blocks back as tool errors so the model can self-correct', async () => {
    const conversationSignal = signal<MatrixAgentConversation | null>(createConversation());

    agentServiceStub.streamMessages.and.returnValues(
      asyncChunks(['<tool_call>{"toolName":"read_editor","input":}</tool_call>']),
      asyncChunks(['<output>fixed answer</output>']),
    );

    const service = TestBed.inject(AgentLoopService);

    await service.emitAgentLoop(runConfig(conversationSignal));

    expect(agentServiceStub.appendEventsWithResult$.calls.argsFor(1)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 1,
      events: [{
        type: 'tool_result',
        payload: {
          callId: 'call-1',
          success: false,
          output: 'Invalid tool_call payload. Use JSON {"toolName":"...","input":["..."]} or comma-separated "toolName, arg1, arg2".',
        },
      }],
    });
    expect(agentServiceStub.appendEventsWithResult$.calls.argsFor(2)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 2,
      events: [{ type: 'output', payload: { content: 'fixed answer' } }],
    });
    expect(agentServiceStub.appendEventsWithResult$.calls.argsFor(3)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 3,
      events: [{ type: 'turn_end', payload: { reason: 'completed' } }],
    });
    expect(conversationSignal()?.events).toEqual([
      { type: 'user_message', payload: { content: 'help me' } },
      {
        type: 'tool_result',
        payload: {
          callId: 'call-1',
          success: false,
          output: 'Invalid tool_call payload. Use JSON {"toolName":"...","input":["..."]} or comma-separated "toolName, arg1, arg2".',
        },
      },
      { type: 'output', payload: { content: 'fixed answer' } },
      { type: 'turn_end', payload: { reason: 'completed' } },
    ]);
  });

  it('propagates checkpoint ids from successful write_editor tool executions into tool_result events', async () => {
    const conversationSignal = signal<MatrixAgentConversation | null>(createConversation());

    agentServiceStub.streamMessages.and.returnValues(
      asyncChunks(['<tool_call>{"toolName":"write_editor","input":["full-editor","int main() { return 1; }"]}</tool_call>']),
      asyncChunks(['<output>done</output>']),
    );

    const service = TestBed.inject(AgentLoopService);

    await service.emitAgentLoop(runConfig(conversationSignal, {
      enabledTools: ['write_editor'] as AgentLoopToolName[],
      writeEditorContent: async () => ({
        success: true,
        output: {
          message: 'Content written to editor successfully.',
          checkpointId: 'cp-1',
          toString: () => 'Content written to editor successfully.',
        },
      }),
    }));

    expect(agentServiceStub.appendEventsWithResult$.calls.argsFor(1)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 1,
      events: [{ type: 'tool_call', payload: { callId: 'call-1', toolName: 'write_editor', input: ['full-editor', 'int main() { return 1; }'] } }],
    });
    expect(agentServiceStub.appendEventsWithResult$.calls.argsFor(2)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 2,
      events: [{
        type: 'tool_result',
        payload: {
          callId: 'call-1',
          success: true,
          output: jasmine.objectContaining({
            message: 'Content written to editor successfully.',
            checkpointId: 'cp-1',
          }),
        },
      }],
    });
  });

  it('reloads the conversation and aborts when persistence reports a conflict', async () => {
    const conversationSignal = signal<MatrixAgentConversation | null>(createConversation());
    const remoteConversation: MatrixAgentConversation = {
      ...createConversation(),
      title: 'Reloaded conversation',
      events: [{ type: 'user_message', payload: { content: 'remote update' } }],
    };

    agentServiceStub.appendEventsWithResult$.and.returnValues(
      of({ ok: true, status: 200 } satisfies AppendResult),
      of({ ok: false, status: 409, detail: 'expected_event_count mismatch' } satisfies AppendResult),
    );
    agentServiceStub.getConversation$.and.returnValue(of(remoteConversation));
    agentServiceStub.streamMessages.and.returnValue(asyncChunks(['plain answer']));

    const service = TestBed.inject(AgentLoopService);

    await expectAsync(service.emitAgentLoop(runConfig(conversationSignal)))
      .toBeRejectedWithError('Persist conflict: expected_event_count mismatch');

    expect(agentServiceStub.getConversation$).toHaveBeenCalledWith('course-1', 'assign-1', 'conv-1', 'Matrix AI');
    expect(agentServiceStub.streamMessages.calls.count()).toBe(1);
    expect(conversationSignal()).toEqual(remoteConversation);
  });
});
