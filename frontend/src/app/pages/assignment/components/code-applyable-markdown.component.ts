import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MdCodeContent } from "../../../api/type/assigment";
import { MarkdownModule } from "ngx-markdown";
import { NzTooltipModule } from "ng-zorro-antd/tooltip";
import { NzIconModule } from "ng-zorro-antd/icon";

@Component({
  selector: "code-applyable-markdown",
  imports: [MarkdownModule, NzTooltipModule, NzIconModule],
  template: `
    @if (!content.trim()) {
      <markdown class="markdown-patched" [data]="'这里没有内容呢'"></markdown>
    } @else {
      @for (segment of getTabSegments(); track $index) {
        @if (segment.type === 'markdown') {
          @if (segment.markdown.trim()) {
            <markdown class="markdown-patched" [data]="segment.markdown"></markdown>
          }
        } @else {
          <section class="editor-patch-card">
            <div class="editor-patch-toolbar">
              <span
                class="editor-patch-range"
                tabindex="0"
                role="button"
                nz-tooltip
                [nzTooltipTitle]="segment.request.target === 'range' ? '在编辑器中定位范围' : ''"
                (click)="focusRequestRange(segment.request)"
              >
                {{ segment.language }} · {{ describeRequestTarget(segment.request) }}
              </span>
              <button
                class="apply-action"
                nz-tooltip
                [nzTooltipTitle]="'应用到编辑器'"
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

  `,
  styles: `
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
      cursor: pointer;
    }

    .editor-patch-preview {
      display: block;
      padding: 0 12px 12px;
    }

    .apply-action {
      padding: 4px 8px;
    }
  `,
})
export class CodeApplyableMarkdownComponent {
  @Input() content: string = '';
  @Output() focusRequestRangeOnEditor = new EventEmitter<MatrixAnalysisEditorRange>();
  @Output() applyToEditor = new EventEmitter<MatrixAnalysisEditRequest>();
  getTabSegments(): MatrixAnalysisRenderSegment[] {
    return parseMatrixAnalysisSegments(
      this.content,
      true,
      // title,
      true,
    );
  }
  describeRequestTarget(request: MatrixAnalysisEditRequest): string {
    return request.target === 'full-editor'
      ? '全篇替换'
      : this.formatRange(request.range);
  }

  focusRequestRange(request: MatrixAnalysisEditRequest): void {
    if (request.target === 'range') {
      this.focusRequestRangeOnEditor.emit({ ...request.range });
    }
  }

  formatRange(range: MatrixAnalysisEditorRange): string {
    return `L${range.startLineNumber}:C${range.startColumn} - L${range.endLineNumber}:C${range.endColumn}`;
  }

}

export interface MatrixAnalysisEditorRange {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

export type MatrixAnalysisEditRequest =
  | {
    target: 'range';
    language: string;
    range: MatrixAnalysisEditorRange;
    text: string;
    // tabTitle: string;
  }
  | {
    target: 'full-editor';
    language: string;
    range?: never;
    text: string;
    // tabTitle: string;
  };

export type MatrixAnalysisRenderSegment =
  | {
    type: 'markdown';
    markdown: string;
  }
  | {
    type: 'editor-patch';
    language: string;
    code: string;
    previewMarkdown: string;
    request: MatrixAnalysisEditRequest;
  };

const SPECIAL_FENCE_PATTERN = /^([a-zA-Z0-9_#+-]+):(\d+)C(\d+)-(\d+)C(\d+)$/;
const PLAIN_LANGUAGE_FENCE_PATTERN = /^[a-zA-Z0-9_#+-]+$/;
const FENCED_CODE_BLOCK_PATTERN = /```([^\r\n]*)\r?\n([\s\S]*?)```/g;

function buildPreviewMarkdown(language: string, code: string): string {
  const normalizedCode = code.endsWith('\n') ? code : `${code}\n`;
  return `\`\`\`${language}\n${normalizedCode}\`\`\``;
}

function coalesceMarkdownSegments(segments: MatrixAnalysisRenderSegment[]): MatrixAnalysisRenderSegment[] {
  return segments.reduce<MatrixAnalysisRenderSegment[]>((result, segment) => {
    const previousSegment = result[result.length - 1];

    if (segment.type === 'markdown' && previousSegment?.type === 'markdown') {
      previousSegment.markdown += segment.markdown;
      return result;
    }

    result.push(segment);
    return result;
  }, []);
}

/**
 * 解析内容，将特殊格式的代码块转换为编辑器补丁段，同时保留普通 Markdown 段
 */
export function parseMatrixAnalysisSegments(
  content: string | null | undefined,
  showInEditor: boolean | null | undefined,
  // tabTitle: string,
  allowWholeEditorReplace = false,
): MatrixAnalysisRenderSegment[] {
  const markdownContent = content ?? '';
  if (!showInEditor || !markdownContent.trim()) {
    return [{ type: 'markdown', markdown: markdownContent }];
  }

  const segments: MatrixAnalysisRenderSegment[] = [];
  let lastMatchEnd = 0;

  for (const match of markdownContent.matchAll(FENCED_CODE_BLOCK_PATTERN)) {
    const fullMatch = match[0];
    const header = match[1]?.trim() ?? '';
    const code = match[2] ?? '';
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastMatchEnd) {
      segments.push({
        type: 'markdown',
        markdown: markdownContent.slice(lastMatchEnd, matchIndex),
      });
    }

    const specialFenceMatch = header.match(SPECIAL_FENCE_PATTERN);
    if (specialFenceMatch) {
      segments.push({
        type: 'editor-patch',
        language: specialFenceMatch[1],
        code,
        previewMarkdown: buildPreviewMarkdown(specialFenceMatch[1], code),
        request: {
          target: 'range',
          language: specialFenceMatch[1],
          // tabTitle,
          text: code,
          range: {
            startLineNumber: Number(specialFenceMatch[2]),
            startColumn: Number(specialFenceMatch[3]),
            endLineNumber: Number(specialFenceMatch[4]),
            endColumn: Number(specialFenceMatch[5]),
          },
        },
      });
      lastMatchEnd = matchIndex + fullMatch.length;
      continue;
    }

    if (allowWholeEditorReplace && header.match(PLAIN_LANGUAGE_FENCE_PATTERN)) {
      segments.push({
        type: 'editor-patch',
        language: header,
        code,
        previewMarkdown: buildPreviewMarkdown(header, code),
        request: {
          target: 'full-editor',
          language: header,
          // tabTitle,
          text: code,
        },
      });
      lastMatchEnd = matchIndex + fullMatch.length;
      continue;
    }

    segments.push({
      type: 'markdown',
      markdown: fullMatch,
    });
    lastMatchEnd = matchIndex + fullMatch.length;
  }

  if (lastMatchEnd < markdownContent.length) {
    segments.push({
      type: 'markdown',
      markdown: markdownContent.slice(lastMatchEnd),
    });
  }

  return coalesceMarkdownSegments(
    segments.length ? segments : [{ type: 'markdown', markdown: markdownContent }],
  );


}

