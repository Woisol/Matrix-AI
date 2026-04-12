import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import * as monaco from 'monaco-editor';
import { AssignmentComponent } from './assigment.component';
import { CourseInfoTabComponent } from './components/course-info-tab.component';
import { CodeEditorComponent } from './components/code-editor.component';
import { AssignService } from '../../services/assign/assign.service';
import { AgentService } from '../../services/assign/agent/agent.service';
import { AgentLoopService } from '../../services/assign/agent/agent-loop.service';
import { NotificationService } from '../../services/notification/notification.service';
import { Analysis, AssignData, CodeFileInfo } from '../../api/type/assigment';
import { MatrixAnalysisEditorRange, MatrixAnalysisEditRequest } from './components/matrix-analyse.utils';
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
  @Output() createNewConversation = new EventEmitter<void>();
  @Output() loadConversationInfo = new EventEmitter<string>();
  @Output() refreshConversationHistory = new EventEmitter<void>();
  @Output() patchConversationTitle = new EventEmitter<{ conversationId: string; title: string }>();
  @Output() deleteConversation = new EventEmitter<string>();
  @Output() pushNewAgentEvent = new EventEmitter<MatrixAgentEvent>();
  @Output() applyAnalysisEdit = new EventEmitter<MatrixAnalysisEditRequest>();
  @Output() focusRequestRangeOnEditor = new EventEmitter<MatrixAnalysisEditorRange>();
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
  };

  const agentLoopServiceStub = {
    emitAgentLoop: jasmine.createSpy('emitAgentLoop').and.resolveTo(undefined),
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

  function createFocusedEditorMock() {
    return {
      setSelection: jasmine.createSpy('setSelection'),
      revealRangeInCenter: jasmine.createSpy('revealRangeInCenter'),
      focus: jasmine.createSpy('focus'),
      getModel: jasmine.createSpy('getModel').and.returnValue({
        getValue: () => 'updated',
        getLineCount: () => 2,
        getLineMaxColumn: (lineNumber: number) => (lineNumber === 1 ? 4 : 1),
      }),
      pushUndoStop: jasmine.createSpy('pushUndoStop'),
      executeEdits: jasmine.createSpy('executeEdits').and.returnValue(true),
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
    agentLoopServiceStub.emitAgentLoop.calls.reset();
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
      language: 'cpp',
      tabTitle: 'Code Analysis',
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
