import { TestBed } from '@angular/core/testing';
import { MarkdownModule } from 'ngx-markdown';

import { MatrixAgentEvent, MatrixAgentEventUserMessage } from '../../../../api/type/agent';
import { AgentAssistantMessageComponent, AgentChatBubbleComponent } from './chat-bubble.component';

describe('AgentChatBubbleComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownModule.forRoot(), AgentChatBubbleComponent],
    }).compileComponents();
  });

  it('renders a user message bubble', () => {
    const fixture = TestBed.createComponent(AgentChatBubbleComponent);
    fixture.componentInstance.dEvent = {
      type: 'user',
      events: [
        { type: 'user_message', payload: { content: '你好' } },
      ],
    };

    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('.chat-bubble.user')?.textContent).toContain('你好');
  });
});

describe('AgentAssistantMessageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownModule.forRoot(), AgentAssistantMessageComponent],
    }).compileComponents();
  });

  function createAgentFixture(events: Exclude<MatrixAgentEvent, MatrixAgentEventUserMessage>[]) {
    const fixture = TestBed.createComponent(AgentAssistantMessageComponent);
    fixture.componentInstance.dEvent = {
      type: 'agent',
      events,
    };
    fixture.detectChanges();
    return fixture;
  }

  it('merges a tool result back into its previous tool call card', () => {
    const fixture = createAgentFixture([
      { type: 'tool_call', payload: { callId: '1', toolName: 'read_editor', input: ['main.cpp'] } },
      { type: 'tool_result', payload: { callId: '1', success: true, output: 'int main() {}' } },
    ]);

    const root = fixture.nativeElement as HTMLElement;
    const cards = root.querySelectorAll('.tool-card');

    expect(cards.length).toBe(1);
    expect(cards[0].textContent).toContain('read_editor(main.cpp)');
    expect(cards[0].textContent).toContain('int main() {}');
    expect(cards[0].textContent).toContain('成功');
  });

  it('keeps a tool call card pending when no tool result exists', () => {
    const fixture = createAgentFixture([
      { type: 'tool_call', payload: { callId: '1', toolName: 'read_editor', input: ['main.cpp'] } },
    ]);

    const root = fixture.nativeElement as HTMLElement;
    const card = root.querySelector('.tool-card');

    expect(card?.textContent).toContain('read_editor(main.cpp)');
    expect(card?.textContent).toContain('执行中');
  });

  it('renders an unmatched tool result as a standalone fallback card', () => {
    const fixture = createAgentFixture([
      { type: 'tool_result', payload: { callId: 'missing', success: false, output: 'network error' } },
    ]);

    const root = fixture.nativeElement as HTMLElement;
    const card = root.querySelector('.tool-card.orphan-result');

    expect(card?.textContent).toContain('tool_result');
    expect(card?.textContent).toContain('network error');
    expect(card?.textContent).toContain('失败');
  });

  it('merges adjacent think events into one think block', () => {
    const fixture = createAgentFixture([
      { type: 'think', payload: { content: '先分析一下' } },
      { type: 'think', payload: { content: '再看一眼边界' } },
      { type: 'output', payload: { content: '完成' } },
    ]);

    const root = fixture.nativeElement as HTMLElement;
    const thinkBlocks = root.querySelectorAll('.think-block');
    const component = fixture.componentInstance;

    expect(thinkBlocks.length).toBe(1);
    expect(component.getThinkContents(0)).toEqual(['先分析一下', '再看一眼边界']);
  });

  it('shows a system ending message when there is no assistant output', () => {
    const fixture = createAgentFixture([
      { type: 'turn_end', payload: { reason: 'page_unload' } },
    ]);

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('.system-end')?.textContent).toContain('标签页切换');
  });
});
