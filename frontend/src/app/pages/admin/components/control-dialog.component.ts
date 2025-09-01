import { Component, inject, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ChangeDetectorRef, computed, signal, OnDestroy } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NzIconModule } from "ng-zorro-antd/icon";
import { CourseInfo } from "../../../services/course/course-store.service";
import { AllCourse, CourseTransProps } from "../../../api/type/course";
import { AssignData, AssignTransProps } from "../../../api/type/assigment";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { AssignService } from "../../../services/assign/assign.service";
import { CourseApi } from "../../../services/course/course-api.service";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NotificationService } from "../../../services/notification/notification.service";
import { AssignId, CourseId } from "../../../api/type/general";

@Component({
  selector: 'control-dialog',
  imports: [CommonModule, NzFormModule, ReactiveFormsModule, NzInputModule, NzSelectModule, NzCheckboxModule, NzModalModule, NzButtonModule, NzDatePickerModule, NzIconModule],
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
            <input nz-input formControlName="courseId" placeholder="请输入课程ID" [disabled]="isUpdate()" />
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
      <div (drop)="snipetDrop($event)"
            (dragover)="onDragOver($event)"
            (dragenter)="onDragEnter($event)"
            (dragleave)="onDragLeave($event)">
      <form nz-form nzLayout="vertical" [formGroup]="validateAssignForm"
            style="position: relative;">
        <!-- @if (isDragOver()) { -->
          <div class="drag-overlay" [class.active]="isDragOver()">
            <div class="drag-message">
              <span nz-icon nzType="drag" nzTheme="outline"></span>
              <p>拖拽选中的文本到此处自动解析作业信息</p>
              <small>内容按顺序为 标题、描述、初始代码、测试样例输入、输出，使用 --- 分隔</small>
              <small>另外在本页面粘贴也可实现</small>
            </div>
          </div>
        <!-- } -->
        <small><span nz-icon nzType="bulb" nzTheme="outline"></span>现已支持文本拖拽和粘贴快捷导入作业信息！<br/>内容按顺序为 标题、描述、初始代码、测试样例输入、输出，使用 --- 分隔</small>
        <nz-form-item>
          <nz-form-label>课程ID</nz-form-label>
          <nz-form-control nzErrorTip="请输入课程ID">
            <input (paste)="stopProp($event)" nz-input formControlName="courseId" placeholder="请输入课程ID" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label>作业ID</nz-form-label>
          <nz-form-control nzErrorTip="请输入作业ID">
            <input (paste)="stopProp($event)" nz-input formControlName="assignId" placeholder="请输入作业ID" [disabled]="isUpdate()"/>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzRequired>作业标题</nz-form-label>
          <nz-form-control nzErrorTip="请输入作业标题">
            <input (paste)="stopProp($event)" nz-input formControlName="title" placeholder="请输入作业标题" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzRequired>作业描述</nz-form-label>
          <nz-form-control nzErrorTip="请输入作业描述">
            <textarea
              (paste)="stopProp($event)"
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
              (paste)="stopProp($event)"
              nz-input
              formControlName="assignOriginalCode"
              placeholder='现在可以直接输入代码'
              [nzAutosize]="{ minRows: 4, maxRows: 8 }">
            </textarea>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label>测试样例-输入</nz-form-label>
          <nz-form-control nzHasFeedback nzExtra="标准输入列表，使用|分隔">
            <textarea
              (paste)="stopProp($event)"
              nz-input
              formControlName="testSampleInput"
              placeholder='例如：1|2|3'
              [nzAutosize]="{ minRows: 3}">
            </textarea>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label>测试样例-输出</nz-form-label>
          <nz-form-control nzHasFeedback nzExtra="标准输出列表，使用|分隔">
            <textarea
              (paste)="stopProp($event)"
              nz-input
              formControlName="testSampleOutput"
              placeholder='例如：1|4|9'
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
      </div>
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

    /* 拖拽覆盖层样式 */
    .drag-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      /*! 使用 color-mix 复用 var 添加透明度*/
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
      backdrop-filter: blur(4px);
      border: 2px dashed var(--color-primary);
      border-radius: 6px;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
      pointer-events: none;
    }

    .drag-overlay.active {
      opacity: 1;
    }

    .drag-message {
      text-align: center;
      color: var(--color-primary);
      font-size: 16px;
    }

    .drag-message [nz-icon] {
      font-size: 32px;
      margin-bottom: 8px;
      display: block;
    }

    .drag-message p {
      margin: 0 0 4px 0;
      font-weight: 500;
    }

    .drag-message small {
      font-size: 12px;
      color: #666;
      display: block;
      margin-top: 4px;
    }
  `],
})
export class ControlDialogComponent implements OnInit, OnChanges, OnDestroy {
  @Input() showModal: boolean = false;
  @Input() type: 'course' | 'assignment' = 'course';
  @Input() courseTrans: CourseTransProps | null = null;
  @Input() assignTrans: AssignTransProps | null = null;

  @Output() modalVisibleChange = new EventEmitter<boolean>();

  courseInfo = inject(CourseInfo);
  private formBuilder = inject(FormBuilder);
  // private cdr = inject(ChangeDetectorRef);
  submitting = false;
  courseApi = inject(CourseApi)
  //! type 不是 signal 导致不会触发
  // isEdit = computed(() => this.type === 'course' ? !!this.courseTrans : !!this.assignTrans);
  isUpdate = signal(this.type === 'course' ? !!this.courseTrans : !!this.assignTrans)
  notify = inject(NotificationService)

  // 拖拽相关属性
  isDragOver = signal(false);

  validateCourseForm = this.formBuilder.group({
    courseId: this.formBuilder.control<CourseId>(''),
    courseName: this.formBuilder.control<AssignId>('', [Validators.required, Validators.minLength(1)]),
    type: this.formBuilder.control<'public' | 'private'>('public', [Validators.required]),
    status: this.formBuilder.control<'open' | 'close'>('open', [Validators.required]),
    completed: this.formBuilder.control<boolean>(false),
    assignmentIds: this.formBuilder.control<string>(''),
  });

  validateAssignForm = this.formBuilder.group({
    courseId: this.formBuilder.control<CourseId>('', [Validators.required]),
    assignId: this.formBuilder.control<AssignId>(''),
    title: this.formBuilder.control<string>('', [Validators.required, Validators.minLength(1)]),
    description: this.formBuilder.control<string>('', [Validators.required, Validators.minLength(1)]),
    assignOriginalCode: this.formBuilder.control<string>('', [Validators.required]),
    testSampleInput: this.formBuilder.control<string>(''),
    testSampleOutput: this.formBuilder.control<string>(''),
    ddl: this.formBuilder.control<string>(''),
  });

  ngOnInit(): void {
    this.initializeForms();
    window.addEventListener('paste', async () => {
      const _content = await window.navigator.clipboard.readText();
      if (_content.trim()) {
        this.parseAssignmentContent(_content);
      }
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('paste', async () => {
    });
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
      this.isUpdate.set(this.type === 'course' ? !!this.courseTrans : !!this.assignTrans);
      // 手动触发变更检测以确保模板重新渲染
      // this.cdr.detectChanges();
    } else if (changes['courseTrans'] || changes['assignTrans']) {
      // 当数据改变时，初始化表单
      this.initializeForms();
      this.isUpdate.set(this.type === 'course' ? !!this.courseTrans : !!this.assignTrans);
      // this.cdr.detectChanges();
    }
  }

  stopProp(event: Event) {
    event.stopPropagation();
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
    const entityName = this.type === 'course' ? '课程' : '作业';
    return `${this.isUpdate() ? '编辑' : '新建'}${entityName}`;
  }

  /**
   * 获取确认按钮文本
   */
  getOkText(): string {
    return this.isUpdate() ? '更新' : '创建';
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

      if (formData.courseId) {
        this.courseApi.updateCourse$(formData).subscribe(data => {
          if (data) {
            this.notify.success(`课程${data.courseId}更新成功`);
            setTimeout(() => {
              window.location.reload();
            }, 1000)
          }
          this.requestFinally();
        })
      } else {
        this.courseApi.addCourse$(formData).subscribe(data => {
          if (data) {
            this.notify.success(`创建成功，课程 ID 为${data.courseId}`);
            setTimeout(() => {
              window.location.reload();
            }, 1000)
          }
          this.requestFinally();
        })
      }

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
      const _rawData = this.validateAssignForm.value;

      const formData = {
        ..._rawData,
        assignOriginalCode: JSON.stringify([{ fileName: "main.cpp", content: _rawData.assignOriginalCode }]),
        testSample: JSON.stringify({ input: _rawData.testSampleInput?.split('|'), expectOutput: _rawData.testSampleOutput?.split('|') })
      } as AssignTransProps & { courseId: CourseId };

      if (formData.assignId) {
        this.courseApi.updateAssignment$(formData).subscribe(data => {
          if (data) {
            this.notify.success(`作业${data.assignId}更新成功`);
            setTimeout(() => {
              window.location.reload();
            }, 1000)
          }
          this.requestFinally();
        });
      } else {
        this.courseApi.addAssignment$(formData).subscribe(data => {
          if (data) {
            this.notify.success(`创建成功，作业 ID 为${data.assignId}`);
            setTimeout(() => {
              window.location.reload();
            }, 1000)
          }
          this.requestFinally();
        });
      }
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
    this.validateAssignForm.get('assignOriginalCode')?.setValue('');
    this.validateAssignForm.get('testSampleInput')?.setValue('');
    this.validateAssignForm.get('testSampleOutput')?.setValue('');
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

  private requestFinally() {
    this.submitting = false;
    this.resetForms();
    this.modalVisibleChange.emit(false);
  }

  // 拖拽处理方法
  onDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  }

  onDragEnter(e: DragEvent) {
    e.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault();
    // 使用 relatedTarget 检查是否仍在当前元素内防止内部拖动触发 DragLeave
    if (!e.relatedTarget || !(e.currentTarget as HTMLElement)?.contains(e.relatedTarget as Node)) {
      this.isDragOver.set(false);
    }
  }

  /**
   * 处理文本拖拽放置
   */
  snipetDrop(e: DragEvent) {
    e.preventDefault();

    // 重置拖拽状态
    this.isDragOver.set(false);

    if (!e.dataTransfer) return;    // 优先处理文本拖拽
    const textData = e.dataTransfer.getData('text/plain');

    if (textData && textData.trim()) {
      // 处理选中文本拖拽
      this.parseAssignmentContent(textData);
    } else {
      this.notify.warning('未检测到有效的文本内容，请选中文本后拖拽。');
    }
  }

  /**
   * 解析作业内容格式并填充表单
   * 使用 --- 分隔各部分内容
   */
  private parseAssignmentContent(content: string) {
    try {
      const inputs = content.split('---').map(s => s.trim()).filter(s => s);

      // 填充表单
      if (inputs[0]) {
        this.validateAssignForm.patchValue({ title: inputs[0] });
      }

      if (inputs[1]) {
        this.validateAssignForm.patchValue({ description: inputs[1] });
      }

      if (inputs[2]) {
        this.validateAssignForm.patchValue({ assignOriginalCode: inputs[2] });
      }

      if (inputs[3]) {
        this.validateAssignForm.patchValue({ testSampleInput: inputs[3] });
      }

      if (inputs[4]) {
        this.validateAssignForm.patchValue({ testSampleOutput: inputs[4] });
      }

      this.notify.success('作业信息已自动填充！请检查并确认内容。');

    } catch (error) {
      this.notify.error('快捷解析失败，请检查文件格式是否正确：' + error);
    }
  }
}