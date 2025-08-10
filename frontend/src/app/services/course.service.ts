import { Injectable } from "@angular/core";
import { AllCourse, TodoCourse } from "../api/type/course";
import { courseOps } from "../api/course";
@Injectable({
  providedIn: 'root'
})
export class CourseInfo {
  constructor() {
    courseOps.getTodoCourseList().then(data => {
      this.todoCourseList = data;
    });
    courseOps.getAllCourseList().then(data => {
      this.allCourseList = data;
    });
  }
  todoCourseList: TodoCourse[] = []
  allCourseList: AllCourse[] = []
}