import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  CheckpointId,
  MatrixAgentEvent,
  MatrixAgentEventThink,
  MatrixAgentEventToolCall,
  MatrixAgentEventToolResult,
  MatrixAgentEventTurnEnd,
  MatrixAgentEventUserMessage,
  MatrixAgentToolResultOutput,
  MatrixAgentToolResultOutputObject,
} from "../../../../api/type/agent";
import { MarkdownModule } from "ngx-markdown";
import {
  CodeApplyableMarkdownComponent,
  MatrixAnalysisEditorRange,
  MatrixAnalysisEditRequest,
} from "../code-applyable-markdown.component";
import { NzTooltipDirective } from "ng-zorro-antd/tooltip";

export type DisplayEvent =
  | { type: 'user', sourceStartIndex: number, events: MatrixAgentEventUserMessage[] }
  | { type: 'agent', sourceStartIndex: number, events: Exclude<MatrixAgentEvent, MatrixAgentEventUserMessage>[] };

@Component({
  selector: "agent-assistant-message",
  standalone: true,
  imports: [MarkdownModule, CodeApplyableMarkdownComponent, NzTooltipDirective],
  template: `
    <div class="chat-bubble agent">
      @for (event of dEvent.events; track $index) {
        @if (event.type === 'think' && shouldRenderThinkBlock($index)) {
            <details class="think-block animated-details">
              <summary class="think-summary sticky">think</summary>
              <div class="think-content">
                @for (content of getThinkContents($index); track $index) {
                  <markdown class="markdown-patched" [data]="content"></markdown>
                }
              </div>
            </details>
        } @else if (event.type === 'tool_call') {
          @if(getToolCheckpointId(event.payload.callId)) {
            <span class="rewind-chat" (click)="rewindWriteRequest.emit(getToolCheckpointId(event.payload.callId))">回溯到这里</span>

          }
            <details class="bubble-card tool-card">
              <summary class="tool-summary">
                <div class="tool-card-header sticky">
                  <code class="tool-title no-select" nz-tooltip="{{ event.payload.toolName + '( ' + event.payload.input.join(', ') + ' )' }}"> {{event.payload.toolName}}({{ event.payload.input.join(', ') }})</code>
                  <span
                    class="tool-status no-select"
                    [class.pending]="this.toolResultsByCallId.get(event.payload.callId) === null"
                    [class.success]="this.toolResultsByCallId.get(event.payload.callId)?.payload?.success === true"
                    [class.error]="this.toolResultsByCallId.get(event.payload.callId)?.payload?.success === false"
                  >
                    {{ getToolStatusText(event.payload.callId) }}
                  </span>
                </div>
                @if (getToolResultOutput(event.payload.callId)) {
                  <pre class="tool-output">{{ getToolResultOutput(event.payload.callId) }}</pre>
                }
              </summary>
            </details>
        } @else if (event.type === 'tool_result' && this.orphanToolResultIndexes.has($index)) {
          <!-- 孤儿 tool_result 渲染 -->
          <details class="bubble-card tool-card orphan-result">
            <summary class="tool-summary">
              <div class="tool-card-header sticky">
                <code class="tool-title no-select">tool_result<span style="color: #d08585;font-size:9px;">(tool_call missing)</span></code>
                <span
                  class="tool-status no-select"
                  [class.success]="event.payload.success"
                  [class.error]="!event.payload.success"
                >
                  {{ event.payload.success ? '成功' : '失败' }}
                </span>
              </div>
              @if (event.payload.output) {
                <pre class="tool-output">{{ event.payload.output }}</pre>
              }
            </summary>
          </details>
        } @else if (event.type === 'output') {
          <!-- <markdown class="markdown-patched output" [data]="event.payload.content"></markdown> -->
           <code-applyable-markdown
            [content]="event.payload.content"
            (focusRequestRangeOnEditor)="focusRequestRangeOnEditor.emit($event)"
            (applyToEditor)="applyToEditor.emit($event)"
          />
        } @else if (event.type === 'turn_end' ) {
          <!-- && !hasAssistantOutput -->
          <p class="bubble-body system-end">
            {{ turnEndReasonMap[event.payload.reason] }}
            @if (event.payload.detail) {
              <span class="system-end-detail">：{{ event.payload.detail }}</span>
            }
          </p>
        }
      }
    </div>
  `,
  styles: [`
    .no-select{
      user-select: none;
    }

    .chat-bubble.agent {
      padding: 10px 12px;
      border-radius: 14px 14px 14px 2px;
      background: var(--color-bg);
      color: var(--color-text);
      white-space: pre-wrap;
      word-break: break-word;
      line-height: 1.6;
      margin-right: auto;
      border: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .bubble-card {
      padding: 8px 10px;
      font-size: 14px;
      border-radius: var(--size-radius-sm);
      margin: 0;
    }

    .think-block {
      color: var(--color-secondary);
      display: list-item;
      /*background: var(--color-surface);
      border: 1px dashed var(--color-border);*/
    }

    .think-summary {
      cursor: pointer;
      user-select: none;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 13px;
      color: #6b7280;
      list-style: none;
      background: var(--color-bg);
    }

    /*！ 好用！ */
    .animated-details{
      &>summary::before {
        content: '>';
        width: 16px;
        height: 16px;
        font-size: 14px;
        line-height: 16px;
        display: inline-block;
        transform: rotate(0deg);
        transform-origin: 25% 50%;
        transition: transform .2s ease;
      }

      &[open] >summary::before {
        transform: rotate(90deg);
      }
    }

    .sticky{
      position: sticky;
      top: -12px;
      z-index: 10;
    }

    .think-content {
      margin-top: 6px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    p {
      margin: 0;
    }

    /* 害依然要重新定制另一份 animated-details……*/
    .tool-card{
      .tool-card-header::before {
        flex-shrink: 0;
        content: '>';
        width: 16px;
        height: 16px;
        font-size: 14px;
        line-height: 16px;
        display: inline-block;
        transform: rotate(0deg);
        /* 又要微调…… */
        transform-origin: 30% 50%;
        transition: transform .2s ease;
      }

      &[open] .tool-card-header::before {
        transform: rotate(90deg);
      }
    }

    .tool-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .tool-card-header {
      /*width: 100%;*/
      flex:1;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: nowrap;
      background: var(--color-surface);
    }

    .tool-summary {
      cursor: pointer;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .tool-title {
      min-width: 0;
      flex: 1 1 auto;
      overflow: hidden;
      font-size: 13px;
      color: #1f2937;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .tool-status {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-size: 12px;
      line-height: 1.4;
    }

    .tool-status::after {
      content: '';
      width: 4px;
      height: 4px;
      border-radius: 999px;
      background: currentColor;
      flex: 0 0 auto;
    }

    .tool-card.orphan-result {
      border-color: #d08585;
    }

    .tool-status.pending {
      color: #ad6800;
    }

    .tool-status.success {
      color: rgb(51, 117, 28);
    }

    .tool-status.error {
      color: #cf1322;
    }

    .tool-output {
      margin: 0;
      padding: 8px 10px;
      border-radius: var(--size-radius-sm);
      background: var(--color-bg);
      color: #334155;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.5;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .tool-card:not([open]) .tool-output {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .output {
      background: #ffffff;
    }

    .rewind-write{
      opacity: 0;
      width: 5.5rem;
      color: var(--color-secondary);
      transition: color .2s ease,
       opacity .2s ease;
      &::before{
        content: "";
        display: inline-block;
        width: calc(50% - 2.75rem);
        height: 0;
        border-top: 1px solid var(--color-border);
        margin-right: 0.5rem;
        vertical-align: middle;
      }
      &::after{
        content: "";
        display: inline-block;
        width: calc(50% - 2.75rem);
        height: 0;
        border-top: 1px solid var(--color-border);
        margin-left: 0.5rem;
        vertical-align: middle;
      }
      &:hover {
        cursor: pointer;
        opacity: 1;
      }
    }


    .system-end {
      color: var(--color-secondary);
      border: 1px dashed #cbd5e1;
      border-radius: var(--size-radius-sm);
      font-size: 13px;
      text-align: center;
    }
    .system-end-detail{
      color: #94a3b8;
    }
  `],
})
export class AgentAssistantMessageComponent {
  private _dEvent!: Extract<DisplayEvent, { type: 'agent' }>;
  // 小关键，通过 callId 将 tool_result 事件合并回对应的 tool_call 卡片中，如果没有找到对应的 tool_call 则标记为孤儿结果，单独渲染在卡片外
  // 设为非 private 来在组件中访问
  toolResultsByCallId = new Map<string, MatrixAgentEventToolResult>();
  orphanToolResultIndexes = new Set<number>();
  hasAssistantOutput = false;

  turnEndReasonMap: Record<MatrixAgentEventTurnEnd['payload']['reason'], string> = {
    completed: '本轮对话已完成。',
    aborted: '对话被用户终止',
    page_unload: '对话由于标签页切换被终止',
    max_turn_limit_reached: '由于超过单轮最大对话数被终止',
    tool_retry_limit_reached: '由于工具调用失败次数过多被终止',
    client_error: '由于客户端错误被终止',
    server_error: '由于服务端错误被终止',
  }

  // 😨Input 还能设 get set
  @Input()
  set dEvent(value: Extract<DisplayEvent, { type: 'agent' }>) {
    this._dEvent = value;
    this.rebuildDerivedState(value?.events ?? []);
  }

  get dEvent(): Extract<DisplayEvent, { type: 'agent' }> {
    return this._dEvent;
  }

  @Output() applyToEditor = new EventEmitter<MatrixAnalysisEditRequest>();
  @Output() focusRequestRangeOnEditor = new EventEmitter<MatrixAnalysisEditorRange>();
  @Output() rewindWriteRequest = new EventEmitter<string | undefined>();

  // 判断 think 事件是否连续，如果有则只在第一个 think 事件上渲染 think 块，后续的 think 事件内容会合并到同一个 think 块中
  shouldRenderThinkBlock(index: number): boolean {
    const event = this.dEvent.events[index];
    if (event?.type !== 'think') return false;
    return index === 0 || this.dEvent.events[index - 1]?.type !== 'think';
  }

  // 获取从 index 开始的连续合并 think 块
  getThinkContents(index: number): string[] {
    const contents: string[] = [];
    for (let cursor = index; cursor < this.dEvent.events.length; cursor += 1) {
      const currentEvent = this.dEvent.events[cursor];
      if (currentEvent.type !== 'think') break;
      contents.push(currentEvent.payload.content);
    }
    return contents;
  }

  //** tool 卡片工具函数
  // getToolResultForCall(callId: string): MatrixAgentEventToolResult | null {
  //   return this.toolResultsByCallId.get(callId) ?? null;
  // }

  getToolResultOutput(callId: string): string {
    return String(this.toolResultsByCallId.get(callId)?.payload.output) ?? '';
  }

  getToolStatusText(callId: string): string {
    const result = this.toolResultsByCallId.get(callId);
    if (!result) return '执行中';
    return result.payload.success ? '成功' : '失败';
  }

  getToolCheckpointId(callId: string): CheckpointId | undefined {
    return (this.toolResultsByCallId.get(callId)?.payload.output as MatrixAgentToolResultOutputObject)?.checkpointId;
  }

  // 主要更新 tool 结果的映射 和 hasAssistantOutput
  private rebuildDerivedState(events: Exclude<MatrixAgentEvent, MatrixAgentEventUserMessage>[]): void {
    this.toolResultsByCallId = new Map<string, MatrixAgentEventToolResult>();
    this.orphanToolResultIndexes = new Set<number>();
    this.hasAssistantOutput = events.some((event) => event.type === 'output');

    const seenToolCallIds = new Set<string>();
    events.forEach((event, index) => {
      if (event.type === 'tool_call') {
        seenToolCallIds.add(event.payload.callId);
        return;
      }

      if (event.type !== 'tool_result') return;

      if (seenToolCallIds.has(event.payload.callId) && !this.toolResultsByCallId.has(event.payload.callId)) {
        this.toolResultsByCallId.set(event.payload.callId, event);
        return;
      }

      this.orphanToolResultIndexes.add(index);
    });
  }


}

@Component({
  selector: "agent-chat-bubble",
  imports: [AgentAssistantMessageComponent],
  standalone: true,
  template: `
    @if (dEvent.type === 'user') {
      <span class="rewind-chat" (click)="rewindConversationRequest.emit(dEvent.sourceStartIndex)">回溯到这里</span>
      @for (event of dEvent.events; track $index) {
        <div class="chat-bubble user">
          <div class="bubble-body">{{ event.payload.content }}</div>
        </div>
      }
    } @else {
      <agent-assistant-message
        [dEvent]="dEvent"
        (focusRequestRangeOnEditor)="focusRequestRangeOnEditor.emit($event)"
        (applyToEditor)="applyToEditor.emit($event)"
        (rewindWriteRequest)="rewindWriteRequest.emit($event)"
      ></agent-assistant-message>
    }
  `,
  styles: [`
    .chat-bubble.user {
      padding: 10px 12px;
      border-radius: 14px 14px 2px 14px;
      background: var(--color-primary-light);
      margin-left: auto;
      color: var(--color-text);
      white-space: pre-wrap;
      word-break: break-word;
      line-height: 1.6;
      margin-right: 0;
      border: 1px solid var(--color-border);
    }

    .bubble-body {
      font-size: 14px;
    }

    .rewind-chat{
      opacity: 0;
      width: 5.5rem;
      color: var(--color-secondary);
      transition: color .2s ease,
       opacity .2s ease;
      &::before{
        content: "";
        display: inline-block;
        width: calc(50% - 2.75rem);
        height: 0;
        border-top: 1px solid var(--color-border);
        margin-right: 0.5rem;
        vertical-align: middle;
      }
      &::after{
        content: "";
        display: inline-block;
        width: calc(50% - 2.75rem);
        height: 0;
        border-top: 1px solid var(--color-border);
        margin-left: 0.5rem;
        vertical-align: middle;
      }
      &:hover {
        cursor: pointer;
        opacity: 1;
      }
    }
  `],
})
export class AgentChatBubbleComponent {
  @Input() dEvent!: DisplayEvent;
  @Output() applyToEditor = new EventEmitter<MatrixAnalysisEditRequest>();
  @Output() focusRequestRangeOnEditor = new EventEmitter<MatrixAnalysisEditorRange>();
  @Output() rewindConversationRequest = new EventEmitter<number>();
  @Output() rewindWriteRequest = new EventEmitter<CheckpointId | undefined>();
}
