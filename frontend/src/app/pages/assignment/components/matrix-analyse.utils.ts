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
    tabTitle: string;
  }
  | {
    target: 'full-editor';
    language: string;
    range?: never;
    text: string;
    tabTitle: string;
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
  tabTitle: string,
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
          tabTitle,
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
          tabTitle,
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
