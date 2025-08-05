import { Injectable } from "@angular/core";
import { AssigId, CourseId } from "../api/type/general";
import { AllCourse, TodoCourse } from "../api/type/course";
import { testAllCourseList, testTodoCourseList } from "../api/test/course";
@Injectable({
  providedIn: 'root'
})
export class CourseInfo {
  constructor() {
    this.todoCourseList = testTodoCourseList
    this.allCourseList = testAllCourseList
  }
  todoCourseList: TodoCourse[] = []
  allCourseList: AllCourse[] = []
}