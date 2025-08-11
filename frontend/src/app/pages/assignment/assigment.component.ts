import { Component, inject, signal, WritableSignal, OnDestroy } from "@angular/core";
import { NzSplitterModule } from "ng-zorro-antd/splitter";
import { CourseInfoTabComponent } from "./components/course-info-tab.component";
import { testAssigData } from "../../api/test/assig";
import { Analysis, AssignData } from "../../api/type/assigment";
import { CodeEditorComponent } from "./components/code-editor.component";
import { AssignId, CourseId } from "../../api/type/general";
import { AssignService } from "../../services/assign/assign.service";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-assignment",
  imports: [NzSplitterModule, CourseInfoTabComponent, CodeEditorComponent],
  standalone: true,
  template: `
  <div class="assignment-con">
    <nz-splitter>
      <nz-splitter-panel nzMin="100px" nzDefaultSize="30%" [nzCollapsible]="true">
        <course-info-tab [assignData]="assignData()" [analysis]="analysis()" [onAnalysisAiGenRequest]="loadAnalysisAiGen" />
      </nz-splitter-panel>
      <nz-splitter-panel nzMin="200px" nzDefaultSize="70%" [nzCollapsible]="true">
        <code-editor [code]="code()" />
      </nz-splitter-panel>
    </nz-splitter>
  </div>
  `,
  styles: [`
  .assignment-con{
    width: 100%;
    height: calc(100vh - var(--size-top-bar) - 20px);
    display: flex;

    ::ng-deep .ant-splitter-panel{
      padding: 10px;
    }
  }
  `]
})

export class AssignmentComponent implements OnDestroy {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private assignService = inject(AssignService);

  courseId: CourseId | undefined;
  assignId: AssignId | undefined;

  // 直接存放数据对象而不是 Observable，便于模板使用
  assignData = signal<AssignData | undefined>(undefined);
  analysis = signal<Analysis | undefined>(undefined);
  code: WritableSignal<string> = signal('');

  private subs: Subscription[] = [];

  constructor() {
    // 监听路由参数变化后再加载数据，避免构造期 ID 为空
    const sub = this.route.paramMap.subscribe(params => {
      this.courseId = params.get('courseId') as CourseId;
      this.assignId = params.get('assignId') as AssignId;
      this.loadAssign();
      this.loadAnalysisBasic();
      this.loadAnalysisAiGen();
    });
    this.subs.push(sub);
  }

  private loadAssign() {
    if (!this.courseId || !this.assignId) return;
    const sub = this.assignService.getAssignData$(this.courseId, this.assignId).subscribe(data => {
      this.assignData.set(data);
      // 初始代码：优先提交代码->原始代码->空
      const codeStr = data?.submit?.submitCode?.[0]?.content
        ?? data?.assignOriginalCode?.[0]?.content
        ?? '';
      this.code.set(codeStr);
    });
    this.subs.push(sub);
  }

  private loadAnalysisBasic() {
    if (!this.courseId || !this.assignId) return;
    const sub = this.assignService.getAnalysisBasic$(this.courseId, this.assignId).subscribe(data => {
      // 修复: 初次加载 analysis 为空时展开 undefined 会抛错
      const prev = this.analysis();
      this.analysis.set({
        basic: { ...(prev?.basic || {}), ...data },
        aiGen: prev?.aiGen
      });
    });
    this.subs.push(sub);
  }

  loadAnalysisAiGen() {
    if (!this.courseId || !this.assignId) return;
    const sub = this.assignService.getAnalysisAiGen$(this.courseId, this.assignId).subscribe(data => {
      const prev = this.analysis();
      this.analysis.set({
        basic: prev?.basic!,
        aiGen: data
      });
    });
    this.subs.push(sub);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}