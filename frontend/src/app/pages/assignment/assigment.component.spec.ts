import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import * as monaco from 'monaco-editor';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AssignmentComponent } from './assigment.component';
import { CourseInfoTabComponent } from './components/course-info-tab.component';
import { CodeEditorComponent } from './components/code-editor.component';
import { AssignService } from '../../services/assign/assign.service';
import { AgentService } from '../../services/assign/agent/agent.service';
import { AgentLoopService } from '../../services/assign/agent/agent-loop.service';
import { AgentLoopToolMenuItem } from '../../services/assign/agent/agent-loop-tool-provider.service';
import { NotificationService } from '../../services/notification/notification.service';
import { Analysis, AssignData, CodeFileInfo } from '../../api/type/assigment';
import { MatrixAnalysisEditorRange, MatrixAnalysisEditRequest } from './components/code-applyable-markdown.component';
import { MatrixAgentConversation, MatrixAgentConversationSummary, MatrixAgentEvent } from '../../api/type/agent';

@Component({
  selector: 'course-info-tab',
  standalone: true,
  template: '',
})
class MockCourseInfoTabComponent {
  @Input() assignData: AssignData | undefined;
  @Input() analysis: Analysis | undefined;
  @Input() handleAnalysisRegen = () => { };
  @Input() onAnalysisAiGenRequest = (_notify = false) => { };
  @Input() conversationHistory: MatrixAgentConversationSummary[] = [];
  @Input() currentConversation: MatrixAgentConversation | null = null;
  @Input() selectedTabIndex = signal(0);
  @Input() agentToolMenuItems: AgentLoopToolMenuItem[] = [];
  @Input() enabledAgentTools: Array<string> = [];
  @Input() agentLoopRunning = false;
  @Output() createNewConversation = new EventEmitter<void>();
  @Output() loadConversationInfo = new EventEmitter<string>();
  @Output() refreshConversationHistory = new EventEmitter<void>();
  @Output() patchConversationTitle = new EventEmitter<{ conversationId: string; title: string }>();
  @Output() deleteConversation = new EventEmitter<string>();
  @Output() pushNewAgentEvent = new EventEmitter<MatrixAgentEvent>();
  @Output() toggleAgentTool = new EventEmitter<string>();
  @Output() applyAnalysisEdit = new EventEmitter<MatrixAnalysisEditRequest>();
  @Output() focusRequestRangeOnEditor = new EventEmitter<MatrixAnalysisEditorRange>();
  @Output() rewindConversationRequest = new EventEmitter<number>();
  @Output() rewindWriteRequest = new EventEmitter<string | undefined>();
}

@Component({
  selector: 'code-editor',
  standalone: true,
  template: '',
})
class MockCodeEditorComponent {
  @Input() codeFile: CodeFileInfo = { fileName: '', content: '' };
  @Input() onSubmitRequest: () => void = () => { };
  @Output() editorReady = new EventEmitter<monaco.editor.IStandaloneCodeEditor>();
}

describe('AssignmentComponent', () => {
  const assignServiceStub = {
    getAssignData$: () => of(undefined),
    getAnalysisBasic$: () => of(undefined),
    getAnalysisAiGen$: () => of(undefined),
    submitRequest$: () => of(undefined),
  };

  const notificationServiceStub = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error'),
    info: jasmine.createSpy('info'),
    warning: jasmine.createSpy('warning'),
  };

  const agentServiceStub = {
    listConversations$: jasmine.createSpy('listConversations$').and.returnValue(of([])),
    createConversation$: jasmine.createSpy('createConversation$').and.returnValue(of(undefined)),
    getConversation$: jasmine.createSpy('getConversation$').and.returnValue(of(undefined)),
    updateConversationTitle$: jasmine.createSpy('updateConversationTitle$').and.returnValue(of(200)),
    deleteConversation$: jasmine.createSpy('deleteConversation$').and.returnValue(of(200)),
    createCheckpoint$: jasmine.createSpy('createCheckpoint$').and.returnValue(of('cp-1')),
    getCheckpoint$: jasmine.createSpy('getCheckpoint$').and.returnValue(of([{ fileName: 'main.cpp', content: 'restored code' }])),
  };

  const agentLoopServiceStub = {
    emitAgentLoop: jasmine.createSpy('emitAgentLoop').and.resolveTo(undefined),
  };

  const modalServiceStub = {
    confirm: jasmine.createSpy('confirm'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ courseId: 'course-1', assignId: 'assign-1' })),
          },
        },
        { provide: AssignService, useValue: assignServiceStub },
        { provide: AgentService, useValue: agentServiceStub },
        { provide: AgentLoopService, useValue: agentLoopServiceStub },
        { provide: NotificationService, useValue: notificationServiceStub },
        { provide: NzModalService, useValue: modalServiceStub },
      ],
    })
      .overrideComponent(AssignmentComponent, {
        remove: {
          imports: [CourseInfoTabComponent, CodeEditorComponent],
        },
      })
      .overrideComponent(AssignmentComponent, {
        add: {
          imports: [MockCourseInfoTabComponent, MockCodeEditorComponent],
        },
      })
      .compileComponents();
  });

  function createFocusedEditorMock(initialContent = 'updated') {
    let content = initialContent;
    let changeListener: (() => void) | null = null;

    return {
      setSelection: jasmine.createSpy('setSelection'),
      revealRangeInCenter: jasmine.createSpy('revealRangeInCenter'),
      focus: jasmine.createSpy('focus'),
      onDidChangeModelContent: jasmine.createSpy('onDidChangeModelContent').and.callFake((listener: () => void) => {
        changeListener = listener;
        return { dispose: () => undefined };
      }),
      __triggerContentChange: () => changeListener?.(),
      getModel: jasmine.createSpy('getModel').and.returnValue({
        getValue: () => content,
        getLineCount: () => 2,
        getLineMaxColumn: (lineNumber: number) => (lineNumber === 1 ? 4 : 1),
      }),
      pushUndoStop: jasmine.createSpy('pushUndoStop'),
      executeEdits: jasmine.createSpy('executeEdits').and.callFake((_source: string, edits: Array<{ text: string }>) => {
        content = edits[0]?.text ?? content;
        return true;
      }),
    } as unknown as monaco.editor.IStandaloneCodeEditor;
  }

  beforeEach(() => {
    notificationServiceStub.success.calls.reset();
    notificationServiceStub.error.calls.reset();
    notificationServiceStub.info.calls.reset();
    notificationServiceStub.warning.calls.reset();
    agentServiceStub.listConversations$.calls.reset();
    agentServiceStub.createConversation$.calls.reset();
    agentServiceStub.getConversation$.calls.reset();
    agentServiceStub.updateConversationTitle$.calls.reset();
    agentServiceStub.deleteConversation$.calls.reset();
    agentServiceStub.createCheckpoint$.calls.reset();
    agentServiceStub.getCheckpoint$.calls.reset();
    agentLoopServiceStub.emitAgentLoop.calls.reset();
    modalServiceStub.confirm.calls.reset();
  });

  it('wires the course tab focus event to the page handler', () => {
    const fixture = TestBed.createComponent(AssignmentComponent);
    const component = fixture.componentInstance;
    const handlerSpy = spyOn(component, 'focusRequestRangeOnEditor');
    fixture.detectChanges();

    const child = fixture.debugElement.query(By.directive(MockCourseInfoTabComponent)).componentInstance as MockCourseInfoTabComponent;
    child.focusRequestRangeOnEditor.emit({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: 1,
      endColumn: 3,
    });

    expect(handlerSpy).toHaveBeenCalledWith({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: 1,
      endColumn: 3,
    });
  });

  it('focuses the editor when locating a range', () => {
    const fixture = TestBed.createComponent(AssignmentComponent);
    const component = fixture.componentInstance;
    const editor = createFocusedEditorMock();
    (component as unknown as { codeEditor: monaco.editor.IStandaloneCodeEditor }).codeEditor = editor;

    component.focusRequestRangeOnEditor({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: 1,
      endColumn: 3,
    });

    expect(editor.setSelection).toHaveBeenCalled();
    expect(editor.revealRangeInCenter).toHaveBeenCalled();
    expect(editor.focus).toHaveBeenCalled();
  });

  it('focuses the editor after applying an edit request', () => {
    const fixture = TestBed.createComponent(AssignmentComponent);
    const component = fixture.componentInstance;
    const editor = createFocusedEditorMock();
    (component as unknown as { codeEditor: monaco.editor.IStandaloneCodeEditor }).codeEditor = editor;

    component.handleAnalysisEditRequest({
      target: 'range',
      text: 'abc',
      range: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 3,
      },
    });

    expect(editor.executeEdits).toHaveBeenCalled();
    expect(editor.focus).toHaveBeenCalled();
  });

  it('marks agent rollback as needing confirmation when the editor changes during an agent run', () => {
    const fixture = TestBed.createComponent(AssignmentComponent);
    const component = fixture.componentInstance;
    const editor = createFocusedEditorMock('before edit') as monaco.editor.IStandaloneCodeEditor & { __triggerContentChange: () => void };

    component.agentLoopRunning.set(true);
    component.handleEditorReady(editor);
    editor.__triggerContentChange();

    expect((component as any).userEditedEditorAfterAgentWrite).toBeTrue();
  });

  it('creates a checkpoint before applying an agent write and returns the checkpoint id', async () => {
    const fixture = TestBed.createComponent(AssignmentComponent);
    const component = fixture.componentInstance;
    const editor = createFocusedEditorMock('int main() { return 0; }');
    (component as unknown as { codeEditor: monaco.editor.IStandaloneCodeEditor }).codeEditor = editor;
    component.courseId = 'course-1' as any;
    component.assignId = 'assign-1' as any;
    component.codeFile.set({ fileName: 'main.cpp', content: 'int main() { return 0; }' });
    (component as any).userEditedEditorAfterAgentWrite = true;

    const result = await component.handleAgentWriteEditorRequest({
      target: 'full-editor',
      text: 'int main() { return 1; }',
    });

    expect(agentServiceStub.createCheckpoint$).toHaveBeenCalledWith('course-1', 'assign-1', 'Matrix AI', [
      { fileName: 'main.cpp', content: 'int main() { return 0; }' },
    ]);
    expect(result).toEqual(jasmine.objectContaining({ checkpointId: 'cp-1' }));
    expect((component as any).userEditedEditorAfterAgentWrite).toBeFalse();
  });

  it('rolls back immediately when no overwrite confirmation is needed', async () => {
    const fixture = TestBed.createComponent(AssignmentComponent);
    const component = fixture.componentInstance;
    const editor = createFocusedEditorMock('current code');
    (component as unknown as { codeEditor: monaco.editor.IStandaloneCodeEditor }).codeEditor = editor;
    component.courseId = 'course-1' as any;
    component.assignId = 'assign-1' as any;
    component.codeFile.set({ fileName: 'main.cpp', content: 'current code' });

    await component.handleAgentRollbackRequest('cp-1');

    expect(modalServiceStub.confirm).not.toHaveBeenCalled();
    expect(agentServiceStub.getCheckpoint$).toHaveBeenCalledWith('course-1', 'assign-1', 'cp-1', 'Matrix AI');
    expect(editor.executeEdits).toHaveBeenCalled();
  });

  it('asks for confirmation before rollback when the editor was manually changed during agent execution', async () => {
    const fixture = TestBed.createComponent(AssignmentComponent);
    const component = fixture.componentInstance;
    const editor = createFocusedEditorMock('current code');
    (component as unknown as { codeEditor: monaco.editor.IStandaloneCodeEditor }).codeEditor = editor;
    component.courseId = 'course-1' as any;
    component.assignId = 'assign-1' as any;
    component.codeFile.set({ fileName: 'main.cpp', content: 'current code' });
    (component as any).userEditedEditorAfterAgentWrite = true;

    await component.handleAgentRollbackRequest('cp-1');

    expect(modalServiceStub.confirm).toHaveBeenCalled();
    expect(editor.executeEdits).not.toHaveBeenCalled();

    const confirmConfig = modalServiceStub.confirm.calls.mostRecent().args[0];
    await confirmConfig.nzOnOk();

    expect(editor.executeEdits).toHaveBeenCalled();
  });

  it('rewinds conversation to clicked user event and asks whether to restore code when write_editor exists', () => {
    const fixture = TestBed.createComponent(AssignmentComponent);
    const component = fixture.componentInstance;

    component.currentConversationInfo.set({
      conversationId: 'conv-1',
      title: '测试对话',
      createdAt: '2026-04-10T10:00:00Z',
      updatedAt: '2026-04-10T10:00:00Z',
      events: [
        { type: 'user_message', payload: { content: '请修改代码' } },
        { type: 'tool_call', payload: { callId: 'c1', toolName: 'write_editor', input: [] } },
        { type: 'tool_result', payload: { callId: 'c1', success: true, output: { checkpointId: 'cp-2' } } },
      ],
    });

    component.handleRewindConversationRequest(0);

    expect(component.currentConversationInfo()?.events.length).toBe(1);
    expect(modalServiceStub.confirm).toHaveBeenCalled();
  });

  it('restores code after conversation rewind when user confirms restore', async () => {
    const fixture = TestBed.createComponent(AssignmentComponent);
    const component = fixture.componentInstance;
    const editor = createFocusedEditorMock('current code');
    (component as unknown as { codeEditor: monaco.editor.IStandaloneCodeEditor }).codeEditor = editor;
    component.courseId = 'course-1' as any;
    component.assignId = 'assign-1' as any;
    component.codeFile.set({ fileName: 'main.cpp', content: 'current code' });
    component.currentConversationInfo.set({
      conversationId: 'conv-1',
      title: '测试对话',
      createdAt: '2026-04-10T10:00:00Z',
      updatedAt: '2026-04-10T10:00:00Z',
      events: [
        { type: 'user_message', payload: { content: '请修改代码' } },
        { type: 'tool_call', payload: { callId: 'c1', toolName: 'write_editor', input: [] } },
        { type: 'tool_result', payload: { callId: 'c1', success: true, output: { checkpointId: 'cp-2' } } },
      ],
    });

    component.handleRewindConversationRequest(0);
    const confirmConfig = modalServiceStub.confirm.calls.mostRecent().args[0];
    await confirmConfig.nzOnOk();

    expect(agentServiceStub.getCheckpoint$).toHaveBeenCalledWith('course-1', 'assign-1', 'cp-2', 'Matrix AI');
    expect(editor.executeEdits).toHaveBeenCalled();
  });

  it('delegates a user event to AgentLoopService', () => {
    const fixture = TestBed.createComponent(AssignmentComponent);
    const component = fixture.componentInstance;

    component.courseId = 'course-1' as any;
    component.assignId = 'assign-1' as any;
    component.currentConversationInfo.set({
      conversationId: 'conv-1',
      title: '新的对话',
      createdAt: '2026-04-10T10:00:00Z',
      updatedAt: '2026-04-10T10:00:00Z',
      events: [],
    });

    component.pushNewAgentEvent({
      type: 'user_message',
      payload: { content: '你好' },
    });

    expect(agentLoopServiceStub.emitAgentLoop).toHaveBeenCalled();
    expect(agentLoopServiceStub.emitAgentLoop.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({
      courseId: 'course-1',
      assignId: 'assign-1',
      userId: 'Matrix AI',
      userMessageContent: '你好',
      assignData: undefined,
    }));
  });
});
