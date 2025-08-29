import { Component, inject, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { CourseInfo } from "../../../services/course/course-store.service";
import { AllCourse, CourseTransProps } from "../../../api/type/course";
import { AssignData, AssignTransProps } from "../../../api/type/assigment";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { AssignService } from "../../../services/assign/assign.service";
import { CourseApi } from "../../../services/course/course-api.service";
import { NzModalModule } from "ng-zorro-antd/modal";

@Component({
  selector: 'control-dialog',
  imports: [NzFormModule, ReactiveFormsModule, NzInputModule, NzSelectModule, NzCheckboxModule, NzModalModule, NzButtonModule, NzDatePickerModule],
  template: `
  <nz-modal
    [nzVisible]="showModal"
    [nzTitle]="getModalTitle()"
    nzClosable="false"
    [nzOkText]="getOkText()"
    nzCancelText="取消"
    (nzOnCancel)="onCancel()"
    (nzOnOk)="onSubmit()"
    [nzOkLoading]="submitting">
    <div *nzModalContent>
    <!-- 课程表单 -->
    @if (type === 'course') {
      <form nz-form nzLayout="vertical" [formGroup]="validateCourseForm">
        <nz-form-item>
          <nz-form-label>课程ID</nz-form-label>
          <nz-form-control nzErrorTip="请输入课程ID">
            <input nz-input formControlName="courseId" placeholder="请输入课程ID" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzRequired>课程名称</nz-form-label>
          <nz-form-control nzErrorTip="请输入课程名称">
            <input nz-input formControlName="courseName" placeholder="请输入课程名称" />
          </nz-form-control>
        </nz-form-item>

        <div nz-row nzGutter="16">
          <div nz-col nzSpan="12">
            <nz-form-item>
              <nz-form-label nzRequired>课程类型</nz-form-label>
              <nz-form-control nzErrorTip="请选择课程类型">
                <nz-select formControlName="type" nzPlaceHolder="请选择课程类型">
                  <nz-option nzValue="public" nzLabel="公开课程"></nz-option>
                  <nz-option nzValue="private" nzLabel="私有课程"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </div>

          <div nz-col nzSpan="12">
            <nz-form-item>
              <nz-form-label nzRequired>课程状态</nz-form-label>
              <nz-form-control nzErrorTip="请选择课程状态">
                <nz-select formControlName="status" nzPlaceHolder="请选择课程状态">
                  <nz-option nzValue="open" nzLabel="开放"></nz-option>
                  <nz-option nzValue="close" nzLabel="关闭"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </div>
        </div>

        <nz-form-item>
          <nz-form-control>
            <label nz-checkbox formControlName="completed">已完成</label>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label>作业ID</nz-form-label>
          <nz-form-control nzHasFeedback nzExtra="多个作业ID请用逗号分隔">
            <input nz-input formControlName="assignmentIds" placeholder="例如：assign1,assign2,assign3" />
          </nz-form-control>
        </nz-form-item>
      </form>
    }

    <!-- 作业表单 -->
    @if (type === 'assignment') {
      <form nz-form nzLayout="vertical" [formGroup]="validateAssignForm">
        <nz-form-item>
          <nz-form-label>作业ID</nz-form-label>
          <nz-form-control nzErrorTip="请输入作业ID">
            <input nz-input formControlName="assignId" placeholder="请输入作业ID" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzRequired>作业标题</nz-form-label>
          <nz-form-control nzErrorTip="请输入作业标题">
            <input nz-input formControlName="title" placeholder="请输入作业标题" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzRequired>作业描述</nz-form-label>
          <nz-form-control nzErrorTip="请输入作业描述">
            <textarea
              nz-input
              formControlName="description"
              placeholder="请输入作业描述"
              [nzAutosize]="{ minRows: 3, maxRows: 6 }">
            </textarea>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzRequired>初始代码</nz-form-label>
          <nz-form-control nzErrorTip="请输入初始代码配置">
            <textarea
              nz-input
              formControlName="assignOriginalCode"
              placeholder='例如：[{"fileName": "main.cpp", "content": "#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}"}]'
              [nzAutosize]="{ minRows: 4, maxRows: 8 }">
            </textarea>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label>测试样例</nz-form-label>
          <nz-form-control nzHasFeedback nzExtra="JSON格式的测试输入输出">
            <textarea
              nz-input
              formControlName="testSample"
              placeholder='例如：{"input":["5 3"], "expectOutput":["8"]}'
              [nzAutosize]="{ minRows: 3, maxRows: 6 }">
            </textarea>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label>截止时间</nz-form-label>
          <nz-form-control>
            <nz-date-picker
              formControlName="ddl"
              nzShowTime
              nzFormat="yyyy-MM-dd HH:mm:ss"
              nzPlaceHolder="选择截止时间">
            </nz-date-picker>
          </nz-form-control>
        </nz-form-item>
      </form>
    }
    </div>
  </nz-modal>
  `,
  styles: [`
    .ant-form-vertical .ant-form-item-label {
      padding-bottom: 4px;
    }

    .ant-form-item {
      margin-bottom: 16px;
    }

    nz-date-picker {
      width: 100%;
    }

    textarea.ant-input {
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 12px;
    }

    .ant-form-item-extra {
      font-size: 12px;
      color: #8c8c8c;
      margin-top: 4px;
    }
  `],
})
export class ControlDialogComponent implements OnInit, OnChanges {
  @Input() showModal: boolean = false;
  @Input() type: 'course' | 'assignment' = 'course';
  @Input() courseTrans: CourseTransProps | null = null;
  @Input() assignTrans: AssignTransProps | null = null;

  @Output() modalVisibleChange = new EventEmitter<boolean>();
  @Output() courseSubmit = new EventEmitter<CourseTransProps>();
  @Output() assignmentSubmit = new EventEmitter<AssignTransProps>();

  courseInfo = inject(CourseInfo);
  private formBuilder = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  submitting = false;

  validateCourseForm = this.formBuilder.group({
    courseId: this.formBuilder.control<string>(''),
    courseName: this.formBuilder.control<string>('', [Validators.required, Validators.minLength(1)]),
    type: this.formBuilder.control<'public' | 'private'>('public', [Validators.required]),
    status: this.formBuilder.control<'open' | 'close'>('open', [Validators.required]),
    completed: this.formBuilder.control<boolean>(false),
    assignmentIds: this.formBuilder.control<string>(''),
  });

  validateAssignForm = this.formBuilder.group({
    assignId: this.formBuilder.control<string>(''),
    title: this.formBuilder.control<string>('', [Validators.required, Validators.minLength(1)]),
    description: this.formBuilder.control<string>('', [Validators.required, Validators.minLength(1)]),
    assignOriginalCode: this.formBuilder.control<string>('[{"fileName": "main.cpp", "content": ""}]', [Validators.required]),
    testSample: this.formBuilder.control<string>('{"input":[],"expectOutput":[]}'),
    ddl: this.formBuilder.control<string>(''),
  });

  ngOnInit(): void {
    this.initializeForms();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showModal'] && this.showModal) {
      // 当弹窗打开时，重置表单状态
      this.resetFormValidationState();
    }

    if (changes['type']) {
      // 当类型改变时，重置所有表单并初始化
      this.resetForms();
      this.initializeForms();
      // 手动触发变更检测以确保模板重新渲染
      this.cdr.detectChanges();
    } else if (changes['courseTrans'] || changes['assignTrans']) {
      // 当数据改变时，初始化表单
      this.initializeForms();
      this.cdr.detectChanges();
    }
  }

  /**
   * 初始化表单数据
   */
  private initializeForms(): void {
    if (this.type === 'course') {
      if (this.courseTrans) {
        this.validateCourseForm.patchValue(this.courseTrans);
      } else {
        // 新建课程时重置表单
        this.resetCourseForm();
      }
    } else if (this.type === 'assignment') {
      if (this.assignTrans) {
        this.validateAssignForm.patchValue(this.assignTrans);
      } else {
        // 新建作业时重置表单
        this.resetAssignmentForm();
      }
    }
  }

  /**
   * 获取模态框标题
   */
  getModalTitle(): string {
    const isEdit = this.type === 'course' ? !!this.courseTrans : !!this.assignTrans;
    const entityName = this.type === 'course' ? '课程' : '作业';
    return `${isEdit ? '编辑' : '新建'}${entityName}`;
  }

  /**
   * 获取确认按钮文本
   */
  getOkText(): string {
    const isEdit = this.type === 'course' ? !!this.courseTrans : !!this.assignTrans;
    return isEdit ? '更新' : '创建';
  }

  /**
   * 取消操作
   */
  onCancel(): void {
    this.resetForms();
    this.modalVisibleChange.emit(false);
  }

  /**
   * 提交操作
   */
  onSubmit(): void {
    if (this.type === 'course') {
      this.onSubmitCourse();
    } else {
      this.onSubmitAssignment();
    }
  }

  /**
   * 提交课程数据
   */
  private onSubmitCourse(): void {
    if (this.validateCourseForm.valid) {
      this.submitting = true;
      const formData = this.validateCourseForm.value as CourseTransProps;

      // 发出提交事件
      this.courseSubmit.emit(formData);

      // 模拟提交延迟
      setTimeout(() => {
        this.submitting = false;
        this.resetForms();
        this.modalVisibleChange.emit(false);
      }, 1000);
    } else {
      // 标记所有字段为脏状态以显示验证错误
      Object.keys(this.validateCourseForm.controls).forEach(key => {
        this.validateCourseForm.get(key)?.markAsDirty();
        this.validateCourseForm.get(key)?.updateValueAndValidity();
      });
    }
  }

  /**
   * 提交作业数据
   */
  private onSubmitAssignment(): void {
    if (this.validateAssignForm.valid) {
      this.submitting = true;
      const formData = this.validateAssignForm.value as AssignTransProps;

      // 发出提交事件
      this.assignmentSubmit.emit(formData);

      // 模拟提交延迟
      setTimeout(() => {
        this.submitting = false;
        this.resetForms();
        this.modalVisibleChange.emit(false);
      }, 1000);
    } else {
      // 标记所有字段为脏状态以显示验证错误
      Object.keys(this.validateAssignForm.controls).forEach(key => {
        this.validateAssignForm.get(key)?.markAsDirty();
        this.validateAssignForm.get(key)?.updateValueAndValidity();
      });
    }
  }

  /**
   * 重置表单
   */
  private resetForms(): void {
    this.resetCourseForm();
    this.resetAssignmentForm();
  }

  /**
   * 重置课程表单
   */
  private resetCourseForm(): void {
    this.validateCourseForm.reset();
    this.validateCourseForm.get('type')?.setValue('public');
    this.validateCourseForm.get('status')?.setValue('open');
    this.validateCourseForm.get('completed')?.setValue(false);
  }

  /**
   * 重置作业表单
   */
  private resetAssignmentForm(): void {
    this.validateAssignForm.reset();
    this.validateAssignForm.get('assignOriginalCode')?.setValue('[{"fileName": "main.cpp", "content": ""}]');
    this.validateAssignForm.get('testSample')?.setValue('{"input":[],"expectOutput":[]}');
  }

  /**
   * 重置表单验证状态
   */
  private resetFormValidationState(): void {
    // 重置课程表单验证状态
    Object.keys(this.validateCourseForm.controls).forEach(key => {
      const control = this.validateCourseForm.get(key);
      control?.markAsUntouched();
      control?.markAsPristine();
    });

    // 重置作业表单验证状态
    Object.keys(this.validateAssignForm.controls).forEach(key => {
      const control = this.validateAssignForm.get(key);
      control?.markAsUntouched();
      control?.markAsPristine();
    });
  }
}