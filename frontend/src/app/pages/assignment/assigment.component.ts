import { Component, inject, signal, WritableSignal, OnDestroy } from "@angular/core";
import { NzSplitterModule } from "ng-zorro-antd/splitter";
import { CourseInfoTabComponent } from "./components/course-info-tab.component";
import { Analysis, AssignData, CodeFileInfo, Submit } from "../../api/type/assigment";
import { CodeEditorComponent } from "./components/code-editor.component";
import { AssignId, CourseId } from "../../api/type/general";
import { AssignService } from "../../services/assign/assign.service";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { NotificationService } from "../../services/notification/notification.service";

@Component({
  selector: "app-assignment",
  imports: [NzSplitterModule, CourseInfoTabComponent, CodeEditorComponent],
  standalone: true,
  template: `
  <div class="assignment-con">
    <nz-splitter>
      <nz-splitter-panel nzMin="100px" nzDefaultSize="30%" [nzCollapsible]="true">
        <course-info-tab [assignData]="assignData()" [analysis]="analysis()" [handleAnalysisRegen]="handleAnalysisRegen" [onAnalysisAiGenRequest]="loadAnalysisAiGen" [selectedTabIndex]="selectedTabIndex" />

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
    position: relative;
    ::ng-deep .ant-splitter-panel{
      padding: 10px;
    }
  }
  `]
})


export class AssignmentComponent implements OnDestroy {
  private _emptyCodeFile = { fileName: '', content: '' }
  notify = inject(NotificationService)

  private route: ActivatedRoute = inject(ActivatedRoute);
  private assignService = inject(AssignService);

  courseId: CourseId | undefined;
  assignId: AssignId | undefined;

  // 直接存放数据对象而不是 Observable，便于模板使用
  assignData = signal<AssignData | undefined>(undefined);
  analysis = signal<Analysis | undefined>(undefined);
  codeFile: WritableSignal<CodeFileInfo> = signal(this._emptyCodeFile);

  selectedTabIndex = signal(0);
  useStreamingMode = signal(true);

  private subs: Subscription[] = [];

  constructor() {
    // 监听路由参数变化后再加载数据，避免构造期 ID 为空
    const sub = this.route.paramMap.subscribe(params => {
      this.courseId = params.get('courseId') as CourseId;
      this.assignId = params.get('assignId') as AssignId;
      this.loadAssign();
      if (this.assignData()?.ddl && this.assignData()?.ddl! > new Date()) {
        return;
      }
      // this.loadAnalysisBasic();
      // this.loadAnalysisAiGen();
      this.loadAnalysisBasicStream('resolution');
    });
    this.subs.push(sub);
  }

  loadAssign() {
    if (!this.courseId || !this.assignId) return;
    const sub = this.assignService.getAssignData$(this.courseId, this.assignId).subscribe(data => {
      this.assignData.set(data);
      // 初始代码：优先提交代码->原始代码->空
      const codeFile = data?.submit?.submitCode?.[0]
        ?? data?.assignOriginalCode?.[0]
        ?? this._emptyCodeFile;
      this.codeFile.set(codeFile);
    });
    this.subs.push(sub);
  }

  // @todo az 所以现在不提交也能通过控制台看到预分析内容的()
  loadAnalysisBasic = (reGen: boolean = false) => {
    if (!this.courseId || !this.assignId) return;
    const sub = this.assignService.getAnalysisBasic$(this.courseId, this.assignId, reGen).subscribe(data => {
      // 修复: 初次加载 analysis 为空时展开 undefined 会抛错
      const prev = this.analysis();
      this.analysis.set({
        basic: { ...(prev?.basic || {}), ...data },
        aiGen: prev?.aiGen
      });
    });
    this.subs.push(sub);
  }

  handleAnalysisRegen = () => {
    // this.loadAnalysisBasic(true);
    this.loadAnalysisBasicStream('resolution', true);
    this.loadAnalysisBasicStream('knowledge', true);
    // if (this.analysis()?.aiGen)
    //   this.loadAnalysisAiGen(true);
    this.notify.info("已经请求重新分析，预计要 1~2 分钟，请耐心等待")
  }

  loadAnalysisAiGen = (notify: boolean = false) => {
    if (!this.courseId || !this.assignId) return;
    if (this.assignData()?.ddl && this.assignData()?.ddl! > new Date()) {
      if (notify)
        this.notify.error("截止后才能查看提交分析哦", "生成禁止")
      return;
    }

    const sub = this.assignService.getAnalysisAiGen$(this.courseId, this.assignId, notify).subscribe(data => {
      const prev = this.analysis();
      this.analysis.set({
        basic: prev?.basic!,
        aiGen: data
      });
    });
    this.subs.push(sub);
    this.notify.info("已经请求生成分析，预计要 1~2 分钟，请耐心等待")
  }

    // ========== 流式与非流式智能切换方法 ==========

  /**
   * 智能加载基础分析（自动选择流式或非流式）
   * @param analysisType 'resolution' | 'knowledge'
   * @param reGen 是否重新生成
   */
  smartLoadBasicAnalysis = (
    analysisType: 'resolution' | 'knowledge' = 'resolution',
    reGen: boolean = false
  ) => {
    if (this.useStreamingMode()) {
      this.loadAnalysisBasicStream(analysisType, reGen);
    } else {
      this.loadAnalysisBasic(reGen);
    }
  }

  /**
   * 智能加载AI生成分析（自动选择流式或非流式）
   * @param analysisType 'code' | 'learning'
   * @param notify 是否显示通知
   */
  smartLoadAiGenAnalysis = (
    analysisType: 'code' | 'learning' = 'code',
    notify: boolean = false
  ) => {
    if (this.useStreamingMode()) {
      this.loadAnalysisAiGenStream(analysisType, notify);
    } else {
      this.loadAnalysisAiGen(notify);
    }
  }

  /**
   * 切换流式/非流式模式
   */
  toggleStreamingMode = () => {
    this.useStreamingMode.update(v => !v);
    this.notify.info(`已切换到${this.useStreamingMode() ? '流式' : '传统'}模式`);
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
    onAiGenAnalysisRequest = (notify: boolean = false) => {
    // 默认生成代码分析
    this.smartLoadAiGenAnalysis('code', notify);
  }
  onSubmitRequest = () => {
    // debugger
    if (this.assignData()?.ddl && this.assignData()?.ddl! < new Date()) {
      this.notify.error("已经过了截止时间了呢", "提交禁止")
      return;
    }
    if (!this.codeFile().fileName || !this.codeFile().content) {
      this.notify.error("不能提交空代码！", "提交禁止")
      // return;
    }
    if (!this.courseId || !this.assignId) {
      return;
    }
    this.assignService.submitRequest$(this.courseId, this.assignId, this.codeFile()).subscribe(response => {
      if (!response) return;
      this.assignData.update(ad => ({
        ...ad!,
        submit: response as Submit
      }));
      this.analysis.set({
        ...this.analysis()!,
        aiGen: undefined
      })
      this.selectedTabIndex.set(1);
      this.notify.success("提交成功！")
    });
  }
  
  /**
 * 流式加载基础分析（解题分析或知识点分析）
 * @param analysisType 'resolution' 解题分析 | 'knowledge' 知识点分析
 * @param reGen 是否重新生成
 */
loadAnalysisBasicStream = (
  analysisType: 'resolution' | 'knowledge' = 'resolution',
  reGen: boolean = false
) => {
  if (!this.courseId || !this.assignId) return;
  
  // 显示加载状态
  // this.notify.info(`正在流式生成${analysisType === 'resolution' ? '解题分析' : '知识点分析'}，您将实时看到内容...`);
  
  const sub = this.assignService.getAnalysisBasicStream$(
    this.courseId, 
    this.assignId, 
    analysisType
  ).subscribe({
    next: (data) => {
      // 实时更新数据
      const prev = this.analysis();
      const fieldName = analysisType === 'resolution' ? 'resolution' : 'knowledgeAnalysis';
      
      this.analysis.set({
        basic: { 
          ...(prev?.basic || {}),
          [fieldName]: data
        },
        aiGen: prev?.aiGen
      });
    },
    error: (err) => {
      console.error('流式分析失败:', err);
      this.notify.error(`生成失败: ${err.error || '网络错误'}`);
    },
    complete: () => {
      console.log('流式分析完成');
      // this.notify.success(`${analysisType === 'resolution' ? '解题分析' : '知识点分析'}生成完成！`);
    }
  });
  
  this.subs.push(sub);
}

/**
 * 流式加载AI生成分析（代码分析或学习建议）
 * @param analysisType 'code' 代码分析 | 'learning' 学习建议
 * @param notify 是否显示通知
 */
loadAnalysisAiGenStream = (
  analysisType: 'code' | 'learning' = 'code',
  notify: boolean = false
) => {
  if (!this.courseId || !this.assignId) return;
  
  // 检查截止时间
  if (this.assignData()?.ddl && this.assignData()?.ddl! > new Date()) {
    if (notify)
      this.notify.error("截止后才能查看提交分析哦", "生成禁止");
    return;
  }

  // 显示加载状态
  this.notify.info(`正在流式生成${analysisType === 'code' ? '代码分析' : '学习建议'}，您将实时看到内容...`);
  
  const sub = this.assignService.getAnalysisAiGenStream$(
    this.courseId, 
    this.assignId, 
    analysisType,
    notify
  ).subscribe({
    next: (data) => {
      // 实时更新数据
      const prev = this.analysis();
      const fieldName = analysisType === 'code' ? 'codeAnalysis' : 'learningSuggestions';
      
      this.analysis.set({
        basic: prev?.basic!,
        aiGen: {
          ...(prev?.aiGen || {}),
          [fieldName]: data
        }
      });
    },
    error: (err) => {
      console.error('流式AI分析失败:', err);
      // 错误已在 service 中处理，这里只需记录
    },
    complete: () => {
      console.log('流式AI分析完成');
      this.notify.success(`${analysisType === 'code' ? '代码分析' : '学习建议'}生成完成！`);
    }
  });
  
  this.subs.push(sub);
}

}

