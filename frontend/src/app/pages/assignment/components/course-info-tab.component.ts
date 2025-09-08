import { Component, Input, OnInit, OnChanges, SimpleChanges, signal, } from "@angular/core";
import { NzSplitterModule } from "ng-zorro-antd/splitter";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { Analysis, AssignData } from "../../../api/type/assigment";
import { MarkdownModule } from "ngx-markdown";
import { DatePipe } from "@angular/common";
import { NzProgressModule } from "ng-zorro-antd/progress";
import { NzCollapseModule } from "ng-zorro-antd/collapse";
import { MatrixAnalyseComponent } from "./matrix-analyse.component";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzTooltipModule } from "ng-zorro-antd/tooltip";
import { SubmitScoreComponent } from "./submit-score.component";

@Component({
  selector: "course-info-tab",
  imports: [NzSplitterModule, NzTabsModule, MarkdownModule, DatePipe, NzProgressModule, NzCollapseModule, MatrixAnalyseComponent, NzIconModule, NzTooltipModule, SubmitScoreComponent],
  standalone: true,
  template: `
    <nz-tabs class="tab-expend" [(nzSelectedIndex)]="selectedTabIndex">
      <nz-tab nzTitle="描述">
        @if (assignData) {
          <h3>{{assignData.title}}</h3>
          @if (assignData.description && assignData.description.trim()) {
            <markdown class="markdown-patched" [data]="assignData.description"></markdown>
          } @else {
            <div class="empty-content">
              <p>暂无描述内容</p>
            </div>
          }
        } @else {
          <div class="loading-content">
            <p>加载中...</p>
          </div>
        }
      </nz-tab>

      <nz-tab nzTitle="提交">
        @if (assignData?.submit) {
          <div class="submit-panel">
            <p style="margin: 0;">
              <small>Powered by Matrix</small>
            </p>
            <submit-score [score]="assignData!.submit?.score" [submitTime]="assignData!.submit?.time"></submit-score>
            <!-- 测试样例 -->
            <nz-collapse class="test-sample-con">
            @for (testSample of assignData?.submit?.testSample; track $index) {
              <nz-collapse-panel [nzHeader]="'测试样例 ' + ($index + 1)" [nzActive]="true">
                <h4>标准输入</h4>
                <code>{{testSample.input}}</code>
                <h4>实际输出</h4>
                <code>{{testSample.realOutput}}</code>
                <h4>期望输出</h4>
                <code>{{testSample.expectOutput}}</code>
              </nz-collapse-panel>
            }
            </nz-collapse>
          </div>
        }
        @else {
          <div class="empty-content">
            <p>还没有提交过哦</p>
          </div>
        }
      </nz-tab>

      @if (assignData?.submit && ddlGrant() && analysis) {
        <nz-tab nzTitle="AI 分析">
          @if (!analysis) {
            <div class="empty-content">
              <p>暂无题解内容</p>
            </div>
          } @else {
            @if(analysis.basic.resolution) {
              <h4>参考题解</h4>
              <matrix-analyse [analysis]="analysis.basic.resolution"></matrix-analyse>
            }
            @if(analysis.basic.knowledgeAnalysis) {
              <h4>知识点分析</h4>
              <matrix-analyse [analysis]="analysis.basic.knowledgeAnalysis"></matrix-analyse>
            }
            @if(!analysis.aiGen){
              <section class="aiGen">
                <p>想了解你提交代码的质量？<br/>想进一步学习更多相关知识点？</p>
                <button (click)="onAnalysisAiGenRequest(true)">AI 个性分析</button>
              </section>
            }
            @else{
              @if(analysis.aiGen.codeAnalysis) {
                <h4>AI 代码分析</h4>
                <matrix-analyse [analysis]="analysis.aiGen.codeAnalysis"></matrix-analyse>
              }
              @if(analysis.aiGen.learningSuggestions) {
                <h4>知识点学习建议</h4>
                <matrix-analyse [analysis]="analysis.aiGen.learningSuggestions"></matrix-analyse>
              }
            }
            <section class="reGen">
              <button (click)="handleAnalysisRegen()" nz-tooltip nzTooltipTitle="重新生成基础分析"><span nz-icon nzType="reload" nzTheme="outline"></span></button>
            </section>
          }
        </nz-tab>
      }
    </nz-tabs>
  `,
  styles: [`
  :host{ display:block; height:100%; }

  /* 仅作用于当前组件模板里标记了 class="tab-expend" 的最外层 nz-tabs，不影响内层后续动态插入的其他 ant-tabs */
  :host ::ng-deep nz-tabs.tab-expend{
    height:100%;
    display:flex;
    flex-direction:column;
  }
  /* 只匹配直接子元素，防止级联到更深层 ant-tabs */
  :host ::ng-deep nz-tabs.tab-expend > .ant-tabs-nav{ flex:0 0 auto; }
  :host ::ng-deep nz-tabs.tab-expend > .ant-tabs-content-holder{
    flex:1 1 auto;
    min-height:0;
    overflow:hidden;
  }
  :host ::ng-deep nz-tabs.tab-expend > .ant-tabs-content-holder > .ant-tabs-content{
    height:100%;
    display:flex; /* 使首层 pane 高度拉伸 */
  }
  :host ::ng-deep nz-tabs.tab-expend > .ant-tabs-content-holder > .ant-tabs-content > .ant-tabs-tabpane{
    height:100%;
    overflow:auto;
    padding-right:8px;
    flex:1 1 auto;
    min-width:0;
  }
  }

  /* 内容区域样式 */
  h3 {
    color: #262626;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 8px;
  }
  h4{
    font-size: 20px;
    margin: 0;
  }

  /* 空状态样式 */
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

  /* 加载状态样式 */
  .loading-content {
    text-align: center;
    padding: 40px 20px;
    color: #1890ff;

    p {
      font-size: 14px;
      margin: 0;
    }
  }

  /* 提交信息样式 */

  .submit-panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  /*::ng-deep .ant-tabs-content,::ng-deep .ant-tabs-tabpane{
    height: 100%;
  }*/

  .test-sample-con{
    border-radius: var(--size-radius-sm);

      h4{
        margin:1em 0 0 0;
        &:first-child {
          margin: 0;}
      }
  }

  code{
    display: block;
    background: #f6f8fa;
    border: 1px solid #e1e4e8;
    border-radius: var(--size-radius-sm);
    padding: 8px;
    font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.5;
    color: #24292e;
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .aiGen{
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    p{
      text-align: center;
      margin: 0;
    }
    button{
      box-shadow: 0 2px 8px var(--color-primary);
    }

  }

  .reGen{
    position: absolute;
    bottom: 16px;
    right: 16px;
    z-index: 10;
    button{
      box-shadow: 0 2px 8px var(--color-shadow);
    }
  }
  `],
  // styleUrl
})
export class CourseInfoTabComponent implements OnInit, OnChanges {
  @Input() assignData!: AssignData | undefined;
  @Input() analysis!: Analysis | undefined;
  @Input() handleAnalysisRegen = () => { };
  @Input() onAnalysisAiGenRequest = (notify: boolean = false) => { };
  @Input() selectedTabIndex = signal(0);

  //! 暂不考虑更新，要看自己刷新⚫
  ddlGrant = signal(!this.assignData?.ddl || this.assignData?.ddl! > new Date());

  ngOnInit() {
    // console.log('ngOnInit - assignData:', this.assignData);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['assignData']) {
      this.ddlGrant.set(!this.assignData?.ddl || this.assignData?.ddl! > new Date());
      // console.log('assignData changed:', changes['assignData'].currentValue);
    }
  }

  // 辅助方法：检查 markdown 内容是否有效
  isValidMarkdown(content: string | null | undefined): content is string {
    return content != null && typeof content === 'string' && content.trim().length > 0;
  }
  progressScoreFormat = (percent: number) => `${percent}分`;

}
