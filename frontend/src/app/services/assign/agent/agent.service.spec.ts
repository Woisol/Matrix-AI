import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';

import { MatrixAgentConversation } from '../../../api/type/agent';
import { ApiHttpService } from '../../../api/util/api-http.service';
import { NotificationService } from '../../notification/notification.service';
import { AgentService } from './agent.service';

describe('AgentService', () => {
  const apiStub = {
    get$: jasmine.createSpy('get$'),
    post$: jasmine.createSpy('post$'),
    patch$: jasmine.createSpy('patch$'),
    delete$: jasmine.createSpy('delete$'),
  };
  const originalFetch = globalThis.fetch;

  const notificationServiceStub = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error'),
    info: jasmine.createSpy('info'),
    warning: jasmine.createSpy('warning'),
  };

  beforeEach(() => {
    apiStub.get$.calls.reset();
    apiStub.post$.calls.reset();
    apiStub.patch$.calls.reset();
    apiStub.delete$.calls.reset();
    notificationServiceStub.success.calls.reset();
    notificationServiceStub.error.calls.reset();
    notificationServiceStub.info.calls.reset();
    notificationServiceStub.warning.calls.reset();

    TestBed.configureTestingModule({
      providers: [
        AgentService,
        { provide: ApiHttpService, useValue: apiStub },
        { provide: NotificationService, useValue: notificationServiceStub },
      ],
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('lists conversations and maps summary fields to camelCase', async () => {
    apiStub.get$.and.returnValue(of([
      {
        conversation_id: 'conv-1',
        title: '新的对话',
        created_at: '2026-04-08T12:00:00Z',
        updated_at: '2026-04-08T12:05:00Z',
      },
    ]));

    const service = TestBed.inject(AgentService);
    const result = await firstValueFrom(service.listConversations$('course-1', 'assign-1', 'user-1'));

    expect(apiStub.get$).toHaveBeenCalledWith('/courses/course-1/assignments/assign-1/agent/conversations', {
      headers: { user_id: 'user-1' },
    });
    expect(result).toEqual([
      {
        conversationId: 'conv-1',
        title: '新的对话',
        createdAt: '2026-04-08T12:00:00Z',
        updatedAt: '2026-04-08T12:05:00Z',
      },
    ]);
  });

  it('creates a conversation and maps the full conversation payload', async () => {
    apiStub.post$.and.returnValue(of({
      conversation_id: 'conv-1',
      title: '新的对话',
      created_at: '2026-04-08T12:00:00Z',
      updated_at: '2026-04-08T12:00:00Z',
      events: [],
    }));

    const service = TestBed.inject(AgentService);
    const result = await firstValueFrom(service.createConversation$('course-1', 'assign-1', 'user-1'));

    expect(apiStub.post$).toHaveBeenCalledWith('/courses/course-1/assignments/assign-1/agent/conversations', null, {
      headers: { user_id: 'user-1' },
    });
    expect(result).toEqual({
      conversationId: 'conv-1',
      title: '新的对话',
      createdAt: '2026-04-08T12:00:00Z',
      updatedAt: '2026-04-08T12:00:00Z',
      events: [],
    });
  });

  it('gets a conversation and keeps events intact while mapping top-level fields', async () => {
    apiStub.get$.and.returnValue(of({
      conversation_id: 'conv-1',
      title: '修复 main.cpp',
      created_at: '2026-04-08T12:00:00Z',
      updated_at: '2026-04-08T12:05:00Z',
      events: [
        { type: 'user_message', payload: { content: '你好' } },
      ],
    }));

    const service = TestBed.inject(AgentService);
    const result = await firstValueFrom(service.getConversation$('course-1', 'assign-1', 'conv-1', 'user-1'));

    expect(apiStub.get$).toHaveBeenCalledWith('/courses/course-1/assignments/assign-1/agent/conversations/conv-1', {
      headers: { user_id: 'user-1' },
    });
    expect(result).toEqual({
      conversationId: 'conv-1',
      title: '修复 main.cpp',
      createdAt: '2026-04-08T12:00:00Z',
      updatedAt: '2026-04-08T12:05:00Z',
      events: [
        { type: 'user_message', payload: { content: '你好' } },
      ],
    });
  });

  it('updates a conversation title', async () => {
    apiStub.patch$.and.returnValue(of({ status: 200 }));

    const service = TestBed.inject(AgentService);
    const result = await firstValueFrom(service.updateConversationTitle$('course-1', 'assign-1', 'conv-1', 'user-1', '新的标题'));

    expect(apiStub.patch$).toHaveBeenCalledWith('/courses/course-1/assignments/assign-1/agent/conversations/conv-1/title', {
      title: '新的标题',
    }, {
      headers: { user_id: 'user-1' },
      observe: 'response',
    });
    expect(result).toBe(200);
  });

  it('deletes a conversation', async () => {
    apiStub.delete$.and.returnValue(of({ status: 200 }));

    const service = TestBed.inject(AgentService);
    const result = await firstValueFrom(service.deleteConversation$('course-1', 'assign-1', 'conv-1', 'user-1'));

    expect(apiStub.delete$).toHaveBeenCalledWith('/courses/course-1/assignments/assign-1/agent/conversations/conv-1', {
      headers: { user_id: 'user-1' },
      observe: 'response',
    });
    expect(result).toBe(200);
  });

  it('appends a batch of events using backend request keys', async () => {
    apiStub.post$.and.returnValue(of({ status: 200 }));

    const service = TestBed.inject(AgentService);
    const result = await firstValueFrom(service.appendEvents$('course-1', 'assign-1', 'user-1', {
      conversationId: 'conv-1',
      expectedEventCount: 2,
      events: [
        { type: 'think', payload: { content: '先分析一下' } },
        { type: 'turn_end', payload: { reason: 'completed' } },
      ],
    }));

    expect(apiStub.post$).toHaveBeenCalledWith('/courses/course-1/assignments/assign-1/agent/event', {
      conversation_id: 'conv-1',
      expected_event_count: 2,
      events: [
        { type: 'think', payload: { content: '先分析一下' } },
        { type: 'turn_end', payload: { reason: 'completed' } },
      ],
    }, {
      headers: { user_id: 'user-1' },
      observe: 'response',
    });
    expect(result).toBe(200);
  });

  it('streams model messages through the backend agent stream endpoint', async () => {
    const encoder = new TextEncoder();
    globalThis.fetch = jasmine.createSpy('fetch').and.resolveTo(
      new Response(new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode('hello'));
          controller.enqueue(encoder.encode(' world'));
          controller.close();
        },
      })),
    ) as typeof fetch;

    const service = TestBed.inject(AgentService);
    const chunks: string[] = [];

    for await (const chunk of service.streamMessages('course-1', 'assign-1', 'user-1', [
      { role: 'system', content: 'sys' },
      { role: 'user', content: 'hello' },
    ])) {
      chunks.push(chunk);
    }

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/courses/course-1/assignments/assign-1/agent/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        user_id: 'user-1',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'sys' },
          { role: 'user', content: 'hello' },
        ],
      }),
    });
    expect(chunks).toEqual(['hello', ' world']);
  });

  it('appends local events into a conversation', () => {
    const service = TestBed.inject(AgentService);
    const conversation: MatrixAgentConversation = {
      conversationId: 'conv-1',
      title: '新的对话',
      createdAt: '2026-04-11T10:00:00Z',
      updatedAt: '2026-04-11T10:00:00Z',
      events: [
        { type: 'user_message', payload: { content: '你好' } },
      ],
    };

    const nextConversation = service.appendLocalEvents(conversation, [
      { type: 'think', payload: { content: '先分析一下' } },
    ]);

    expect(nextConversation.events).toEqual([
      { type: 'user_message', payload: { content: '你好' } },
      { type: 'think', payload: { content: '先分析一下' } },
    ]);
    expect(nextConversation.updatedAt).not.toBe(conversation.updatedAt);
  });

  it('upserts a temporary text event by index', () => {
    const service = TestBed.inject(AgentService);
    const conversation: MatrixAgentConversation = {
      conversationId: 'conv-1',
      title: '新的对话',
      createdAt: '2026-04-11T10:00:00Z',
      updatedAt: '2026-04-11T10:00:00Z',
      events: [],
    };

    const first = service.upsertLocalTempTextEvent(conversation, null, 'think', '第一段');
    const second = service.upsertLocalTempTextEvent(first.conversation, first.index, 'think', '第二段');

    expect(first.index).toBe(0);
    expect(first.conversation.events).toEqual([
      { type: 'think', payload: { content: '第一段' } },
    ]);
    expect(second.index).toBe(0);
    expect(second.conversation.events).toEqual([
      { type: 'think', payload: { content: '第二段' } },
    ]);
  });
});
