import { NgForm } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { CourseInfoTabComponent } from './course-info-tab.component';

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
      { type: 'assistant_final', payload: { content: '完成' } },
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
      'assistant_final',
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
      { type: 'assistant_final', payload: { content: '结果' } },
    ] as const;

    const grouped = (component as any)._splitEventsForDisplay(events);

    expect(grouped.length).toBe(1);
    expect(grouped[0].type).toBe('agent');
    expect(grouped[0].events.map((e: { type: string }) => e.type)).toEqual([
      'think',
      'assistant_final',
    ]);
  });

  it('emits a complete mock event sequence on submit', () => {
    const component = createComponent();
    const emitted: Array<{ type: string; payload: unknown }> = [];
    component.pushNewAgentEvent.subscribe((e) => emitted.push(e));

    component.userInput = '  帮我看下这段代码  ';
    component.onAgentSubmit({ resetForm: () => undefined } as unknown as NgForm);

    expect(emitted.map((e) => e.type)).toEqual([
      'user_message',
      'think',
      'tool_call',
      'tool_result',
      'assistant_final',
    ]);

    const toolCall = emitted.find((e) => e.type === 'tool_call') as { payload: { callId: string } };
    const toolResult = emitted.find((e) => e.type === 'tool_result') as { payload: { callId: string } };
    expect(toolCall.payload.callId).toBe('0');
    expect(toolResult.payload.callId).toBe('0');
  });

  it('does not emit events when input is blank', () => {
    const component = createComponent();
    const emitSpy = spyOn(component.pushNewAgentEvent, 'emit');

    component.userInput = '   ';
    component.onAgentSubmit({ resetForm: () => undefined } as unknown as NgForm);

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
