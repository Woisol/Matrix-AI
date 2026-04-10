import { inject, Injectable } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { catchError, map, Observable, of, OperatorFunction } from "rxjs";

import { AssignId, CourseId } from "../../api/type/general";
import {
  MatrixAgentAppendEventsRequest,
  MatrixAgentConversation,
  MatrixAgentConversationSummary,
  MatrixAgentEvent,
  MatrixAgentOperationResponse,
} from "../../api/type/agent";
import { ApiHttpService } from "../../api/util/api-http.service";
import { NotificationService } from "../notification/notification.service";
import { SSEService } from "../see/see.service";

// 行吧，所以意思是传过来的原始数据类型建议直接放同文件毕竟只用一次
type RawMatrixAgentConversationSummary = {
  conversation_id: string
  title: string
  created_at: string
  updated_at: string
}

type RawMatrixAgentConversation = RawMatrixAgentConversationSummary & {
  events: MatrixAgentEvent[]
}

@Injectable({ providedIn: 'root' })
export class AgentService {
  constructor(private api: ApiHttpService) { }

  notify = inject(NotificationService)
  sse = inject(SSEService)

  private buildUserParams(userId?: string) {
    return userId ? { headers: { user_id: userId } } : undefined;
  }

  // 两个 Map 函数
  private mapConversationSummary(rawMatrixAgentConversationSummary: RawMatrixAgentConversationSummary): MatrixAgentConversationSummary {
    return {
      conversationId: rawMatrixAgentConversationSummary.conversation_id,
      title: rawMatrixAgentConversationSummary.title,
      createdAt: rawMatrixAgentConversationSummary.created_at,
      updatedAt: rawMatrixAgentConversationSummary.updated_at,
    };
  }
  private mapConversation(rawMatrixAgentConversation: RawMatrixAgentConversation): MatrixAgentConversation {
    return {
      ...this.mapConversationSummary(rawMatrixAgentConversation),
      events: rawMatrixAgentConversation.events,
    };
  }

  // private toAppendEventsPayload(request: MatrixAgentAppendEventsRequest) {
  //   return {
  //     conversation_id: request.conversationId,
  //     expected_event_count: request.expectedEventCount,
  //     events: request.events,
  //   };
  // }

  // 哈哈
  private handleAgentError<T>(prefix: string): OperatorFunction<T, T | undefined> {
    return catchError((e: { status?: number, message?: string }) => {
      const msg = `${prefix}: ${e?.status === 500 ? "服务器连接异常，请确认服务器状态。" : (e?.message ?? "未知错误")}`;
      this.notify.error(msg);
      return of(undefined as T | undefined);
    });
  }

  listConversations$(courseId: CourseId, assignId: AssignId, userId?: string): Observable<MatrixAgentConversationSummary[] | undefined> {
    return this.api.get$<RawMatrixAgentConversationSummary[]>(
      `/courses/${courseId}/assignments/${assignId}/agent/conversations`,
      this.buildUserParams(userId),
    ).pipe(
      map((conversations) => conversations.map((conversation) => this.mapConversationSummary(conversation))),
      this.handleAgentError<MatrixAgentConversationSummary[]>('无法获取对话历史'),
    );
  }

  createConversation$(courseId: CourseId, assignId: AssignId, userId?: string): Observable<MatrixAgentConversation | undefined> {
    return this.api.post$<RawMatrixAgentConversation>(
      `/courses/${courseId}/assignments/${assignId}/agent/conversations`,
      null,
      this.buildUserParams(userId),
    ).pipe(
      map((conversation) => this.mapConversation(conversation)),
      this.handleAgentError<MatrixAgentConversation>('无法创建对话'),
    );
  }

  getConversation$(courseId: CourseId, assignId: AssignId, conversationId: string, userId?: string): Observable<MatrixAgentConversation | undefined> {
    return this.api.get$<RawMatrixAgentConversation>(
      `/courses/${courseId}/assignments/${assignId}/agent/conversations/${conversationId}`,
      this.buildUserParams(userId),
    ).pipe(
      map((conversation) => this.mapConversation(conversation)),
      this.handleAgentError<MatrixAgentConversation>('无法获取对话详情'),
    );
  }

  updateConversationTitle$(courseId: CourseId, assignId: AssignId, conversationId: string, userId: string | undefined, title: string): Observable<number | undefined> {
    return this.api.patch$<HttpResponse<unknown>>(
      `/courses/${courseId}/assignments/${assignId}/agent/conversations/${conversationId}/title`,
      { title },
      { ...this.buildUserParams(userId), observe: 'response' },
    ).pipe(
      map((response) => response.status),
      this.handleAgentError<number>('无法更新对话标题'),
    );
  }

  deleteConversation$(courseId: CourseId, assignId: AssignId, conversationId: string, userId?: string): Observable<number | undefined> {
    return this.api.delete$<HttpResponse<unknown>>(
      `/courses/${courseId}/assignments/${assignId}/agent/conversations/${conversationId}`,
      { ...this.buildUserParams(userId), observe: 'response' },
    ).pipe(
      map((response) => response.status),
      this.handleAgentError<number>('无法删除对话'),
    );
  }

  appendEvents$(courseId: CourseId, assignId: AssignId, userId: string | undefined, request: MatrixAgentAppendEventsRequest): Observable<number | undefined> {
    return this.api.post$<HttpResponse<MatrixAgentOperationResponse>>(
      `/courses/${courseId}/assignments/${assignId}/agent/event`,
      {
        conversation_id: request.conversationId,
        expected_event_count: request.expectedEventCount,
        events: request.events,
      },
      { ...this.buildUserParams(userId), observe: 'response' },
    ).pipe(
      map((response) => response.status),
      this.handleAgentError<number>('无法追加对话事件'),
    );
  }

  streamConversation$(courseId: CourseId, assignId: AssignId, conversationId: string, userId: string): Observable<string> {
    const encodedUserId = encodeURIComponent(userId);
    return this.sse.streamText(
      `/api/courses/${courseId}/assignments/${assignId}/agent/conversations/${conversationId}/stream?user_id=${encodedUserId}`,
    );
  }
}
