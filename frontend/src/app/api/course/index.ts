import { Injectable } from "@angular/core";
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { testAllCourseList, testTodoCourseList } from "../test/course";
import { ApiHttpService } from "../util/api-http.service";
import { AllCourse, TodoCourse } from "../type/course";

@Injectable({ providedIn: 'root' })
export class CourseApi {
  constructor(private api: ApiHttpService) { }

  // @todo 将错误返回值改回 []
  getTodoCourseList$() {
    return this.api.get$<TodoCourse[]>('/courses/todo').pipe(
      catchError(() => of(testTodoCourseList))
    );
  }

  getAllCourseList$() {
    return this.api.get$<AllCourse[]>('/courses').pipe(
      catchError(() => of(testAllCourseList))
    );
  }

  getCourseById$(courseId: string) {
    return this.api.get$<AllCourse>(`/courses/${courseId}`).pipe(
      catchError(() => {
        const _testCourse = testAllCourseList.find(c => c.courseId === courseId);
        // subscribe 为异步导致拿不到值
        // this.getAllCourseList$().subscribe(data => { _testCourse = data.find(course => course.courseId === courseId) });
        return of(_testCourse);
      })
    );
  }
}