import { Component, inject, Input, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { CourseInfo } from "../../../services/course/course-store.service";
import { AllCourse } from "../../../api/type/course";
import { AssignData } from "../../../api/type/assigment";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { AssignService } from "../../../services/assign/assign.service";
import { CourseApi } from "../../../services/course/course-api.service";
import { NzModalModule } from "ng-zorro-antd/modal";

@Component({
  selector: 'control-form',
  imports: [NzFormModule, ReactiveFormsModule, NzInputModule, NzSelectModule, NzCheckboxModule, NzModalModule],
  template: `
  <nz-modal [nzVisible]="showModal" [nzTitle]="type === 'course' ? '课程' : '作业'" >
  <form nz-form nzLayout="inline" [formGroup]="validateCourseForm">
    <nz-form-item>
      <nz-form-control nzErrorTip="课程 ID 有误">
        <input nz-input formControlName="courseId" placeholder="课程 ID" />
      </nz-form-control>
    </nz-form-item>
    <nz-form-item>
      <nz-form-control nzErrorTip="请输入课程名称">
        <input nz-input formControlName="courseName" placeholder="课程名称" />
      </nz-form-control>
    </nz-form-item>
    <nz-form-item>
      <nz-form-control nzErrorTip="请选择课程类型">
        <nz-select formControlName="type" nzPlaceHolder="课程类型">
          <nz-option nzValue="public" nzLabel="Public"></nz-option>
          <nz-option nzValue="private" nzLabel="Private"></nz-option>
        </nz-select>
      </nz-form-control>
    </nz-form-item>
    <nz-form-item>
      <nz-form-control nzErrorTip="请选择课程状态">
        <nz-select formControlName="status" nzPlaceHolder="课程状态">
          <nz-option nzValue="open" nzLabel="Open"></nz-option>
          <nz-option nzValue="close" nzLabel="Close"></nz-option>
        </nz-select>
      </nz-form-control>
    </nz-form-item>
    <nz-form-item>
      <nz-form-control nzErrorTip="数据有误">
        <label nz-checkbox formControlName="completed">已完成</label>
      </nz-form-control>
    </nz-form-item>
    <nz-form-item>
      <nz-form-control>
        <input nz-input formControlName="assignmentIds" placeholder="作业 ID（用逗号分隔）" />
      </nz-form-control>
    </nz-form-item>
  </form>
</nz-modal>
  `,
  styles: `
  `,
})
export class ControlFormComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Input() type: 'course' | 'assignment' = 'course';

  courseInfo = inject(CourseInfo)

  ngOnInit(): void {
  }

  private formBuilder = inject(FormBuilder);
  validateCourseForm = this.formBuilder.group({
    courseId: this.formBuilder.control<string>(''),
    courseName: this.formBuilder.control<string>('', [Validators.required, Validators.minLength(1)]),
    type: this.formBuilder.control<string>('public', [Validators.required, Validators.pattern(/^(public|private)$/)]),
    status: this.formBuilder.control<string>('open', [Validators.required, Validators.pattern(/^(open|close)$/)]),
    completed: this.formBuilder.control(false),
    assignmentIds: this.formBuilder.control<string>(''),
  } as Record<keyof AllCourse & 'assignmentIds', any>)
  validateAssignForm = this.formBuilder.group({
    assignId: this.formBuilder.control<string>(''),
    title: this.formBuilder.control<string>('', [Validators.required, Validators.minLength(1)]),
    description: this.formBuilder.control<string>('', [Validators.required, Validators.minLength(1)]),
    assignOriginalCode: this.formBuilder.control<string>('[{"fileName": "main.cpp", "content": ""}]', [Validators.required, Validators.minLength(1)]),
    testSample: this.formBuilder.control<string>('{"input":[],"expectOutput":[]}'),
    ddl: this.formBuilder.control<Date>(new Date()),
    // type: this.formBuilder.control<string>('program', [Validators.required, Validators.pattern(/^(program|choose)$/)]),
  } as Record<keyof AssignData & 'testSample' & 'ddl', any>)

  onSubmitCourse(params: Record<keyof AssignData & 'testSample' & 'ddl', any>) {

  }
}