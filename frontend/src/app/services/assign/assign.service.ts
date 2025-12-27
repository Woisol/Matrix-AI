import { inject, Injectable } from "@angular/core";
import { ApiHttpService } from "../../api/util/api-http.service";
import { AssignId, CourseId } from "../../api/type/general";
import { AiGenAnalysis, AssignData, AssignDataAdmin, BasicAnalysis, CodeFileInfo, CodeLanguage } from "../../api/type/assigment";
import { catchError, map, Observable, of } from "rxjs";
import { NotificationService } from "../notification/notification.service";
import { HttpErrorResponse } from "@angular/common/http";
import { SSEService, SSEStreamResult } from "../see/see.service";
import { MatrixAnalysisProps } from "../../pages/assignment/components/matrix-analyse.component";

@Injectable({ providedIn: 'root' })
export class AssignService {
  constructor(private api: ApiHttpService) { }
  notify = inject(NotificationService)
  sse = inject(SSEService)

  // @todo 将错误返回值改回 []
  getAssignData$(courseId: CourseId, assigId: AssignId) {
    return this.api.get$<AssignData>(`/courses/${courseId}/assignments/${assigId}`).pipe(
      catchError((e: HttpErrorResponse) => {
        let msg = '无法获取作业数据: ' + (e.status === 500 ? "服务器连接异常，请确认服务器状态。" : e.message)
        this.notify.error(msg)
        return of(undefined)
      })
    );
  }

  getAssignDataAdmin$(assignId: AssignId) {
    return this.api.get$<AssignDataAdmin>(`/admin/assignments/${assignId}`).pipe(
      catchError((e: HttpErrorResponse) => {
        let msg = '无法获取作业管理数据: ' + (e.status === 500 ? "服务器连接异常，请确认服务器状态。" : e.message)
        this.notify.error(msg)
        return of(undefined)
      })
    );
  }

  getAnalysisBasic$(courseId: CourseId, assigId: AssignId, reGen: boolean = false) {
    return this.api.get$<BasicAnalysis>(`/courses/${courseId}/assignments/${assigId}/analysis/basic${reGen ? '?reGen=true' : ''}`, { timeoutMs: 10 * 60 * 1000 }).pipe(
      catchError((e: HttpErrorResponse) => {
        let msg = '无法获取作业基础分析数据: ' + (e.status === 500 ? "服务器连接异常，请确认服务器状态。" : e.message)
        this.notify.error(msg)
        return of(undefined)
      })
    );
  }

  getAnalysisAiGen$(courseId: CourseId, assigId: AssignId, notify: boolean = false, reGen: boolean = false) {
    return this.api.get$<AiGenAnalysis>(`/courses/${courseId}/assignments/${assigId}/analysis/aiGen${reGen ? '?reGen=true' : ''}`, { timeoutMs: 10 * 60 * 1000 }).pipe(
      catchError((e: HttpErrorResponse) => {
        if (e.status === 400) {
          if (notify)
            this.notify.error("坏蛋😢，改了本地时间也不能提前查看提交分析哦", "生成禁止")
          return of(undefined)
        }

        if (e.status === 403) {
          if (notify)
            this.notify.info('AI生成分析功能需要在提交后才能使用哦~');
          return of(undefined);
        }
        let msg = '无法获取作业AI生成分析数据: ' + (e.status === 500 ? "服务器连接异常，请确认服务器状态。" : e.message)
        this.notify.error(msg)
        return of(undefined)
      })
    );
  }

  testRequest$(codeFile: CodeFileInfo, input: string, language: CodeLanguage = 'c_cpp') {
    // 初步先使用 post 实现
    return this.api.post$<string>('/playground/submission', {
      codeFile,
      input,
      language,
    }).pipe(
      catchError((e: HttpErrorResponse) => {
        let msg = '无法提交代码测试: ' + (e.status === 500 ? "服务器连接异常，请确认服务器状态。" : e.message)
        this.notify.error(msg)
        return of(msg)
      })
    );
  }

  submitRequest$(courseId: CourseId, assignId: AssignId, codeFile: CodeFileInfo) {
    // @todo 后端实现后尝试实现 大文件上传 代码
    return this.api.post$(`/courses/${courseId}/assignments/${assignId}/submission`, { codeFile }, { timeoutMs: 1 * 60 * 1000 }).pipe(
      catchError((e: HttpErrorResponse) => {
        // @ts-ignore
        this.notify.error(e.status === 400 ? e.body.detail /*"已经过了截止时间了呢"*/ : '无法提交作业: ' + (e.status === 500 ? "服务器连接异常，请确认服务器状态。" : e.message))
        return of(undefined)
      })
    );
  }
  // ========== 流式分析方法 ==========

  /**
   * 流式获取基础分析（解题分析或知识点分析）
   * @param courseId 课程ID
   * @param assignId 作业ID
   * @param analysisType 'resolution' | 'knowledge'
   * @returns Observable<MatrixAnalysisProps> 实时更新的分析数据
   */
  getAnalysisBasicStream$(
    courseId: CourseId,
    assignId: AssignId,
    analysisType: 'resolution' | 'knowledge' = 'resolution'
  ): Observable<MatrixAnalysisProps> {
    const url = `/api/courses/${courseId}/assignments/${assignId}/analysis/basic/stream?analysisType=${analysisType}`;

    return this.sse.createEventSource(url).pipe(
      map((result: SSEStreamResult) => {
        // 如果已完成，返回最终数据
        if (result.complete) {
          return result.complete as MatrixAnalysisProps;
        }

        // 否则返回流式更新的内容
        const fullContent = result.chunks.join('');
        return {
          content: [{
            title: '生成中...',
            content: fullContent,
            complexity: undefined
          }],
          summary: result.progress ?
            `正在处理：${result.progress.current}/${result.progress.total}` :
            '正在生成...',
          showInEditor: false
        } as MatrixAnalysisProps;
      }),
      catchError((error) => {
        this.notify.error(`流式获取${analysisType === 'resolution' ? '解题分析' : '知识点分析'}失败: ${error.error || '网络错误'}`);
        return of({
          content: [],
          summary: '生成失败',
          showInEditor: false
        } as MatrixAnalysisProps);
      })
    );
  }

  /**
   * 流式获取AI生成分析（代码分析或学习建议）
   * @param courseId 课程ID
   * @param assignId 作业ID
   * @param analysisType 'code' | 'learning'
   * @returns Observable<MatrixAnalysisProps> 实时更新的分析数据
   */
  getAnalysisAiGenStream$(
    courseId: CourseId,
    assignId: AssignId,
    analysisType: 'code' | 'learning' = 'code',
    notify: boolean = false
  ): Observable<MatrixAnalysisProps> {
    const url = `/api/courses/${courseId}/assignments/${assignId}/analysis/aiGen/stream?analysisType=${analysisType}`;

    return this.sse.createEventSource(url).pipe(
      map((result: SSEStreamResult) => {
        // 如果已完成，返回最终数据
        if (result.complete) {
          return result.complete as MatrixAnalysisProps;
        }

        // 否则返回流式更新的内容
        const fullContent = result.chunks.join('');
        return {
          content: [{
            title: '生成中...',
            content: fullContent,
            complexity: undefined
          }],
          summary: result.progress ?
            `正在处理：${result.progress.current}/${result.progress.total}` :
            '正在生成...',
          showInEditor: false
        } as MatrixAnalysisProps;
      }),
      catchError((error) => {
        if (notify) {
          if (error.error?.includes('Deadline not meet')) {
            this.notify.error("坏蛋😢，改了本地时间也不能提前查看提交分析哦", "生成禁止");
          } else if (error.error?.includes('提交作业后')) {
            this.notify.info('AI生成分析功能需要在提交后才能使用哦~');
          } else {
            this.notify.error(`流式获取${analysisType === 'code' ? '代码分析' : '学习建议'}失败: ${error.error || '网络错误'}`);
          }
        }
        return of({
          content: [],
          summary: '生成失败',
          showInEditor: false
        } as MatrixAnalysisProps);
      })
    );
  }
}

