import type { WritableSignal } from "@angular/core";

import type { Analysis, AssignData } from "./assigment";
import type { MatrixAgentConversation } from "./agent";

export type AgentLoopToolName =
  | 'read_editor'
  | 'read_selection'
  | 'read_problem_info'
  | 'read_problem_answer';

export type AgentLoopMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_call_id?: string;
};

export type AgentLoopRunConfig = {
  courseId: string;
  assignId: string;
  userId: string;
  userMessageContent: string;
  conversationSignal: WritableSignal<MatrixAgentConversation | null | undefined>;
  assignData?: AssignData | undefined;
  analysis?: Analysis | undefined;
  getEditorContent: () => string;
  getSelectionContent: () => string | null;
  enabledTools?: AgentLoopToolName[];
};

export type ToolExecutionResult = {
  success: boolean;
  output: string;
};
