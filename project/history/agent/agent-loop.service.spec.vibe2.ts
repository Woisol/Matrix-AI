import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import type { MatrixAgentConversation } from '../../../api/type/agent';
import { AgentService } from './agent.service';
import { AgentLoopService } from './agent-loop.service';
import { NotificationService } from '../../notification/notification.service';

describe('AgentLoopService', () => {
  const agentServiceStub = {
    appendEvents$: jasmine.createSpy('appendEvents$').and.returnValue(of(200)),
    streamMessages: jasmine.createSpy('streamMessages'),
    getConversation$: jasmine.createSpy('getConversation$').and.returnValue(of(undefined)),
  };

  const notificationServiceStub = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error'),
    info: jasmine.createSpy('info'),
    warning: jasmine.createSpy('warning'),
  };

  beforeEach(() => {
    agentServiceStub.appendEvents$.calls.reset();
    agentServiceStub.streamMessages.calls.reset();
    agentServiceStub.getConversation$.calls.reset();
    agentServiceStub.appendEvents$.and.returnValue(of(200));
    agentServiceStub.getConversation$.and.returnValue(of(undefined));
    notificationServiceStub.success.calls.reset();
    notificationServiceStub.error.calls.reset();
    notificationServiceStub.info.calls.reset();
    notificationServiceStub.warning.calls.reset();

    TestBed.configureTestingModule({
      providers: [
        AgentLoopService,
        { provide: AgentService, useValue: agentServiceStub },
        { provide: NotificationService, useValue: notificationServiceStub },
      ],
    });
  });

  it('persists user message, plain text output, and completed turn end', async () => {
    async function* plainTextStream(): AsyncGenerator<string, void, void> {
      yield 'hello world';
    }

    agentServiceStub.streamMessages.and.returnValue(plainTextStream());

    const service = TestBed.inject(AgentLoopService);
    const conversationSignal = signal<MatrixAgentConversation | null | undefined>({
      conversationId: 'conv-1',
      title: 'New Conversation',
      createdAt: '2026-04-13T10:00:00Z',
      updatedAt: '2026-04-13T10:00:00Z',
      events: [],
    });

    await service.emitAgentLoop({
      courseId: 'course-1',
      assignId: 'assign-1',
      userId: 'user-1',
      userMessageContent: 'hello',
      conversationSignal,
      getEditorContent: () => 'int main() {}',
      getSelectionContent: () => null,
    });

    expect(agentServiceStub.appendEvents$.calls.count()).toBe(3);
    expect(agentServiceStub.appendEvents$.calls.argsFor(0)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 0,
      events: [
        { type: 'user_message', payload: { content: 'hello' } },
      ],
    });
    expect(agentServiceStub.appendEvents$.calls.argsFor(1)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 1,
      events: [
        { type: 'output', payload: { content: 'hello world' } },
      ],
    });
    expect(agentServiceStub.appendEvents$.calls.argsFor(2)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 2,
      events: [
        { type: 'turn_end', payload: { reason: 'completed' } },
      ],
    });
    expect(conversationSignal()?.events).toEqual([
      { type: 'user_message', payload: { content: 'hello' } },
      { type: 'output', payload: { content: 'hello world' } },
      { type: 'turn_end', payload: { reason: 'completed' } },
    ]);
  });

  it('rewrites draft output into output and think events once think closes', async () => {
    async function* thinkStream(): AsyncGenerator<string, void, void> {
      yield 'hello<think>pla';
      yield 'n</think>tail';
    }

    agentServiceStub.streamMessages.and.returnValue(thinkStream());

    const service = TestBed.inject(AgentLoopService);
    const conversationSignal = signal<MatrixAgentConversation | null | undefined>({
      conversationId: 'conv-2',
      title: 'Think Conversation',
      createdAt: '2026-04-13T10:00:00Z',
      updatedAt: '2026-04-13T10:00:00Z',
      events: [],
    });

    await service.emitAgentLoop({
      courseId: 'course-1',
      assignId: 'assign-1',
      userId: 'user-1',
      userMessageContent: 'help',
      conversationSignal,
      getEditorContent: () => 'int main() {}',
      getSelectionContent: () => null,
    });

    expect(agentServiceStub.appendEvents$.calls.count()).toBe(4);
    expect(agentServiceStub.appendEvents$.calls.argsFor(1)[3]).toEqual({
      conversationId: 'conv-2',
      expectedEventCount: 1,
      events: [
        { type: 'output', payload: { content: 'hello' } },
        { type: 'think', payload: { content: 'plan' } },
      ],
    });
    expect(agentServiceStub.appendEvents$.calls.argsFor(2)[3]).toEqual({
      conversationId: 'conv-2',
      expectedEventCount: 3,
      events: [
        { type: 'output', payload: { content: 'tail' } },
      ],
    });
    expect(conversationSignal()?.events).toEqual([
      { type: 'user_message', payload: { content: 'help' } },
      { type: 'output', payload: { content: 'hello' } },
      { type: 'think', payload: { content: 'plan' } },
      { type: 'output', payload: { content: 'tail' } },
      { type: 'turn_end', payload: { reason: 'completed' } },
    ]);
  });

  it('executes tool calls after the pass ends and appends tool results at the pass tail', async () => {
    async function* firstPass(): AsyncGenerator<string, void, void> {
      yield 'before<tool_call>{"toolName":"read_editor","input":[]}</tool_call>after';
    }

    async function* secondPass(): AsyncGenerator<string, void, void> {
      yield 'done';
    }

    agentServiceStub.streamMessages.and.returnValues(firstPass(), secondPass());

    const service = TestBed.inject(AgentLoopService);
    const conversationSignal = signal<MatrixAgentConversation | null | undefined>({
      conversationId: 'conv-3',
      title: 'Tool Conversation',
      createdAt: '2026-04-13T10:00:00Z',
      updatedAt: '2026-04-13T10:00:00Z',
      events: [],
    });

    await service.emitAgentLoop({
      courseId: 'course-1',
      assignId: 'assign-1',
      userId: 'user-1',
      userMessageContent: 'read it',
      conversationSignal,
      getEditorContent: () => 'int main() {}',
      getSelectionContent: () => null,
    });

    expect(agentServiceStub.appendEvents$.calls.count()).toBe(6);
    const firstToolBatch = agentServiceStub.appendEvents$.calls.argsFor(1)[3];
    const toolCallEvent = firstToolBatch.events[1];

    expect(firstToolBatch).toEqual({
      conversationId: 'conv-3',
      expectedEventCount: 1,
      events: [
        { type: 'output', payload: { content: 'before' } },
        jasmine.objectContaining({
          type: 'tool_call',
          payload: jasmine.objectContaining({
            toolName: 'read_editor',
            input: [],
          }),
        }),
      ],
    });
    expect(agentServiceStub.appendEvents$.calls.argsFor(2)[3]).toEqual({
      conversationId: 'conv-3',
      expectedEventCount: 3,
      events: [
        { type: 'output', payload: { content: 'after' } },
      ],
    });
    expect(agentServiceStub.appendEvents$.calls.argsFor(3)[3]).toEqual({
      conversationId: 'conv-3',
      expectedEventCount: 4,
      events: [
        {
          type: 'tool_result',
          payload: {
            callId: toolCallEvent.payload.callId,
            success: true,
            output: 'int main() {}',
          },
        },
      ],
    });
    expect(agentServiceStub.appendEvents$.calls.argsFor(4)[3]).toEqual({
      conversationId: 'conv-3',
      expectedEventCount: 5,
      events: [
        { type: 'output', payload: { content: 'done' } },
      ],
    });

    const secondPassMessages = agentServiceStub.streamMessages.calls.argsFor(1)[3];
    expect(secondPassMessages).toEqual(jasmine.arrayContaining([
      jasmine.objectContaining({ role: 'assistant', content: '<output>before</output>' }),
      jasmine.objectContaining({ role: 'assistant', content: '<output>after</output>' }),
      jasmine.objectContaining({ role: 'tool', content: 'int main() {}', tool_call_id: toolCallEvent.payload.callId }),
    ]));
    expect(conversationSignal()?.events).toEqual([
      { type: 'user_message', payload: { content: 'read it' } },
      { type: 'output', payload: { content: 'before' } },
      {
        type: 'tool_call',
        payload: {
          callId: toolCallEvent.payload.callId,
          toolName: 'read_editor',
          input: [],
        },
      },
      { type: 'output', payload: { content: 'after' } },
      {
        type: 'tool_result',
        payload: {
          callId: toolCallEvent.payload.callId,
          success: true,
          output: 'int main() {}',
        },
      },
      { type: 'output', payload: { content: 'done' } },
      { type: 'turn_end', payload: { reason: 'completed' } },
    ]);
  });

  it('reloads the conversation and stops when event persistence hits a conflict', async () => {
    async function* plainTextStream(): AsyncGenerator<string, void, void> {
      yield 'conflicting output';
    }

    agentServiceStub.streamMessages.and.returnValue(plainTextStream());
    agentServiceStub.appendEvents$.and.returnValues(of(200), of(409));
    agentServiceStub.getConversation$.and.returnValue(of({
      conversationId: 'conv-4',
      title: 'Reloaded',
      createdAt: '2026-04-13T10:00:00Z',
      updatedAt: '2026-04-13T10:05:00Z',
      events: [
        { type: 'user_message', payload: { content: 'other' } },
      ],
    }));

    const service = TestBed.inject(AgentLoopService);
    const conversationSignal = signal<MatrixAgentConversation | null | undefined>({
      conversationId: 'conv-4',
      title: 'Conflict Conversation',
      createdAt: '2026-04-13T10:00:00Z',
      updatedAt: '2026-04-13T10:00:00Z',
      events: [],
    });

    await expectAsync(service.emitAgentLoop({
      courseId: 'course-1',
      assignId: 'assign-1',
      userId: 'user-1',
      userMessageContent: 'hello',
      conversationSignal,
      getEditorContent: () => 'int main() {}',
      getSelectionContent: () => null,
    })).toBeRejectedWithError('Conversation event count conflict.');

    expect(agentServiceStub.getConversation$).toHaveBeenCalledWith('course-1', 'assign-1', 'conv-4', 'user-1');
    expect(conversationSignal()?.title).toBe('Reloaded');
    expect(conversationSignal()?.events).toEqual([
      { type: 'user_message', payload: { content: 'other' } },
    ]);
  });
});
