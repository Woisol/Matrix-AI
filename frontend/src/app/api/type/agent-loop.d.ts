import type { WritableSignal } from "@angular/core";

import type { Analysis, AssignData } from "./assigment";
import type { MatrixAgentConversation, MatrixAgentToolResultOutput } from "./agent";
import { MatrixAnalysisEditRequest } from "../../pages/assignment/components/code-applyable-markdown.component";

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
  updateConversationTitle: (title: string) => void;
  getEditorContent: () => string;
  /**
   * 除了返回选择内容，还返回选择的位置信息
   */
  getSelectionContent: () => string | null;
  writeEditorContent: (request: Pick<MatrixAnalysisEditRequest, 'target' | 'text' | 'range'>) => Promise<MatrixAgentToolResultOutput>;
  // writeEditorSuggestion?: (request: MatrixAnalysisEditRequest) => void;
  // getModels?: () => monaco;
  playground: (input: string, codeInfo: CodeFileInfo, language?: CodeLanguage) => Promise<string>;
  enabledTools?: AgentLoopToolName[];
};

export type ToolExecutionResult = {
  success: boolean;
  output?: MatrixAgentToolResultOutput;
};
