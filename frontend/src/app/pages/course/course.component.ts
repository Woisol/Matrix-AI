import { Component, inject, Input, OnInit } from "@angular/core";
import { AllCourse, TodoCourse } from "../../api/type/course";
import { AssignListComponent } from "../components/assign-list/assign-list.component";
import { CourseId } from "../../api/type/general";
import { CourseInfo } from "../../services/course/course-store.service";
import { ActivatedRoute } from "@angular/router";
import { CourseApi } from "../../services/course/course-api.service";

@Component({
  selector: 'app-course',
  imports: [AssignListComponent],
  template: `
  <div class="course-con">
    @if(course?.courseId) {
    <h2>{{course?.courseName}}</h2>
    <app-assign-list [course]="course"></app-assign-list>
    }
    @else {
      <div class="empty-content">
        <p>
          无法获取到该课程信息
        </p>
      </div>
    }
  </div>
  `,
  styles: `
    .course-con{
    width: 100%;
    max-width: 1080px;
    padding: 20px 40px;
    margin: 0 auto;
    }
  .empty-content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #8c8c8c;

    p {
      font-size: 14px;
      margin: 0;
    }
  }

`,
})

export class CourseComponent implements OnInit {
  courseApi = inject(CourseApi);

  route = inject(ActivatedRoute)
  courseInfo = inject(CourseInfo)
  course: AllCourse | undefined;
  courseId: CourseId | undefined;

  // courseId: CourseId;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.courseId = params.get('courseId') as CourseId;
    });
    if (!this.courseId) {
      console.error('未提供 Course ID');
      return;
    }
    this.courseApi.getCourseById$(this.courseId).subscribe(course => {
      this.course = course;
    });
  }

}
