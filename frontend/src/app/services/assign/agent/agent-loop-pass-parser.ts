import type {
  MatrixAgentEventOutput,
  MatrixAgentEventThink,
  MatrixAgentEventToolCall,
  MatrixAgentEventToolResult,
} from "../../../api/type/agent";
import type { AgentLoopToolName } from "./agent-loop-tool-provider.service";
import { BusinessEvent, SxmlEvent, SxmlParser, SxmlResult, TextEvent } from "@woisol-g/sxml.js";

export type AgentLoopPassDisplayEvent =
  | MatrixAgentEventOutput
  | MatrixAgentEventThink
  | MatrixAgentEventToolCall
  | MatrixAgentEventToolResult;

export type AgentLoopPassSnapshot = {
  displayEvents: AgentLoopPassDisplayEvent[];
  stableCount: number;
  toolBlockIds: string[];
  toolCalls: MatrixAgentEventToolCall[];
  toolErrors: MatrixAgentEventToolResult[];
};

const INVALID_TOOL_CALL_MESSAGE =
  'Invalid tool_call payload. Use JSON {"toolName":"...","input":["..."]} or comma-separated "toolName, arg1, arg2".';

export class AgentLoopSxmlPassParser {
  private readonly parser = new SxmlParser({
    legalTags: [
      { name: 'think', confirmAt: 'open' },
      'tool_call',
      { name: 'output', confirmAt: 'open' },
    ],
  });

  private readonly displayEvents: AgentLoopPassDisplayEvent[] = [];
  private readonly toolBlockIds: string[];
  private nextToolIndex = 0;

  constructor(private readonly args: {
    existingToolCallIds: string[];
    enabledTools: AgentLoopToolName[];
    nextCallId: () => string;
  }) {
    this.toolBlockIds = [...args.existingToolCallIds];
  }

  write(chunk: string): AgentLoopPassSnapshot {
    if (!chunk || this.parser.isEnd) {
      return this.snapshot(false);
    }

    this.parser.write(chunk);
    this.drainResults();
    return this.snapshot(false);
  }

  finalize(): AgentLoopPassSnapshot {
    if (!this.parser.isEnd) {
      this.parser.end();
    }

    this.drainResults();
    return this.snapshot(true);
  }

  snapshotDraft(): AgentLoopPassSnapshot {
    return this.snapshot(false);
  }

  /**
   * sxml 主接入口
   */
  private drainResults(): void {
    let result: SxmlResult | null;
    while ((result = this.parser.tryPull()) !== null) {
      this.applyResult(result);
    }
  }

  private applyResult(result: SxmlResult): void {
    const update = result.update;
    if (update !== undefined) {
      this.replaceLastEvent(update);
    }

    for (const event of result.append) {
      this.appendEvent(event);
    }
  }

  private replaceLastEvent(event: SxmlEvent | null): void {
    if (event === null) {
      this.displayEvents.pop();
      return;
    }

    if (!this.displayEvents.length) {
      this.appendEvent(event);
      return;
    }

    const previous = this.displayEvents.at(-1)!;
    const displayEvent = this.toDisplayEvent(event, getCallId(previous));
    this.displayEvents[this.displayEvents.length - 1] = displayEvent;
  }

  private appendEvent(event: SxmlEvent): void {
    const displayEvent = this.toDisplayEvent(event);
    if (!isEmptyOutput(displayEvent)) {
      this.displayEvents.push(displayEvent);
    }
  }

  /**
   * 转义为 displayEvent 提供前端展示
   */
  private toDisplayEvent(event: SxmlEvent, existingCallId?: string): AgentLoopPassDisplayEvent {
    if (event.type === 'text') {
      return toOutputEvent((event as TextEvent).content);
    }

    const content = getBusinessEventContent(event as BusinessEvent);
    if (event.type === 'output') {
      return toOutputEvent(content);
    }

    if (event.type === 'think') {
      return {
        type: 'think',
        payload: { content },
      };
    }

    if (event.type === 'tool_call') {
      const callId = existingCallId ?? this.nextToolCallId();
      const parsedToolCall = parseToolCallPayload(content);
      if (parsedToolCall.ok) {
        return {
          type: 'tool_call',
          payload: {
            callId,
            toolName: parsedToolCall.toolName,
            input: parsedToolCall.input,
          },
        };
      }

      return {
        type: 'tool_result',
        payload: {
          callId,
          success: false,
          output: INVALID_TOOL_CALL_MESSAGE,
        },
      };
    }

    return toOutputEvent(content);
  }

  private snapshot(finalize: boolean): AgentLoopPassSnapshot {
    const isComplete = finalize || this.parser.isEnd;
    const stableCount = isComplete || this.parser.lastConfirm
      ? this.displayEvents.length
      : Math.max(0, this.displayEvents.length - 1);

    return {
      displayEvents: [...this.displayEvents],
      stableCount,
      toolBlockIds: [...this.toolBlockIds],
      toolCalls: this.displayEvents.filter((event): event is MatrixAgentEventToolCall => event.type === 'tool_call'),
      toolErrors: this.displayEvents.filter((event): event is MatrixAgentEventToolResult => event.type === 'tool_result'),
    };
  }

  private nextToolCallId(): string {
    const callId = this.toolBlockIds[this.nextToolIndex] ?? this.args.nextCallId();
    if (this.nextToolIndex >= this.toolBlockIds.length) {
      this.toolBlockIds.push(callId);
    }
    this.nextToolIndex += 1;
    return callId;
  }
}

export function parseAgentLoopPass(args: {
  rawText: string;
  existingToolCallIds: string[];
  enabledTools: AgentLoopToolName[];
  finalize: boolean;
  nextCallId: () => string;
}): AgentLoopPassSnapshot {
  const parser = new AgentLoopSxmlPassParser({
    existingToolCallIds: args.existingToolCallIds,
    enabledTools: args.enabledTools,
    nextCallId: args.nextCallId,
  });

  parser.write(args.rawText);
  return args.finalize ? parser.finalize() : parser.snapshotDraft();
}

function toOutputEvent(content: string): MatrixAgentEventOutput {
  return {
    type: 'output',
    payload: { content },
  };
}

function getBusinessEventContent(event: BusinessEvent): string {
  return typeof event['content'] === 'string' ? event['content'] : '';
}

function getCallId(event: AgentLoopPassDisplayEvent): string | undefined {
  if (event.type === 'tool_call' || event.type === 'tool_result') {
    return event.payload.callId;
  }
  return undefined;
}

function isEmptyOutput(event: AgentLoopPassDisplayEvent): boolean {
  return event.type === 'output' && event.payload.content === '';
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
  const parts = content.split(/[,\uFF0C]/).map((part) => part.trim());
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
