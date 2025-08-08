import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import * as monaco from 'monaco-editor';

export type EditorLanguage = 'javascript' | 'typescript' | 'c' | 'cpp' | 'json' | 'markdown' | 'python';

@Component({
  selector: 'code-editor',
  standalone: true,
  imports: [MonacoEditorModule, FormsModule],
  template: `
    <div class="editor-wrapper">
      <ngx-monaco-editor
        [(ngModel)]="code"
        [options]="editorOptions"
        (onInit)="onEditorInit($event)"
        (ngModelChange)="codeChange.emit($event)"
        class="monaco-editor"
      ></ngx-monaco-editor>
    </div>
  `,
  styles: [`
    .editor-wrapper {
      width: 100%;
      height: 100%;
      border: 1px solid #f0f0f0;
      border-radius: var(--size-radius-sm);
      overflow: hidden;
    }
    .monaco-editor {
      width: 100%;
      height: 100%;
    }
    :host {
      width: 100%;
      height: 100%;
      display:block;
    }
  `]
})
export class CodeEditorComponent {
  @Input() language: EditorLanguage = 'cpp';
  @Input() code = '';
  @Input() readOnly = false;
  @Input() theme: 'vs' | 'vs-dark' | 'hc-black' = 'vs';
  @Input() fontSize = 14;
  @Input() minimap = true;
  @Input() lineNumbers: 'on' | 'off' = 'on';
  // @Input() height = 400;

  @Output() codeChange = new EventEmitter<string>();
  @Output() editorReady = new EventEmitter<monaco.editor.IStandaloneCodeEditor>();

  get editorOptions(): monaco.editor.IStandaloneEditorConstructionOptions {
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

  onEditorInit(editor: monaco.editor.IStandaloneCodeEditor) {
    console.log('Editor initialized');
    // this.editorReady.emit(editor);

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
}
