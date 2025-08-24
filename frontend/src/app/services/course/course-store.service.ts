import { Injectable } from "@angular/core";
import { AllCourse, TodoCourse } from "../../api/type/course";
import { CourseApi } from "./course-api.service";
@Injectable({
  providedIn: 'root'
})
export class CourseInfo {
  constructor(private courseApi: CourseApi) {
    // this.todoCourseList = courseOps.getTodoCourseList();
    courseApi.getTodoCourseList$().subscribe(data => {
      this.todoCourseList = data;
    });
    courseApi.getAllCourseList$().subscribe(data => {
      this.allCourseList = data;
    });
  }
  todoCourseList: TodoCourse[] = []
  allCourseList: AllCourse[] = []
}