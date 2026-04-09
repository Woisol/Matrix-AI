import { Component, Input } from "@angular/core";
import { MatrixAgentEvent } from "../../../../api/type/agent";


@Component({
  selector: "agent-assistant-message",
  standalone: true,
  template: `
    @switch (event.type){
      @case ('think') {
        <div class="bubble-title">思考</div>
        <div class="bubble-body">{{ event.payload.content }}</div>
      }
      @case ('tool_call') {
        <div class="bubble-title">调用工具</div>
        <div class="bubble-body">{{ event.payload.toolName }}({{ event.payload.input.join(', ') }})</div>
      }
      @case ('tool_result') {
        <div class="bubble-title">工具结果</div>
        <div class="bubble-body">{{ event.payload.output }}</div>
      }
      @case ('assistant_final') {
        <div class="bubble-body">{{ event.payload.content }}</div>
      }
      @case ('turn_end') {
        <div class="bubble-title">本轮结束</div>
        <div class="bubble-body">{{ event.payload.reason }}</div>
      }
    }
  `,
  styles: [`
    `],
})
export class AgentAssistantMessageComponent {
  @Input() event!: MatrixAgentEvent;
}
@Component({
  selector: "agent-chat-bubble",
  imports: [AgentAssistantMessageComponent],
  standalone: true,
  template: `
      <div class="chat-bubble" [class.user]="event.type === 'user_message'" [class.assistant]="event.type !== 'user_message'" [class.think]="event.type === 'think'" [class.tool]="event.type === 'tool_call' || event.type === 'tool_result'" [class.final]="event.type === 'assistant_final'" [class.end]="event.type === 'turn_end'">
          @if (event.type === 'user_message') {
            <div class="bubble-body">{{ event.payload.content }}</div>
          }
          @else {
            <agent-assistant-message [event]="event"></agent-assistant-message>
          }
      </div>
    `,
  styles: [`
      .chat-bubble{
        max-width: min(80%, 680px);
        padding: 10px 12px;
        border-radius: 14px 14px 14px 4px;
        background: #f7f8fa;
        color: #262626;
        white-space: pre-wrap;
        word-break: break-word;
        line-height: 1.6;
        margin-right: auto;
        border: 1px solid #ececec;
      }

      .chat-bubble.user{
        max-width: min(80%, 640px);
        border-radius: 14px 14px 4px 14px;
        background: var(--color-primary-light);
        margin-left: auto;
        margin-right: 0;
      }

      .bubble-title{
        margin-bottom: 4px;
        font-size: 12px;
        color: #8c8c8c;
        font-weight: 600;
      }

      .bubble-body{
        font-size: 14px;
      }

      .think{
        background: #fafafa;
        border-style: dashed;
      }

      .tool{
        background: #f0f5ff;
      }

      .final{
        background: #ffffff;
      }

      .end{
        opacity: 0.85;
      }
    `],
})
export class AgentChatBubbleComponent {
  @Input() event!: MatrixAgentEvent;

}
