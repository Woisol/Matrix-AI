import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import * as monaco from 'monaco-editor';
import { NzSplitterComponent, NzSplitterModule } from "ng-zorro-antd/splitter";
import { NzSplitterPanelComponent } from "../../../../../node_modules/.pnpm/ng-zorro-antd@20.1.2_fc4ae3c25fffe825e77a0aa6abb687ba/node_modules/ng-zorro-antd/splitter/index";
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
      --size-action-bar: 40px;

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
  }

  onEditorInit(editor: monaco.editor.IStandaloneCodeEditor) {
    console.log('Editor initialized');
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
    this.assignService.testRequest$(this.codeFile, this.testPanelInput(), 'c_cpp').subscribe({
      next: (output) => {
        this.testPanelOutput.set(output);
      },
      error: (error) => {
        this.testPanelOutput.set('运行错误: ' + error);
      }
    });
  }

}
