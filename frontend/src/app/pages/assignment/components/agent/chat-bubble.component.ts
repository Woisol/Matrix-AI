import { Component, Input } from "@angular/core";
import { MatrixAgentEvent, MatrixAgentEventUserMessage } from "../../../../api/type/agent";

export type DisplayEvent = { type: 'user', events: MatrixAgentEventUserMessage[] } | { type: 'agent', events: Exclude<MatrixAgentEvent, MatrixAgentEventUserMessage>[] };


@Component({
  selector: "agent-assistant-message",
  standalone: true,
  template: `
    <div class="chat-bubble agent">
      @for(event of dEvent.events; track $index){
        @switch (event.type){
          @case ('think') {
            <p class="bubble-body">{{ event.payload.content }}</p>
          }
          @case ('tool_call') {
            <p class="bubble-body">{{ event.payload.toolName }}({{ event.payload.input.join(', ') }})</p>
          }
          @case ('tool_result') {
            <p class="bubble-body">{{ event.payload.output }}</p>
          }
          @case ('assistant_final') {
            <p class="bubble-body">{{ event.payload.content }}</p>
          }
        }
      }
    </div>
  `,
  styles: [`
    `],
})
export class AgentAssistantMessageComponent {
  @Input() dEvent!: DisplayEvent;
}
@Component({
  selector: "agent-chat-bubble",
  imports: [AgentAssistantMessageComponent],
  standalone: true,
  template: `
    @if(dEvent.type === 'user'){
      @for(event of dEvent.events; track $index){
      <div class="chat-bubble user" >
        <div class="bubble-body">{{ event.payload.content }}</div>
      </div>
      }
    }@else{
      <agent-assistant-message [dEvent]="dEvent"></agent-assistant-message>
    }
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
  @Input() dEvent!: DisplayEvent;

}
