import { inject, Injectable } from "@angular/core";
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { testAllCourseList, testTodoCourseList } from "../../api/test/course";
import { ApiHttpService } from "../../api/util/api-http.service";
import { AllCourse, TodoCourse } from "../../api/type/course";
import { HttpErrorResponse } from "@angular/common/http";
import { NotificationService } from "../notification/notification.service";

@Injectable({ providedIn: 'root' })
export class CourseApi {
  constructor(private api: ApiHttpService) { }
  notify = inject(NotificationService)
  // @todo 将错误返回值改回 []
  getTodoCourseList$() {
    return this.api.get$<TodoCourse[]>('/courses/todo').pipe(
      catchError((e: HttpErrorResponse) => {
        let msg = '无法获取待办课程列表: ' + (e.status === 500 ? "服务器连接异常，请确认服务器状态。" : e.message);
        this.notify.error(msg);
        return of([])
      })
    );
  }

  getAllCourseList$() {
    return this.api.get$<AllCourse[]>('/courses').pipe(
      catchError((e: HttpErrorResponse) => {
        let msg = '无法获取课程列表: ' + (e.status === 500 ? "服务器连接异常，请确认服务器状态。" : e.message);
        this.notify.error(msg);
        return of([])
      })
    );
  }

  getCourseById$(courseId: string) {
    return this.api.get$<AllCourse>(`/courses/${courseId}`).pipe(
      catchError((e: HttpErrorResponse) => {
        let msg = `无法获取课程(${courseId}): ` + (e.status === 500 ? "服务器连接异常，请确认服务器状态。" : e.message);
        this.notify.error(msg);
        return of(undefined)
      })
    );
  }
}
