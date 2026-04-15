/**
 * @file 编辑器范围验证和编辑后选择范围构建工具函数
 * @author GPT-5.4 xhigh
 */

import { MatrixAnalysisEditorRange } from "./components/code-applyable-markdown.component";

// 又用 like 😂
export interface MatrixAnalysisModelLike {
  getLineCount(): number;
  getLineMaxColumn(lineNumber: number): number;
}

type MatrixAnalysisValidationSuccess = {
  ok: true;
  range: MatrixAnalysisEditorRange;
};

type MatrixAnalysisValidationFailure = {
  ok: false;
  reason: string;
};

export type MatrixAnalysisValidationResult =
  | MatrixAnalysisValidationSuccess
  | MatrixAnalysisValidationFailure;

function isRangeReversed(range: MatrixAnalysisEditorRange): boolean {
  if (range.startLineNumber > range.endLineNumber) {
    return true;
  }

  return range.startLineNumber === range.endLineNumber
    && range.startColumn > range.endColumn;
}

function isValidLineNumber(model: MatrixAnalysisModelLike, lineNumber: number): boolean {
  return Number.isInteger(lineNumber)
    && lineNumber >= 1
    && lineNumber <= model.getLineCount();
}

function isValidColumn(model: MatrixAnalysisModelLike, lineNumber: number, column: number): boolean {
  if (!Number.isInteger(column) || column < 1) {
    return false;
  }

  return column <= model.getLineMaxColumn(lineNumber);
}

export function getFullEditorRange(model: MatrixAnalysisModelLike): MatrixAnalysisEditorRange {
  const endLineNumber = model.getLineCount();
  return {
    startLineNumber: 1,
    startColumn: 1,
    endLineNumber,
    endColumn: model.getLineMaxColumn(endLineNumber),
  };
}

export function validateMatrixAnalysisRange(
  model: MatrixAnalysisModelLike,
  range: MatrixAnalysisEditorRange,
): MatrixAnalysisValidationResult {
  if (!isValidLineNumber(model, range.startLineNumber) || !isValidLineNumber(model, range.endLineNumber)) {
    return {
      ok: false,
      reason: '编辑范围超出编辑器行数范围。',
    };
  }

  if (!isValidColumn(model, range.startLineNumber, range.startColumn)
    || !isValidColumn(model, range.endLineNumber, range.endColumn)) {
    return {
      ok: false,
      reason: '编辑范围超出当前行的列范围。',
    };
  }

  if (isRangeReversed(range)) {
    return {
      ok: false,
      reason: '起始位置不能晚于结束位置。',
    };
  }

  return {
    ok: true,
    range,
  };
}

/**
 * 计算编辑后新的选择范围
 * @param range 原始编辑范围
 * @param insertedText 插入的文本内容
 * @returns 编辑后新的选择范围
 */
export function buildEditedSelectionRange(
  range: MatrixAnalysisEditorRange,
  insertedText: string,
): MatrixAnalysisEditorRange {
  if (!insertedText.length) {
    return {
      startLineNumber: range.startLineNumber,
      startColumn: range.startColumn,
      endLineNumber: range.startLineNumber,
      endColumn: range.startColumn,
    };
  }

  const lines = insertedText.split(/\r\n|\n|\r/);
  const endLineNumber = range.startLineNumber + lines.length - 1;
  const endColumn = lines.length === 1
    ? range.startColumn + lines[0].length
    : lines[lines.length - 1].length + 1;

  return {
    startLineNumber: range.startLineNumber,
    startColumn: range.startColumn,
    endLineNumber,
    endColumn,
  };
}
