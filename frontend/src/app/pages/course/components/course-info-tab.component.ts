import { Component, Input, OnInit, OnChanges, SimpleChanges, signal } from "@angular/core";
import { NzSplitterModule } from "ng-zorro-antd/splitter";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { AssigData, SubmitScoreStatus } from "../../../api/type/assigment";
import { MarkdownModule } from "ngx-markdown";
import { DatePipe } from "@angular/common";
import { NzProgressModule } from "ng-zorro-antd/progress";
import { getSubmitScoreStatus } from "../../../api/util/assig";
import { NzCollapseComponent, NzCollapseModule } from "ng-zorro-antd/collapse";
import { MatrixAnalyseComponent } from "./matrix-analyse.component";

@Component({
  selector: "course-info-tab",
  imports: [NzSplitterModule, NzTabsModule, MarkdownModule, DatePipe, NzProgressModule, NzCollapseModule, MatrixAnalyseComponent],
  standalone: true,
  template: `
    <nz-tabs [nzSelectedIndex]="2">
      <nz-tab nzTitle="描述">
        @if (assigData) {
          <h3>{{assigData.title}}</h3>
          @if (assigData.description && assigData.description.trim()) {
            <markdown class="markdown-patched" [data]="assigData.description"></markdown>
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
        @if (assigData?.submit) {
          <div class="submit-panel">
            <p style="margin: 0;">
              <small>Powered by Matrix</small>
            </p>
            <div class="submit-score">
              <nz-progress nzType="dashboard" [nzWidth]="80" [nzPercent]="assigData!.submit?.score ?? 0" [nzShowInfo]="true" [nzStrokeColor]="{ '10%': '#ee7373ff', '100%': '#97e973ff' }" [nzFormat]="progressScoreFormat" />
              <strong class="score-status">
                {{
                  submitScoreStatus() === 'not-submitted' ? '🤔你还没有提交呢' :
                  submitScoreStatus() === 'not-passed' ? '✏️还没有通过本题呢，\n再检查一下叭~' :
                  submitScoreStatus() === 'passed' ? '💪离满分就差一点点啦！\n再接再厉哦~' :
                  '🎉恭喜你，满分了！\n请继续保持呢~'
                }}
              </strong>
            </div>
            <p><strong>提交时间:</strong> {{ assigData!.submit!.time | date:'yyyy-MM-dd HH:mm:ss' }}</p>
            <!-- 测试样例 -->
            <nz-collapse class="test-sample-con">
            @for (testSample of assigData?.submit?.testSample; track $index) {
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

      @if (assigData?.analysis) {
        <nz-tab nzTitle="分析">
          @if (!assigData?.analysis) {
            <div class="empty-content">
              <p>暂无题解内容</p>
            </div>
          } @else {
            @if(assigData!.analysis!.basic.resolution) {
              <h4>参考题解</h4>
              <matrix-analyse [analysis]="assigData!.analysis?.basic?.resolution"></matrix-analyse>
            }
            @if(assigData!.analysis!.basic.knowledgeAnalysis) {
              <h4>知识点分析</h4>
              <matrix-analyse [analysis]="assigData!.analysis?.basic?.knowledgeAnalysis"></matrix-analyse>
            }
            @if(!assigData!.analysis?.aiGen){
              <section class="aiGen">
                <p>想了解你提交代码的质量？<br/>想进一步学习更多相关知识点？</p>
                <button>AI 个性分析</button>
              </section>
            }
            @else{
              @if(assigData!.analysis?.aiGen?.codeAnalysis) {
                <h4>AI 代码分析</h4>
                <matrix-analyse [analysis]="assigData!.analysis?.aiGen?.codeAnalysis"></matrix-analyse>
              }
              @if(assigData!.analysis?.aiGen?.learningSuggestions) {
                <h4>知识点学习建议</h4>
                <matrix-analyse [analysis]="assigData!.analysis?.aiGen?.learningSuggestions"></matrix-analyse>
              }
            }
          }
        </nz-tab>
      }
    </nz-tabs>
  `,
  styles: [`
  /* Tabs 容器样式 */
  ::ng-deep .ant-tabs {
    height: 100%;

    .ant-tabs-content-holder {
      padding: 16px;
      max-height: calc(100vh - 120px);
      overflow-y: auto;
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

  .submit-score {
    background: #fafafa;
    padding: 1em;
    border-radius: var(--size-radius);
    border: 1px solid #fafafa;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    .score-status {
      /*width: calc(100% - 100px);
      height: 100%;
      padding: 8px 0;
      display: inline-block;*/
      color: #595959;
      white-space: pre-wrap;

      strong {
        color: #262626;
        margin-right: 8px;
      }
    }
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
  }
  `],
  // styleUrl
})
export class CourseInfoTabComponent implements OnInit, OnChanges {
  @Input() assigData!: AssigData | undefined;

  submitScoreStatus = signal<SubmitScoreStatus>('not-submitted')

  ngOnInit() {
    console.log('ngOnInit - assigData:', this.assigData);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['assigData']) {
      this.submitScoreStatus.set(this.assigData?.submit ? getSubmitScoreStatus(this.assigData.submit.score) : 'not-submitted');
      console.log('assigData changed:', changes['assigData'].currentValue);
    }
  }

  // 辅助方法：检查 markdown 内容是否有效
  isValidMarkdown(content: string | null | undefined): content is string {
    return content != null && typeof content === 'string' && content.trim().length > 0;
  }
  progressScoreFormat = (percent: number) => `${percent}分`;

}