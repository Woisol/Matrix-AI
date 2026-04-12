import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { signal, WritableSignal } from '@angular/core';

import { AssignData } from '../../../api/type/assigment';
import { MatrixAgentConversation, MatrixAgentEvent } from '../../../api/type/agent';
import { AgentService } from './agent.service';
import { AgentLoopService } from './agent-loop.service';
import { SYSTEM_PROMPT } from './agent.constant';

describe('AgentLoopService', () => {
  const agentServiceStub = {
    appendEvents$: jasmine.createSpy('appendEvents$').and.returnValue(of(200)),
    streamMessages: jasmine.createSpy('streamMessages'),
    appendLocalEvents: jasmine.createSpy('appendLocalEvents').and.callFake((conversationSignal: WritableSignal<MatrixAgentConversation | null | undefined>, events: MatrixAgentEvent[]) => {
      const conversation = conversationSignal();
      if (!conversation) return;
      conversationSignal.set({
        ...conversation,
        updatedAt: 'updated',
        events: [...conversation.events, ...events],
      });
    }),
    replaceLocalEventAt: jasmine.createSpy('replaceLocalEventAt').and.callFake((conversation: MatrixAgentConversation, index: number, event: MatrixAgentEvent) => {
      const nextEvents = [...conversation.events];
      nextEvents[index] = event;
      return {
        ...conversation,
        updatedAt: 'updated',
        events: nextEvents,
      };
    }),
    appendLocalEventAndGetIndex: jasmine.createSpy('appendLocalEventAndGetIndex').and.callFake((conversation: MatrixAgentConversation, event: MatrixAgentEvent) => {
      const nextConversation = {
        ...conversation,
        updatedAt: 'updated',
        events: [...conversation.events, event],
      };
      return { conversation: nextConversation, index: nextConversation.events.length - 1 };
    }),
    upsertLocalTempTextEvent: jasmine.createSpy('upsertLocalTempTextEvent').and.callFake((conversation: MatrixAgentConversation, currentIndex: number | null, type: 'think' | 'output', content: string) => {
      const event = { type, payload: { content } } as MatrixAgentEvent;
      if (currentIndex === null) {
        const nextConversation = {
          ...conversation,
          updatedAt: 'updated',
          events: [...conversation.events, event],
        };
        return { conversation: nextConversation, index: nextConversation.events.length - 1 };
      }

      const nextEvents = [...conversation.events];
      nextEvents[currentIndex] = event;
      return {
        conversation: {
          ...conversation,
          updatedAt: 'updated',
          events: nextEvents,
        },
        index: currentIndex,
      };
    }),
  };

  beforeEach(() => {
    agentServiceStub.appendEvents$.calls.reset();
    agentServiceStub.streamMessages.calls.reset();
    agentServiceStub.appendLocalEvents.calls.reset();
    agentServiceStub.replaceLocalEventAt.calls.reset();
    agentServiceStub.appendLocalEventAndGetIndex.calls.reset();
    agentServiceStub.upsertLocalTempTextEvent.calls.reset();
    TestBed.configureTestingModule({
      providers: [
        AgentLoopService,
        { provide: AgentService, useValue: agentServiceStub },
      ],
    });
  });

  function asyncChunks(chunks: string[]) {
    return (async function* () {
      for (const chunk of chunks) {
        yield chunk;
      }
    })();
  }

  function createConversation(): MatrixAgentConversation {
    return {
      conversationId: 'conv-1',
      title: '新的对话',
      createdAt: '2026-04-11T10:00:00Z',
      updatedAt: '2026-04-11T10:00:00Z',
      events: [],
    };
  }

  function createAssignData(): AssignData {
    return {
      assignId: 'assign-1' as any,
      title: '题目标题',
      description: '题目描述',
      assignOriginalCode: [{ fileName: 'main.cpp', content: 'int main() { return 0; }' }],
      submit: undefined,
    };
  }

  it('builds system prompt with xml protocol and enabled tools', () => {
    const service = TestBed.inject(AgentLoopService);

    const prompt = SYSTEM_PROMPT(['read_editor', 'read_problem_info']);

    expect(prompt).toContain('<think>');
    expect(prompt).toContain('<tool_call>');
    expect(prompt).toContain('<output>');
    expect(prompt).toContain('read_editor');
    expect(prompt).toContain('read_problem_info');
    expect(prompt).not.toContain('write_editor');
  });

  it('runs a simple output-only turn and persists user/think/output events', async () => {
    agentServiceStub.streamMessages.and.returnValue(asyncChunks(['<think>先分析一下</think><output>最终答案</output>']));
    const service = TestBed.inject(AgentLoopService);
    const conversationSignal = signal<MatrixAgentConversation | null>(createConversation());

    await service.runUserTurn({
      courseId: 'course-1' as any,
      assignId: 'assign-1' as any,
      userId: 'Matrix AI',
      userMessageContent: '你好',
      conversationSignal,
      assignData: createAssignData(),
      analysis: undefined,
      getEditorContent: () => 'int main() { return 0; }',
      getSelectionContent: () => null,
      enabledTools: ['read_editor', 'read_problem_info'],
    });

    expect(agentServiceStub.appendEvents$.calls.argsFor(0)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 0,
      events: [{ type: 'user_message', payload: { content: '你好' } }],
    });
    expect(agentServiceStub.appendEvents$.calls.argsFor(1)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 1,
      events: [{ type: 'think', payload: { content: '先分析一下' } }],
    });
    expect(agentServiceStub.appendEvents$.calls.argsFor(2)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 2,
      events: [{ type: 'output', payload: { content: '最终答案' } }],
    });
    expect(agentServiceStub.appendEvents$.calls.argsFor(3)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 3,
      events: [{ type: 'turn_end', payload: { reason: 'completed' } }],
    });
    expect(conversationSignal()?.events).toEqual([
      { type: 'user_message', payload: { content: '你好' } },
      { type: 'think', payload: { content: '先分析一下' } },
      { type: 'output', payload: { content: '最终答案' } },
      { type: 'turn_end', payload: { reason: 'completed' } },
    ]);
  });

  it('handles a read_editor tool call before producing an output answer', async () => {
    agentServiceStub.streamMessages.and.returnValues(
      asyncChunks(['<tool_call>{"toolName":"read_editor","input":[]}</tool_call>']),
      asyncChunks(['<output>根据代码内容给出的答案</output>']),
    );

    const service = TestBed.inject(AgentLoopService);
    const conversationSignal = signal<MatrixAgentConversation | null>(createConversation());

    await service.runUserTurn({
      courseId: 'course-1' as any,
      assignId: 'assign-1' as any,
      userId: 'Matrix AI',
      userMessageContent: '帮我分析代码',
      conversationSignal,
      assignData: createAssignData(),
      analysis: undefined,
      getEditorContent: () => 'int main() { return 0; }',
      getSelectionContent: () => null,
      enabledTools: ['read_editor'],
    });

    expect(agentServiceStub.appendEvents$.calls.argsFor(1)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 1,
      events: [
        { type: 'tool_call', payload: { callId: 'call-1', toolName: 'read_editor', input: [] } },
      ],
    });
    expect(agentServiceStub.appendEvents$.calls.argsFor(2)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 2,
      events: [
        { type: 'tool_result', payload: { callId: 'call-1', success: true, output: 'int main() { return 0; }' } },
      ],
    });
    expect(agentServiceStub.appendEvents$.calls.argsFor(3)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 3,
      events: [{ type: 'output', payload: { content: '根据代码内容给出的答案' } }],
    });
    expect(agentServiceStub.appendEvents$.calls.argsFor(4)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 4,
      events: [{ type: 'turn_end', payload: { reason: 'completed' } }],
    });
    expect(conversationSignal()?.events.at(-2)).toEqual({ type: 'output', payload: { content: '根据代码内容给出的答案' } });
  });

  it('salvages plain text outside tags into an output answer', async () => {
    agentServiceStub.streamMessages.and.returnValue(asyncChunks(['模型有点不听话但还是给出了答案']));
    const service = TestBed.inject(AgentLoopService);
    const conversationSignal = signal<MatrixAgentConversation | null>(createConversation());

    await service.runUserTurn({
      courseId: 'course-1' as any,
      assignId: 'assign-1' as any,
      userId: 'Matrix AI',
      userMessageContent: '直接回答',
      conversationSignal,
      assignData: createAssignData(),
      analysis: undefined,
      getEditorContent: () => 'int main() { return 0; }',
      getSelectionContent: () => null,
      enabledTools: ['read_editor'],
    });

    expect(agentServiceStub.appendEvents$.calls.argsFor(1)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 1,
      events: [{ type: 'output', payload: { content: '模型有点不听话但还是给出了答案' } }],
    });
    expect(agentServiceStub.appendEvents$.calls.argsFor(2)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 2,
      events: [{ type: 'turn_end', payload: { reason: 'completed' } }],
    });
  });

  it('allows output blocks to interleave with tool calls in one response', async () => {
    agentServiceStub.streamMessages.and.returnValues(
      asyncChunks(['<output>前置说明</output><tool_call>{"toolName":"read_editor","input":[]}</tool_call>']),
      asyncChunks(['<output>补充说明</output>']),
    );

    const service = TestBed.inject(AgentLoopService);
    const conversationSignal = signal<MatrixAgentConversation | null>(createConversation());

    await service.runUserTurn({
      courseId: 'course-1' as any,
      assignId: 'assign-1' as any,
      userId: 'Matrix AI',
      userMessageContent: '混合输出和工具',
      conversationSignal,
      assignData: createAssignData(),
      analysis: undefined,
      getEditorContent: () => 'int main() { return 0; }',
      getSelectionContent: () => null,
      enabledTools: ['read_editor'],
    });

    expect(agentServiceStub.appendEvents$.calls.argsFor(1)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 1,
      events: [{ type: 'output', payload: { content: '前置说明' } }],
    });
    expect(agentServiceStub.appendEvents$.calls.argsFor(2)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 2,
      events: [{ type: 'tool_call', payload: { callId: 'call-1', toolName: 'read_editor', input: [] } }],
    });
    expect(agentServiceStub.appendEvents$.calls.argsFor(3)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 3,
      events: [{ type: 'tool_result', payload: { callId: 'call-1', success: true, output: 'int main() { return 0; }' } }],
    });
    expect(agentServiceStub.appendEvents$.calls.argsFor(4)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 4,
      events: [{ type: 'output', payload: { content: '补充说明' } }],
    });
    expect(agentServiceStub.appendEvents$.calls.argsFor(5)[3]).toEqual({
      conversationId: 'conv-1',
      expectedEventCount: 5,
      events: [{ type: 'turn_end', payload: { reason: 'completed' } }],
    });
  });
});
