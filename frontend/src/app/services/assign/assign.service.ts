import { inject, Injectable } from "@angular/core";
import { ApiHttpService } from "../../api/util/api-http.service";
import { AssignId, CourseId } from "../../api/type/general";
import { AiGenAnalysis, Analysis, AssignData, BasicAnalysis, CodeContent, CodeFileInfo, CodeLanguage } from "../../api/type/assigment";
import { testAnalysis, testAssigData } from "../../api/test/assig";
import { catchError, of } from "rxjs";
import { NotificationService } from "../notification/notification.service";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class AssignService {
  constructor(private api: ApiHttpService) { }
  notify = inject(NotificationService)

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

  getAnalysisBasic$(courseId: CourseId, assigId: AssignId) {
    return this.api.get$<BasicAnalysis>(`/courses/${courseId}/assignments/${assigId}/analysis/basic`).pipe(
      catchError((e: HttpErrorResponse) => {
        let msg = '无法获取作业基础分析数据: ' + (e.status === 500 ? "服务器连接异常，请确认服务器状态。" : e.message)
        this.notify.error(msg)
        return of(undefined)
      })
    );
  }

  getAnalysisAiGen$(courseId: CourseId, assigId: AssignId, notify: boolean = false) {
    return this.api.get$<AiGenAnalysis>(`/courses/${courseId}/assignments/${assigId}/analysis/aiGen`).pipe(
      catchError((e: HttpErrorResponse) => {
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
    return this.api.post$(`/courses/${courseId}/assignments/${assignId}/submission`, { codeFile }).pipe(
      catchError((e: HttpErrorResponse) => {
        this.notify.error('无法提交作业: ' + (e.status === 500 ? "服务器连接异常，请确认服务器状态。" : e.message))
        return of(undefined)
      })
    );
  }
}
