import { Component, inject, signal, WritableSignal, OnDestroy, OnInit } from "@angular/core";
import { NzSplitterModule } from "ng-zorro-antd/splitter";
import { CourseInfoTabComponent } from "./components/course-info-tab.component";
import { testAssigData } from "../../api/test/assig";
import { Analysis, AssignData, CodeFileInfo, Submit } from "../../api/type/assigment";
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
        <course-info-tab [assignData]="assignData()" [analysis]="analysis()" [onAnalysisAiGenRequest]="loadAnalysisAiGen" [selectedTabIndex]="selectedTabIndex" />
      </nz-splitter-panel>
      <nz-splitter-panel nzMin="200px" nzDefaultSize="70%" [nzCollapsible]="true">
        <code-editor [codeFile]="codeFile()" [onSubmitRequest]="onSubmitRequest"/>
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
  codeFile: WritableSignal<CodeFileInfo> = signal({ fileName: '', content: '' });

  selectedTabIndex = signal(0);

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
      const codeFile = data?.submit?.submitCode?.[0]
        ?? data?.assignOriginalCode?.[0]
        ?? '';
      this.codeFile.set(codeFile);
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

  // ngOnInit(): void {
  //   var _codeFileChangeIndex: number = 0;
  //   var _codeFileChangeArr = [
  //     { fileName: 'main.cpp', content: '0' },
  //     { fileName: 'main.cpp', content: '1' },
  //     { fileName: 'main.cpp', content: '2' },
  //     { fileName: 'main.cpp', content: '3' }
  //   ];
  //   setInterval(() => {
  //     this.codeFile.set(_codeFileChangeArr[(_codeFileChangeIndex++) % _codeFileChangeArr.length]);
  //   }, 1000)
  // }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  //! 注意闭包！否则传入后 this 指向不正确！
  onSubmitRequest = () => {
    // debugger
    if (!this.codeFile().fileName || !this.codeFile().content) {
      // alert('请先输入代码');
      return;
    }
    if (!this.courseId || !this.assignId) {
      return;
    }
    this.assignService.submitRequest$(this.courseId, this.assignId, this.codeFile()).subscribe({
      next: (response) => {
        this.assignData.update(ad => ({
          ...ad!,
          submit: response as Submit
        }));
        this.selectedTabIndex.set(1);
      },
      error: (error) => {
        // alert('提交失败: ' + error);
      }
    });
  }
}
