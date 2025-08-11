import { Injectable } from "@angular/core";
import { ApiHttpService } from "../../api/util/api-http.service";
import { AssignId, CourseId } from "../../api/type/general";
import { AiGenAnalysis, Analysis, AssignData, BasicAnalysis } from "../../api/type/assigment";
import { testAnalysis, testAssigData } from "../../api/test/assig";
import { catchError, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AssignService {
  constructor(private api: ApiHttpService) { }

  // @todo 将错误返回值改回 []
  getAssignData$(courseId: CourseId, assigId: AssignId) {
    return this.api.get$<AssignData>(`/courses/${courseId}/assignments/${assigId}`).pipe(
      catchError(() => of(testAssigData))
    );
  }

  getAnalysisBasic$(courseId: CourseId, assigId: AssignId) {
    return this.api.get$<BasicAnalysis>(`/courses/${courseId}/assignments/${assigId}/analysis/basic`).pipe(
      catchError(() => of(testAnalysis.basic))
    );
  }

  getAnalysisAiGen$(courseId: CourseId, assigId: AssignId) {
    return this.api.get$<AiGenAnalysis>(`/courses/${courseId}/assignments/${assigId}/analysis/detail`).pipe(
      catchError(() => of(testAnalysis.aiGen))
    );
  }
}