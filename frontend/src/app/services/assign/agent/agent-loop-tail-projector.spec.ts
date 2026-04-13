import { projectAgentLoopPassTail } from './agent-loop-tail-projector';
import type { MatrixAgentConversation } from '../../../api/type/agent';

describe('projectAgentLoopPassTail', () => {
  it('replaces only the pass tail and keeps the conversation head intact', () => {
    const conversation: MatrixAgentConversation = {
      conversationId: 'conv-1',
      title: 'Split runtime',
      createdAt: '2026-04-13T00:00:00Z',
      updatedAt: '2026-04-13T00:00:00Z',
      events: [
        { type: 'user_message', payload: { content: 'hello' } },
        { type: 'output', payload: { content: 'old draft' } },
      ],
    };

    const nextConversation = projectAgentLoopPassTail(conversation, 1, [
      { type: 'output', payload: { content: 'plain' } },
      { type: 'think', payload: { content: 'draft' } },
    ]);

    expect(nextConversation.events).toEqual([
      { type: 'user_message', payload: { content: 'hello' } },
      { type: 'output', payload: { content: 'plain' } },
      { type: 'think', payload: { content: 'draft' } },
    ]);
    expect(nextConversation.updatedAt).not.toBe(conversation.updatedAt);
  });
});
