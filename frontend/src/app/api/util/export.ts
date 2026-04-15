import { MatrixAgentEvent } from "../type/agent";

export function buildConversationExportText(events: MatrixAgentEvent[]): string {
  const sections: string[] = [];
  let agentBuffer = '';

  const flushAgentBuffer = () => {
    const content = agentBuffer.trim();
    if (!content) {
      agentBuffer = '';
      return;
    }
    sections.push(`Matrix Agent:\n${content}`);
    agentBuffer = '';
  };

  events.forEach((event) => {
    if (event.type === 'user_message') {
      flushAgentBuffer();
      sections.push(`User:\n${String(event.payload.content ?? '')}`);
      return;
    }

    if (event.type === 'think') {
      agentBuffer += `<think>${String(event.payload.content ?? '')}</think>`;
      return;
    }

    if (event.type === 'output') {
      agentBuffer += String(event.payload.content ?? '');
      return;
    }

    if (event.type === 'tool_call') {
      const toolName = String(event.payload.toolName ?? '').trim();
      const input = Array.isArray(event.payload.input) ? event.payload.input : [];
      const renderedCall = `${toolName}(${input.map((item) => String(item)).join(',')})`;
      agentBuffer += `<tool_call>${renderedCall}</tool_call>`;
      return;
    }

    if (event.type === 'tool_result') {
      agentBuffer += `<tool_result>${String(event.payload.output ?? '')}</tool_result>`;
    }
  });

  flushAgentBuffer();
  return sections.join('\n\n').trim();
}
