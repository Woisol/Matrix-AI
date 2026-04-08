import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';

import { ApiHttpService } from '../../api/util/api-http.service';
import { NotificationService } from '../notification/notification.service';
import { SSEService } from '../see/see.service';
import { AgentService } from './agent.service';

describe('AgentService', () => {
  const apiStub = {
    get$: jasmine.createSpy('get$'),
    post$: jasmine.createSpy('post$'),
    patch$: jasmine.createSpy('patch$'),
    delete$: jasmine.createSpy('delete$'),
  };

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
        { provide: SSEService, useValue: {} },
      ],
    });
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
      params: { user_id: 'user-1' },
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
      params: { user_id: 'user-1' },
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
      params: { user_id: 'user-1' },
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
    apiStub.patch$.and.returnValue(of({ message: '对话标题已更新' }));

    const service = TestBed.inject(AgentService);
    const result = await firstValueFrom(service.updateConversationTitle$('course-1', 'assign-1', 'conv-1', 'user-1', '新的标题'));

    expect(apiStub.patch$).toHaveBeenCalledWith('/courses/course-1/assignments/assign-1/agent/conversations/conv-1/title', {
      title: '新的标题',
    }, {
      params: { user_id: 'user-1' },
    });
    expect(result).toEqual({ message: '对话标题已更新' });
  });

  it('deletes a conversation', async () => {
    apiStub.delete$.and.returnValue(of({ message: '对话记录已删除' }));

    const service = TestBed.inject(AgentService);
    const result = await firstValueFrom(service.deleteConversation$('course-1', 'assign-1', 'conv-1', 'user-1'));

    expect(apiStub.delete$).toHaveBeenCalledWith('/courses/course-1/assignments/assign-1/agent/conversations/conv-1', {
      params: { user_id: 'user-1' },
    });
    expect(result).toEqual({ message: '对话记录已删除' });
  });

  it('appends a batch of events using backend request keys', async () => {
    apiStub.post$.and.returnValue(of({ message: '事件追加成功' }));

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
      params: { user_id: 'user-1' },
    });
    expect(result).toEqual({ message: '事件追加成功' });
  });
});
