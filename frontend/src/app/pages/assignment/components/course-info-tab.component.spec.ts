import { NgForm } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { CourseInfoTabComponent } from './course-info-tab.component';
import { AgentLoopToolMenuItem } from '../../../services/assign/agent/agent-loop-tool-provider.service';

describe('CourseInfoTabComponent', () => {
  function createComponent() {
    return new CourseInfoTabComponent();
  }

  it('can be created by TestBed (standalone imports smoke test)', async () => {
    await TestBed.configureTestingModule({
      imports: [CourseInfoTabComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    const fixture = TestBed.createComponent(CourseInfoTabComponent);
    fixture.componentInstance.assignData = undefined;
    fixture.componentInstance.analysis = undefined;
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('splits events by user message and keeps trailing agent events in the same batch', () => {
    const component = createComponent();
    const events = [
      { type: 'user_message', payload: { content: '你好' } },
      { type: 'think', payload: { content: '先分析一下' } },
      { type: 'tool_call', payload: { callId: '1', toolName: 'read_editor', input: ['a.cpp'] } },
      { type: 'output', payload: { content: '完成' } },
      { type: 'user_message', payload: { content: '再来一次' } },
      { type: 'turn_end', payload: { reason: 'completed' } },
    ] as const;

    const grouped = (component as any)._splitEventsForDisplay(events);

    expect(grouped.length).toBe(4);
    expect(grouped[0].type).toBe('user');
    expect(grouped[0].events.map((e: { type: string }) => e.type)).toEqual(['user_message']);
    expect(grouped[1].type).toBe('agent');
    expect(grouped[1].events.map((e: { type: string }) => e.type)).toEqual([
      'think',
      'tool_call',
      'output',
    ]);
    expect(grouped[2].type).toBe('user');
    expect(grouped[2].events.map((e: { type: string }) => e.type)).toEqual(['user_message']);
    expect(grouped[3].type).toBe('agent');
    expect(grouped[3].events.map((e: { type: string }) => e.type)).toEqual([
      'turn_end',
    ]);
  });

  it('creates a leading agent batch when events do not start with user message', () => {
    const component = createComponent();
    const events = [
      { type: 'think', payload: { content: '先分析一下' } },
      { type: 'output', payload: { content: '结果' } },
    ] as const;

    const grouped = (component as any)._splitEventsForDisplay(events);

    expect(grouped.length).toBe(1);
    expect(grouped[0].type).toBe('agent');
    expect(grouped[0].events.map((e: { type: string }) => e.type)).toEqual([
      'think',
      'output',
    ]);
  });

  it('emits a complete mock event sequence on submit', () => {
    const component = createComponent();
    const emitted: Array<{ type: string; payload: unknown }> = [];
    component.pushNewAgentEvent.subscribe((e) => emitted.push(e));

    component.userInput = '  帮我看下这段代码  ';
    component.onAgentSubmit({ resetForm: () => undefined } as unknown as NgForm);

    expect(emitted).toEqual([
      { type: 'user_message', payload: { content: '帮我看下这段代码' } },
    ]);
    expect(component.userInput).toBe('');
  });

  it('does not emit events when input is blank', () => {
    const component = createComponent();
    const emitSpy = spyOn(component.pushNewAgentEvent, 'emit');

    component.userInput = '   ';
    component.onAgentSubmit({ resetForm: () => undefined } as unknown as NgForm);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('prefills input with rewound user message before emitting rewind event', () => {
    const component = createComponent();
    const emitSpy = spyOn(component.rewindConversationRequest, 'emit');

    component.handleRewindConversationRequest(
      {
        type: 'user',
        sourceStartIndex: 3,
        events: [{ type: 'user_message', payload: { content: '请回到这一句' } }],
      },
      3,
    );

    expect(component.userInput).toBe('请回到这一句');
    expect(emitSpy).toHaveBeenCalledWith(3);
  });

  it('exposes checkbox state and emits toggle requests from the menu', () => {
    const component = createComponent();
    const menuItems: AgentLoopToolMenuItem[] = [
      { name: 'read_editor', hint: '读取编辑器全文内容', toggleable: true, implemented: true },
      { name: 'web_search', hint: '暂未实现', toggleable: false, implemented: false },
    ];

    component.agentToolMenuItems = menuItems;
    component.enabledAgentTools = ['read_editor'];

    const emitted: Array<string> = [];
    component.toggleAgentTool.subscribe((toolName) => emitted.push(toolName));

    expect(component.isAgentToolEnabled('read_editor', {} as Event)).toBeTrue();
    expect(component.isAgentToolEnabled('web_search', {} as Event)).toBeFalse();

    component.toggleAgentToolItem(menuItems[0], {
      preventDefault: () => undefined,
      stopPropagation: () => undefined,
    } as Event);

    component.toggleAgentToolItem(menuItems[1], {
      preventDefault: () => undefined,
      stopPropagation: () => undefined,
    } as Event);

    expect(emitted).toEqual(['read_editor']);
  });

  it('builds export text with user and matrix agent sections', () => {
    const component = createComponent();
    const content = (component as any).buildConversationExportText([
      { type: 'user_message', payload: { content: '请分析这段代码' } },
      { type: 'think', payload: { content: '先看边界' } },
      { type: 'output', payload: { content: '建议如下。' } },
      { type: 'tool_call', payload: { callId: 'c1', toolName: 'write_editor', input: ['full-editor', 'int main() {}'] } },
      { type: 'tool_result', payload: { callId: 'c1', success: true, output: 'ok' } },
    ]);

    expect(content).toContain('User:\n请分析这段代码');
    expect(content).toContain('Matrix Agent:\n<think>先看边界</think>建议如下。');
    expect(content).toContain('<tool_call>write_editor(full-editor,int main() {})</tool_call>');
    expect(content).toContain('<tool_result>ok</tool_result>');
  });

  it('opens export preview when current conversation exists', () => {
    const component = createComponent();
    component.currentConversation = {
      conversationId: 'conv-1',
      title: '新的对话',
      createdAt: '2026-04-15T10:00:00Z',
      updatedAt: '2026-04-15T10:00:00Z',
      events: [
        { type: 'user_message', payload: { content: '你好' } },
      ],
    };

    component.exportCurrentConversation();

    expect(component.exportPreviewVisible).toBeTrue();
    expect(component.exportPreviewContent).toContain('User:\n你好');
    expect(component.exportFileName).toContain('conversation-conv-1-');
  });
});
