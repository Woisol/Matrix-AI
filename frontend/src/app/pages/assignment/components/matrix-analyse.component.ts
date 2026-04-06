import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Complexity, MdCodeContent, MdContent } from "../../../api/type/assigment";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { MarkdownComponent } from "ngx-markdown";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconModule } from "ng-zorro-antd/icon";
import {
  MatrixAnalysisEditRequest,
  MatrixAnalysisEditorRange,
  MatrixAnalysisRenderSegment,
  parseMatrixAnalysisSegments,
} from "./matrix-analyse.utils";
import { NzTooltipDirective } from "ng-zorro-antd/tooltip";

export interface MatrixAnalysisProps {
  content: {
    title: string
    content: MdCodeContent
    complexity?: Complexity
  }[]
  summary?: MdContent
  showInEditor?: boolean
}

@Component({
  selector: "matrix-analyse",
  imports: [NzTabsModule, MarkdownComponent, NzButtonModule, NzIconModule, NzTooltipDirective],
  template: `
    <nz-tabs>
      @for (tab of analysis?.content; track $index) {
        <nz-tab [nzTitle]="tab.title.trim() || '无标题'">
          <div class="analyse-con">
            <div class="complexity">
              @if (tab.complexity) {
                <span><nz-icon nzType="clock-circle" nzTheme="outline" /> {{ tab.complexity.time }}</span>
                <span><nz-icon nzType="appstore" nzTheme="outline" /> {{ tab.complexity.space }}</span>
              }
            </div>

            @if (!tab.content?.trim()) {
              <markdown class="markdown-patched" [data]="'这里没有内容呢'"></markdown>
            } @else {
              @for (segment of getTabSegments(tab.title, tab.content); track $index) {
                @if (segment.type === 'markdown') {
                  @if (segment.markdown.trim()) {
                    <markdown class="markdown-patched" [data]="segment.markdown"></markdown>
                  }
                } @else {
                  <section class="editor-patch-card">
                    <div class="editor-patch-toolbar">
                      <span class="editor-patch-range">
                        {{ segment.language }} · {{ describeRequestTarget(segment.request) }}
                      </span>
                      <button
                        nzType="default"
                        nzSize="small"
                        nz-tooltip="应用到编辑器"
                        (click)="applyToEditor.emit(segment.request)"
                      >
                        <span nz-icon nzType="check" nzTheme="outline"></span>
                      </button>
                    </div>
                    <markdown
                      class="markdown-patched editor-patch-preview"
                      [data]="segment.previewMarkdown"
                    ></markdown>
                  </section>
                }
              }
            }
          </div>
        </nz-tab>
      }
    </nz-tabs>
    @if (analysis?.summary) {
      <summary class="analyse-summary">
        <markdown class="markdown-patched" [data]="analysis?.summary"></markdown>
      </summary>
    }
  `,
  styles: [`
    .analyse-con {
      width: 100%;
      max-height: 100%;
      padding: 16px;
      background: #f0f2f5;
      border-radius: var(--size-radius-sm);
      position: relative;

      .complexity {
        margin-bottom: 12px;

        span {
          text-align: center;
          &:not(:last-child) {
            margin-right: 8px;
          }
        }
      }
    }

    .editor-patch-card {
      margin: 12px 0;
      border: 1px solid #d9d9d9;
      border-radius: var(--size-radius-sm);
      background: #fff;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
    }

    .editor-patch-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-bottom: 1px solid #f0f0f0;
      background: #fafafa;
    }

    .editor-patch-range {
      font-size: 12px;
      color: #595959;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    }

    .editor-patch-preview {
      display: block;
      padding: 0 12px 12px;
    }

    .analyse-summary {
      margin-top: 10px;
      padding: 8px 16px;
      background: #fafafa;
      border-left: 2px solid var(--color-primary);
      border-radius: var(--size-radius-sm);
    }
  `]
})
export class MatrixAnalyseComponent {
  @Input() analysis: MatrixAnalysisProps | undefined = undefined;
  @Input() allowWholeEditorReplace = true;
  @Output() applyToEditor = new EventEmitter<MatrixAnalysisEditRequest>();

  getTabSegments(title: string, content: MdCodeContent): MatrixAnalysisRenderSegment[] {
    return parseMatrixAnalysisSegments(
      content,
      this.analysis?.showInEditor,
      title,
      this.allowWholeEditorReplace,
    );
  }

  describeRequestTarget(request: MatrixAnalysisEditRequest): string {
    return request.target === 'full-editor'
      ? '全文替换'
      : this.formatRange(request.range);
  }

  formatRange(range: MatrixAnalysisEditorRange): string {
    return `L${range.startLineNumber}:C${range.startColumn} - L${range.endLineNumber}:C${range.endColumn}`;
  }
}
