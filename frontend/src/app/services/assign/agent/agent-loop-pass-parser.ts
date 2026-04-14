import type {
  MatrixAgentEventOutput,
  MatrixAgentEventThink,
  MatrixAgentEventToolCall,
  MatrixAgentEventToolResult,
} from "../../../api/type/agent";
import type { AgentLoopToolName } from "./agent-loop-tool-provider.service";

type AgentXmlTag = 'think' | 'tool_call' | 'output';

export type AgentLoopPassDisplayEvent =
  | MatrixAgentEventOutput
  | MatrixAgentEventThink
  | MatrixAgentEventToolCall
  | MatrixAgentEventToolResult;

/**
* 在 event 的基础上包装一个 stable 字段，只有已经明确闭合的内容才会 stable 并允许持久化
*/
type ParsedDisplayBlock = {
  event: AgentLoopPassDisplayEvent;
  stable: boolean;
};

export type AgentLoopPassSnapshot = {
  displayEvents: AgentLoopPassDisplayEvent[];
  stableCount: number;
  toolBlockIds: string[];
  toolCalls: MatrixAgentEventToolCall[];
  toolErrors: MatrixAgentEventToolResult[];
};

const INVALID_TOOL_CALL_MESSAGE =
  'Invalid tool_call payload. Use JSON {"toolName":"...","input":["..."]} or comma-separated "toolName, arg1, arg2".';
/**
 * 核心解析方法，将模型输出的 raw text 解析为前端可展示的事件列表，并提取工具调用信息
 */
export function parseAgentLoopPass(args: {
  rawText: string;
  existingToolCallIds: string[];
  enabledTools: AgentLoopToolName[];
  finalize: boolean;
  nextCallId: () => string;
}): AgentLoopPassSnapshot {
  const { rawText, existingToolCallIds, finalize, nextCallId } = args;
  const blocks: ParsedDisplayBlock[] = [];
  const toolBlockIds: string[] = [];
  const toolCalls: MatrixAgentEventToolCall[] = [];
  const toolErrors: MatrixAgentEventToolResult[] = [];
  let cursor = 0;
  let toolIndex = 0;
  let curTag: AgentXmlTag | null = null;
  let curTagStartIndex = -1;
  let curTagContentStartIndex = -1;

  while (cursor < rawText.length) {
    if (curTag === null) {
      const nextTag = findNextOpeningTag(rawText, cursor, finalize);
      if (!nextTag) {
        pushOutputBlock(blocks, rawText.slice(cursor), finalize);
        break;
      }
      // push 标签前的文本为 output
      if (nextTag.index > cursor) {
        pushOutputBlock(blocks, rawText.slice(cursor, nextTag.index), true);
      }

      curTag = nextTag.tag;
      curTagStartIndex = nextTag.index;
      curTagContentStartIndex = nextTag.index + nextTag.openTag.length;
      cursor = curTagContentStartIndex;
      continue;
    }

    const closeTag = `</${curTag}>`;
    const closeIndex = rawText.indexOf(closeTag, cursor);
    if (closeIndex === -1) {
      // 说明有 开标签 但没有 闭标签，直接 push 为 output
      if (curTag === 'think' && !finalize) {
        // ？？？直接 push？？？
        blocks.push({
          event: {
            type: 'think',
            payload: { content: rawText.slice(curTagContentStartIndex) },
          },
          stable: false,
        });
      } else if (curTag === 'output') {
        pushOutputBlock(blocks, rawText.slice(curTagContentStartIndex), finalize);
      } else {
        pushOutputBlock(blocks, rawText.slice(curTagStartIndex), finalize);
      }
      break;
    }

    const tagContent = rawText.slice(curTagContentStartIndex, closeIndex);
    if (curTag === 'output') {
      pushOutputBlock(blocks, tagContent, true);
    } else if (curTag === 'think') {
      blocks.push({
        event: {
          type: 'think',
        payload: { content: tagContent },
        },
        stable: true,
      });
    } else {
      const callId = existingToolCallIds[toolIndex] ?? nextCallId();
      toolBlockIds.push(callId);
      toolIndex += 1;

      const parsedToolCall = parseToolCallPayload(tagContent);
      if (parsedToolCall.ok) {
        const toolCallEvent: MatrixAgentEventToolCall = {
          type: 'tool_call',
          payload: {
            callId,
            toolName: parsedToolCall.toolName,
            input: parsedToolCall.input,
          },
        };
        blocks.push({ event: toolCallEvent, stable: true });
        toolCalls.push(toolCallEvent);
      } else {
        const toolError: MatrixAgentEventToolResult = {
          type: 'tool_result',
          payload: {
            callId,
            success: false,
            output: INVALID_TOOL_CALL_MESSAGE,
          },
        };
        blocks.push({ event: toolError, stable: true });
        toolErrors.push(toolError);
      }
    }

    cursor = closeIndex + closeTag.length;
    curTag = null;
    curTagStartIndex = -1;
    curTagContentStartIndex = -1;
  }

  return {
    displayEvents: blocks.map((block) => block.event),
    stableCount: finalize ? blocks.length : countStablePrefix(blocks),
    toolBlockIds,
    toolCalls,
    toolErrors,
  };
}
/**
 * 找 /<(think|tool_call|output)>/
 */
function findNextOpeningTag(
  text: string,
  cursor: number,
  finalize: boolean,
): { tag: AgentXmlTag; index: number; openTag: string } | null {
  const tagPattern = /<(think|tool_call|output)>/g;
  tagPattern.lastIndex = cursor;

  let match: RegExpExecArray | null;
  while ((match = tagPattern.exec(text)) !== null) {
    const tag = match[1] as AgentXmlTag;
    const index = match.index;
    const openTag = match[0];

    if (tag !== 'tool_call') {
      return { tag, index, openTag };
    }

    if (finalize || text.indexOf('</tool_call>', index + openTag.length) !== -1) {
      return { tag, index, openTag };
    }
  }

  return null;
}

function pushOutputBlock(blocks: ParsedDisplayBlock[], content: string, stable: boolean): void {
  if (!content) {
    return;
  }

  blocks.push({
    event: {
      type: 'output',
      payload: { content },
    },
    stable,
  });
}

function countStablePrefix(blocks: ParsedDisplayBlock[]): number {
  let stableCount = 0;
  for (const block of blocks) {
    if (!block.stable) {
      break;
    }
    stableCount += 1;
  }
  return stableCount;
}

function parseToolCallPayload(
  content: string,
): { ok: true; toolName: string; input: string[] } | { ok: false } {
  try {
    const parsed = JSON.parse(content);
    if (!parsed || typeof parsed !== 'object') {
      return { ok: false };
    }

    if (typeof parsed.toolName !== 'string' || !parsed.toolName.trim()) {
      return { ok: false };
    }

    if (!Array.isArray(parsed.input) || !parsed.input.every((item: unknown) => typeof item === 'string')) {
      return { ok: false };
    }

    return {
      ok: true,
      toolName: parsed.toolName.trim(),
      input: parsed.input,
    };
  } catch {
    const commaSeparated = parseCommaSeparatedToolCall(content);
    return commaSeparated ?? { ok: false };
  }
}

function parseCommaSeparatedToolCall(content: string): { ok: true; toolName: string; input: string[] } | null {
  const parts = content.split(/[，,]/).map((part) => part.trim());
  if (!parts.length) {
    return null;
  }

  const [toolName, ...input] = parts;
  if (!toolName || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(toolName)) {
    return null;
  }

  return {
    ok: true,
    toolName,
    input,
  };
}
