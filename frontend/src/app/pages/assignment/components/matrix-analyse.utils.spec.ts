import {
  parseMatrixAnalysisSegments,
  type MatrixAnalysisRenderSegment,
} from './matrix-analyse.utils';

function getPatchSegment(segments: MatrixAnalysisRenderSegment[]) {
  const patchSegment = segments.find(
    (segment): segment is Extract<MatrixAnalysisRenderSegment, { type: 'editor-patch' }> =>
      segment.type === 'editor-patch',
  );

  expect(patchSegment).toBeDefined();
  return patchSegment!;
}

describe('parseMatrixAnalysisSegments', () => {
  it('returns one markdown segment when showInEditor is disabled', () => {
    const content = ['Intro', '```cpp:1C1-1C4', 'code', '```', 'Outro'].join('\n');

    const segments = parseMatrixAnalysisSegments(content, false, 'Example');

    expect(segments).toEqual([
      {
        type: 'markdown',
        markdown: content,
      },
    ]);
  });

  it('parses a coordinate fence into a range edit request', () => {
    const content = [
      'Apply this patch:',
      '',
      '```cpp:2C3-4C5',
      'int value = 1;',
      'return value;',
      '```',
      '',
      'Run the code after applying it.',
    ].join('\n');

    const segments = parseMatrixAnalysisSegments(content, true, 'Code Analysis');
    const patchSegment = getPatchSegment(segments);

    expect(segments.length).toBe(3);
    expect(segments[0]).toEqual({
      type: 'markdown',
      markdown: 'Apply this patch:\n\n',
    });
    expect(patchSegment.language).toBe('cpp');
    expect(patchSegment.code).toBe('int value = 1;\nreturn value;\n');
    expect(patchSegment.previewMarkdown).toBe('```cpp\nint value = 1;\nreturn value;\n```');
    expect(patchSegment.request).toEqual({
      target: 'range',
      language: 'cpp',
      tabTitle: 'Code Analysis',
      text: 'int value = 1;\nreturn value;\n',
      range: {
        startLineNumber: 2,
        startColumn: 3,
        endLineNumber: 4,
        endColumn: 5,
      },
    });
    expect(segments[2]).toEqual({
      type: 'markdown',
      markdown: '\n\nRun the code after applying it.',
    });
  });

  it('parses multiple coordinate fences inside one block', () => {
    const content = [
      '```cpp:1C1-1C2',
      'ab',
      '```',
      '',
      '```cpp:3C1-3C3',
      'xyz',
      '```',
    ].join('\n');

    const segments = parseMatrixAnalysisSegments(content, true, 'Multi Patch');
    const patchSegments = segments.filter(
      (segment): segment is Extract<MatrixAnalysisRenderSegment, { type: 'editor-patch' }> =>
        segment.type === 'editor-patch',
    );

    expect(patchSegments.length).toBe(2);
    expect(patchSegments[0].request).toEqual({
      target: 'range',
      language: 'cpp',
      tabTitle: 'Multi Patch',
      text: 'ab\n',
      range: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 2,
      },
    });
    expect(patchSegments[1].request).toEqual({
      target: 'range',
      language: 'cpp',
      tabTitle: 'Multi Patch',
      text: 'xyz\n',
      range: {
        startLineNumber: 3,
        startColumn: 1,
        endLineNumber: 3,
        endColumn: 3,
      },
    });
  });

  it('treats a plain language fence as full editor replacement when enabled', () => {
    const content = [
      'Reference solution:',
      '',
      '```C++',
      '#include <iostream>',
      'int main() {',
      '  return 0;',
      '}',
      '```',
    ].join('\n');

    const segments = parseMatrixAnalysisSegments(content, true, 'Reference', true);
    const patchSegment = getPatchSegment(segments);

    expect(patchSegment.language).toBe('C++');
    expect(patchSegment.previewMarkdown).toBe('```C++\n#include <iostream>\nint main() {\n  return 0;\n}\n```');
    expect(patchSegment.request).toEqual({
      target: 'full-editor',
      language: 'C++',
      tabTitle: 'Reference',
      text: '#include <iostream>\nint main() {\n  return 0;\n}\n',
    });
  });

  it('keeps a plain language fence as markdown when whole editor replacement is disabled', () => {
    const content = ['```C++', 'int main() {}', '```'].join('\n');

    const segments = parseMatrixAnalysisSegments(content, true, 'Reference', false);

    expect(segments).toEqual([
      {
        type: 'markdown',
        markdown: content,
      },
    ]);
  });

  it('normalizes preview markdown when code does not end with a newline', () => {
    const content = ['```cpp:1C1-1C2', 'ab```'].join('\n');

    const segments = parseMatrixAnalysisSegments(content, true, 'Preview');
    const patchSegment = getPatchSegment(segments);

    expect(patchSegment.code).toBe('ab');
    expect(patchSegment.previewMarkdown).toBe('```cpp\nab\n```');
  });

  it('keeps malformed coordinate fences in markdown flow', () => {
    const content = ['```cpp:2x3-4C5', 'broken', '```'].join('\n');

    const segments = parseMatrixAnalysisSegments(content, true, 'Invalid');

    expect(segments).toEqual([
      {
        type: 'markdown',
        markdown: content,
      },
    ]);
  });

  it('keeps unclosed special fences in markdown flow', () => {
    const content = ['Hint', '```cpp:2C3-4C5', 'missing close'].join('\n');

    const segments = parseMatrixAnalysisSegments(content, true, 'Unclosed');

    expect(segments).toEqual([
      {
        type: 'markdown',
        markdown: content,
      },
    ]);
  });
});
