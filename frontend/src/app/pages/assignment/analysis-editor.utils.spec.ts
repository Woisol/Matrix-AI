import {
  buildEditedSelectionRange,
  getFullEditorRange,
  validateMatrixAnalysisRange,
  type MatrixAnalysisModelLike,
} from './analysis-editor.utils';

function createModel(lineLengths: number[]): MatrixAnalysisModelLike {
  return {
    getLineCount: () => lineLengths.length,
    getLineMaxColumn: (lineNumber: number) => {
      const lineLength = lineLengths[lineNumber - 1];
      if (lineLength == null) {
        throw new Error(`Unknown line: ${lineNumber}`);
      }

      return lineLength + 1;
    },
  };
}

describe('validateMatrixAnalysisRange', () => {
  it('accepts a range that stays inside model bounds', () => {
    const result = validateMatrixAnalysisRange(createModel([5, 8, 0]), {
      startLineNumber: 1,
      startColumn: 2,
      endLineNumber: 2,
      endColumn: 6,
    });

    expect(result).toEqual({
      ok: true,
      range: {
        startLineNumber: 1,
        startColumn: 2,
        endLineNumber: 2,
        endColumn: 6,
      },
    });
  });

  it('rejects reversed ranges', () => {
    const result = validateMatrixAnalysisRange(createModel([5, 8]), {
      startLineNumber: 2,
      startColumn: 4,
      endLineNumber: 1,
      endColumn: 3,
    });

    expect(result.ok).toBeFalse();
    if (result.ok) {
      fail('Expected reversed range to be rejected.');
      return;
    }
    expect(result.reason).toContain('起始位置');
  });

  it('rejects coordinates outside line bounds', () => {
    const result = validateMatrixAnalysisRange(createModel([2, 2]), {
      startLineNumber: 1,
      startColumn: 4,
      endLineNumber: 1,
      endColumn: 4,
    });

    expect(result.ok).toBeFalse();
    if (result.ok) {
      fail('Expected out-of-bounds range to be rejected.');
      return;
    }
    expect(result.reason).toContain('超出');
  });
});

describe('buildEditedSelectionRange', () => {
  it('selects the inserted text for a single-line replacement', () => {
    const selection = buildEditedSelectionRange(
      {
        startLineNumber: 2,
        startColumn: 3,
        endLineNumber: 2,
        endColumn: 5,
      },
      'value',
    );

    expect(selection).toEqual({
      startLineNumber: 2,
      startColumn: 3,
      endLineNumber: 2,
      endColumn: 8,
    });
  });

  it('selects the inserted text for a multi-line replacement', () => {
    const selection = buildEditedSelectionRange(
      {
        startLineNumber: 3,
        startColumn: 1,
        endLineNumber: 4,
        endColumn: 2,
      },
      'first line\nsecond line',
    );

    expect(selection).toEqual({
      startLineNumber: 3,
      startColumn: 1,
      endLineNumber: 4,
      endColumn: 12,
    });
  });

  it('collapses the selection when inserted text is empty', () => {
    const selection = buildEditedSelectionRange(
      {
        startLineNumber: 5,
        startColumn: 6,
        endLineNumber: 5,
        endColumn: 9,
      },
      '',
    );

    expect(selection).toEqual({
      startLineNumber: 5,
      startColumn: 6,
      endLineNumber: 5,
      endColumn: 6,
    });
  });
});

describe('getFullEditorRange', () => {
  it('returns a range covering the whole model', () => {
    const range = getFullEditorRange(createModel([5, 8, 0]));

    expect(range).toEqual({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: 3,
      endColumn: 1,
    });
  });
});
