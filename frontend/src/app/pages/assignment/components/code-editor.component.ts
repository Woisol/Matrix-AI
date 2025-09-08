import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import * as monaco from 'monaco-editor';
import { NzSplitterModule } from "ng-zorro-antd/splitter";
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzInputModule } from 'ng-zorro-antd/input';
import { AssignService } from '../../../services/assign/assign.service';
import { CodeFileInfo } from '../../../api/type/assigment';

export type EditorLanguage = 'javascript' | 'typescript' | 'c' | 'cpp' | 'json' | 'markdown' | 'python';

@Component({
  selector: 'code-editor',
  standalone: true,
  imports: [MonacoEditorModule, FormsModule, NzSplitterModule, NzFloatButtonModule, NzButtonModule, NzInputModule],
  template: `
    <div class="editor-wrapper">
      <nz-splitter nzLayout="vertical" class="editor-splitter" (nzResize)="setTestPanelSize($event)">
        <nz-splitter-panel [nzCollapsible]="false" [nzSize]="testPanelOpen()? testPanelSize()[0]:'100%'">
          <ngx-monaco-editor
          [(ngModel)]="codeFile.content"
          [options]="editorOptions"
          (onInit)="onEditorInit($event)"
          (ngModelChange)="codeChange.emit($event)"
          class="monaco-editor"
          ></ngx-monaco-editor>
        </nz-splitter-panel>
        @if(testPanelOpen()) {
          <nz-splitter-panel nzMin="100" [nzSize]="testPanelSize()[1]" [nzResizable]="true" >
            <!-- class="hidable" [class.hide]="!testPanelOpen()" -->
            <div class="test-run-panel">
              <div class="col left">
                <textarea nz-input [(ngModel)]="testPanelInput"></textarea>
              </div>
              <div class="col right">
                {{testPanelOutput()}}
              </div>
            </div>
          </nz-splitter-panel>
          }
      </nz-splitter>
      <div class="action-bar">
        <button class="secondary" (click)="handleTestPanelToggle()">测试面板</button>
        <button class="secondary hidable" [class.hide]="!testPanelOpen()" (click)="onTestRequest()">运行</button>
        <button (click)="onSubmitRequest()">提交</button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --size-action-bar: 56px;

      width: 100%;
      height: 100%;
      display:block;
    }
    .editor-wrapper {
      width: 100%;
      height: 100%;
      border: 1px solid #f0f0f0;
      border-radius: var(--size-radius-sm);
      overflow: hidden;
    }
    .editor-splitter {
      height: calc(100% - var(--size-action-bar));
    }
    .monaco-editor {
      width: 100%;
      height: 100%;
    }
    .action-bar{
      width: 100%;
      height: var(--size-action-bar);
      padding: 8px 0;
      display: flex;
      gap: 4px;
      justify-content: flex-end;
    }
    .test-run-panel{
      width: 100%;
      height: 100%;
      display: flex;
      gap: 5px;
      &>.col{
        /*display: inline-block;
        width: 49%;*/
        height: 100%;
        flex:1;
        &>::ng-deep textarea{
          resize: none;
          height: 100%;
        }
        &.right{
          padding: 4px 11px;
          border: 1px solid var(--color-border);
        }
      }
    }
    .hidable{
      width: calc-size(auto);
      height: calc-size(auto);
      overflow: hidden;
      transition: width 0.3s ease-in-out,height 0.3s ease-in-out,
      padding-left 0.3s ease-in-out,padding-right 0.3s ease-in-out,
        filter 0.3s ease-in-out,
        box-shadow 0.3s ease-in-out;
      &.hide{
        width: 0;
        height: 0;
        padding: 0;
        font-size: 0;
        border: none;
        background: none;
        white-space: nowrap;
      }
    }
  `]
})
export class CodeEditorComponent implements OnChanges {
  @Input() language: EditorLanguage = 'cpp';
  @Input() codeFile: CodeFileInfo = { fileName: '', content: '' };
  @Input() readOnly = false;
  @Input() theme: 'vs' | 'vs-dark' | 'hc-black' = 'vs';
  @Input() fontSize = 14;
  @Input() minimap = true;
  @Input() lineNumbers: 'on' | 'off' = 'on';
  @Input() onSubmitRequest: () => void = () => { console.error('submit function not implemented'); };
  // @Input() height = 400;

  @Output() codeChange = new EventEmitter<string>();
  @Output() editorReady = new EventEmitter<monaco.editor.IStandaloneCodeEditor>();

  editor: monaco.editor.IStandaloneCodeEditor | undefined;
  // 缓存待设置的内容，用于编辑器初始化后设置
  private pendingContent: string | null = null;

  testPanelOpen = signal(false);
  testPanelSize = signal(['100%', 300]);
  testPanelInput = signal('');
  testPanelOutput = signal('等待测试运行……');

  // 缓存 options，避免每次变更检测创建新引用触发编辑器重建
  editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = this.buildOptions();

  constructor(private assignService: AssignService) { }
  private buildOptions(): monaco.editor.IStandaloneEditorConstructionOptions {
    return {
      theme: this.theme,
      language: this.language,
      readOnly: this.readOnly,
      fontSize: this.fontSize,
      automaticLayout: true,
      minimap: { enabled: this.minimap },
      lineNumbers: this.lineNumbers,
      scrollBeyondLastLine: false,
      padding: { top: 8, bottom: 8 },
      wordWrap: 'on'
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['language'] || changes['readOnly'] || changes['theme'] || changes['fontSize'] || changes['minimap'] || changes['lineNumbers']) {
      // 仅当相关输入变化时重建配置对象
      this.editorOptions = this.buildOptions();
    }

    if (changes['codeFile']) {
      const newContent = changes['codeFile'].currentValue?.content || '';
      // 外部 codeFile 变化时更新内容
      if (this.editor) {
        this.editor.setValue(newContent);
      } else {
        // 编辑器还未初始化，缓存内容待后续设置
        this.pendingContent = newContent;
      }
      //! 这个所谓的 [(ngModel)] 完全没有双向绑定()
      // this.editorContent = changes['codeFile'].currentValue.content || '';
    }

    // if (changes['editorContent']) {
    //   console.debug(changes['editorContent'].currentValue);
    // }
  }

  onEditorInit(editor: monaco.editor.IStandaloneCodeEditor) {
    console.log('Editor initialized');
    this.editor = editor;

    // 如果有待设置的内容，立即设置
    if (this.pendingContent !== null) {
      editor.setValue(this.pendingContent);
      this.pendingContent = null; // 清除缓存
    } else if (this.codeFile?.content) {
      // 设置初始内容
      editor.setValue(this.codeFile.content);
    }

    this.editorReady.emit(editor);

    // 额外注册 C / C++ （monaco 默认不包含，需要手动注册简单占位，可引入第三方语法高亮扩展）
    const extraLangs: { id: EditorLanguage; extensions: string[] }[] = [
      { id: 'c', extensions: ['.c', '.h'] },
      { id: 'cpp', extensions: ['.cpp', '.hpp', '.cc', '.hh'] }
    ];
    extraLangs.forEach(l => {
      if (!monaco.languages.getLanguages().some(gl => gl.id === l.id)) {
        monaco.languages.register({ id: l.id, extensions: l.extensions });
      }
    });
  }

  setTestPanelSize(size: (string | number)[]) {
    this.testPanelSize.set(size);
  }

  handleTestPanelToggle() {
    this.testPanelOpen.set(!this.testPanelOpen());
  }

  onTestRequest() {
    this.testPanelOutput.set('测试运行中……');
    this.assignService.testRequest$(this.codeFile, this.testPanelInput(), 'c_cpp').subscribe(output => {
      this.testPanelOutput.set(output);
    });
  }

}
