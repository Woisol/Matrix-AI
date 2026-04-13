import type {
  MatrixAgentEventOutput,
  MatrixAgentEventThink,
  MatrixAgentEventToolCall,
} from "../../../api/type/agent";
import { AgentLoopToolName } from "./agent-loop-tool-provider.service";

type AgentXmlTag = 'think' | 'tool_call' | 'output';

export type AgentLoopPassDisplayEvent =
  | MatrixAgentEventOutput
  | MatrixAgentEventThink
  | MatrixAgentEventToolCall;

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
  toolCalls: MatrixAgentEventToolCall[];
};
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
  const { rawText, existingToolCallIds, enabledTools, finalize, nextCallId } = args;
  const blocks: ParsedDisplayBlock[] = [];
  const toolCalls: MatrixAgentEventToolCall[] = [];
  let cursor = 0;
  let toolIndex = 0;
  let curTag: AgentXmlTag | null = null;
  let curTagStartIndex = -1;
  let curTagContentStartIndex = -1;

  while (cursor < rawText.length) {
    if (curTag === null) {
      const nextTag = findNextOpeningTag(rawText, cursor);
      if (!nextTag) {
        pushOutputBlock(blocks, rawText.slice(cursor), true);
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
      const parsedToolCall = parseToolCallPayload(tagContent, enabledTools);
      if (parsedToolCall.ok) {
        const callId = existingToolCallIds[toolIndex] ?? nextCallId();
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
        toolIndex += 1;
      } else {
        const rawBlock = rawText.slice(curTagStartIndex, closeIndex + closeTag.length);
        pushOutputBlock(blocks, rawBlock, true);
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
    toolCalls,
  };
}
/**
 * 找 /<(think|tool_call|output)>/
 */
function findNextOpeningTag(text: string, cursor: number): { tag: AgentXmlTag; index: number; openTag: string } | null {
  const match = text.slice(cursor).match(/<(think|tool_call|output)>/);
  if (!match || match.index === undefined) {
    return null;
  }

  return {
    tag: match[1] as AgentXmlTag,
    index: cursor + match.index,
    openTag: match[0],
  };
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
  enabledTools: AgentLoopToolName[],
): { ok: true; toolName: AgentLoopToolName; input: string[] } | { ok: false } {
  try {
    const parsed = JSON.parse(content);
    if (!parsed || typeof parsed !== 'object') {
      return { ok: false };
    }

    if (typeof parsed.toolName !== 'string' || !parsed.toolName.trim()) {
      return { ok: false };
    }

    const toolName = parsed.toolName as AgentLoopToolName;
    if (!enabledTools.includes(toolName)) {
      return { ok: false };
    }

    if (!Array.isArray(parsed.input) || !parsed.input.every((item: unknown) => typeof item === 'string')) {
      return { ok: false };
    }

    return {
      ok: true,
      toolName,
      input: parsed.input,
    };
  } catch {
    return { ok: false };
  }
}
