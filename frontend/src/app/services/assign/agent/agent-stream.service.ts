import { Injectable, inject } from "@angular/core";

import { AssignId, CourseId } from "../../../api/type/general";
import { NotificationService } from "../../notification/notification.service";
import { AgentLoopMessage } from "../../../api/type/agent-loop";

export type AgentByokConfig = {
  baseUrl: string;
  apiKey: string;
  model?: string; // Made optional for backward compatibility
}

@Injectable({ providedIn: 'root' })
export class AgentStreamService {
  private readonly BYOK_STORAGE_KEY = "MAGENT_BYOK_CONFIG";
  private readonly BYOK_NOTICE_STORAGE_KEY = "MAGENT_BYOK_NOTICE_SHOWN";
  private readonly BYOK_DEFAULT_MODEL = "gpt-5.3-codex";

  notify = inject(NotificationService);

  saveByokConfig(config: AgentByokConfig): boolean {
    const normalized = this.normalizeByokConfig(config);
    if (!normalized) {
      return false;
    }

    this.setSessionValue(this.BYOK_STORAGE_KEY, JSON.stringify(normalized));
    this.removeSessionValue(this.BYOK_NOTICE_STORAGE_KEY);
    return true;
  }

  getByokConfig(): AgentByokConfig {
    const raw = this.getSessionValue(this.BYOK_STORAGE_KEY);
    if (!raw) {
      return { baseUrl: '', apiKey: '', model: this.BYOK_DEFAULT_MODEL };
    }

    try {
      const parsed = JSON.parse(raw) as Partial<AgentByokConfig>;
      return this.normalizeByokConfig(parsed) ?? { baseUrl: '', apiKey: '', model: this.BYOK_DEFAULT_MODEL };
    } catch {
      this.removeSessionValue(this.BYOK_STORAGE_KEY);
      return { baseUrl: '', apiKey: '', model: this.BYOK_DEFAULT_MODEL };
    }
  }

  clearByokConfig(): void {
    this.removeSessionValue(this.BYOK_STORAGE_KEY);
    this.removeSessionValue(this.BYOK_NOTICE_STORAGE_KEY);
  }

  async *streamMessages(courseId: CourseId, assignId: AssignId, userId: string, messages: AgentLoopMessage[]): AsyncGenerator<string, void, void> {
    const byokConfig = this.getByokConfig();
    if (!byokConfig.baseUrl || !byokConfig.apiKey || !byokConfig.model) {
      yield* this.streamMessagesViaMatrix(courseId, assignId, userId, messages);
      return;
    }

    if (!this.hasShownByokFirstUseNotice()) {
      const requestUrl = this.resolveByokChatCompletionsUrl(byokConfig.baseUrl);
      this.notify.info(
        `已启用 BYOK 直连。\nURL: ${requestUrl}\nKey: ${this.maskApiKey(byokConfig.apiKey)}`,
        '使用自定义模型',
        { nzDuration: 5000 },
      );
      this.markByokFirstUseNoticeShown();
    }

    yield* this.streamMessagesViaByok(byokConfig, messages);
  }

  //** 工具函数
  private normalizeByokConfig(config: Partial<AgentByokConfig> | null | undefined): AgentByokConfig | null {
    if (!config) {
      return null;
    }

    const baseUrl = (config.baseUrl ?? '').trim();
    const apiKey = (config.apiKey ?? '').trim();
    const model = (config.model ?? this.BYOK_DEFAULT_MODEL).trim() || this.BYOK_DEFAULT_MODEL;
    if (!baseUrl || !apiKey) {
      return null;
    }

    return {
      baseUrl: baseUrl.replace(/\/+$/, ''),
      apiKey,
      model,
    };
  }

  private getSessionValue(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private setSessionValue(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // Ignore sessionStorage write failures.
    }
  }

  private removeSessionValue(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // Ignore sessionStorage remove failures.
    }
  }

  private hasShownByokFirstUseNotice(): boolean {
    return this.getSessionValue(this.BYOK_NOTICE_STORAGE_KEY) === '1';
  }

  private markByokFirstUseNoticeShown(): void {
    this.setSessionValue(this.BYOK_NOTICE_STORAGE_KEY, '1');
  }

  private maskApiKey(apiKey: string): string {
    if (apiKey.length <= 10) {
      return `${apiKey.slice(0, 2)}***${apiKey.slice(-2)}`;
    }
    return `${apiKey.slice(0, 6)}***${apiKey.slice(-4)}`;
  }

  private resolveByokChatCompletionsUrl(baseUrl: string): string {
    const normalized = baseUrl.replace(/\/+$/, '');
    if (normalized.endsWith('/chat/completions')) {
      return normalized;
    }
    if (normalized.endsWith('/v1')) {
      return `${normalized}/chat/completions`;
    }
    return `${normalized}/v1/chat/completions`;
  }

  //** 两个实际请求实现
  private async *streamMessagesViaMatrix(
    courseId: CourseId,
    assignId: AssignId,
    userId: string,
    messages: AgentLoopMessage[],
  ): AsyncGenerator<string, void, void> {
    const response = await fetch(`/api/courses/${courseId}/assignments/${assignId}/agent/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        user_id: userId,
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Model stream request failed with status ${response.status}.`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      if (text) {
        yield text;
      }
    }

    const rest = decoder.decode();
    if (rest) {
      yield rest;
    }
  }

  private async *streamMessagesViaByok(
    config: AgentByokConfig,
    messages: AgentLoopMessage[],
  ): AsyncGenerator<string, void, void> {
    const requestUrl = this.resolveByokChatCompletionsUrl(config.baseUrl);
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        model: config.model ?? this.BYOK_DEFAULT_MODEL, // Use the model from config or default
        stream: true,
        messages,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`BYOK stream request failed with status ${response.status}.`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let sseMode: boolean | null = null;
    let lineBuffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      if (!text) {
        continue;
      }

      if (sseMode === null) {
        sseMode = text.includes('data:');
      }

      if (!sseMode) {
        yield text;
        continue;
      }

      lineBuffer += text;
      const lines = lineBuffer.split('\n');
      lineBuffer = lines.pop() ?? '';

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || !line.startsWith('data:')) {
          continue;
        }

        const data = line.slice(5).trim();
        if (!data) {
          continue;
        }
        if (data === '[DONE]') {
          return;
        }

        try {
          const parsed = JSON.parse(data) as {
            choices?: Array<{
              delta?: {
                content?: string | Array<{ type?: string; text?: string }>;
              };
            }>;
          };

          const content = parsed.choices?.[0]?.delta?.content;
          if (typeof content === 'string' && content.length > 0) {
            yield content;
            continue;
          }
          if (Array.isArray(content)) {
            const joined = content
              .filter((part) => part?.type === 'text' && typeof part.text === 'string')
              .map((part) => part.text)
              .join('');
            if (joined) {
              yield joined;
            }
          }
        } catch {
          // Ignore non-JSON lines in SSE stream.
        }
      }
    }

    const rest = decoder.decode();
    if (!rest) {
      return;
    }

    if (sseMode) {
      lineBuffer += rest;
      const line = lineBuffer.trim();
      if (!line || !line.startsWith('data:')) {
        return;
      }
      const data = line.slice(5).trim();
      if (!data || data === '[DONE]') {
        return;
      }
      try {
        const parsed = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) {
          yield content;
        }
      } catch {
        // Ignore malformed trailing chunk.
      }
      return;
    }

    yield rest;
  }
}
