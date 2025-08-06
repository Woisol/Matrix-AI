import { Component, Input, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { NzSplitterModule } from "ng-zorro-antd/splitter";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { AssigData } from "../../../api/type/assigment";
import { MarkdownModule } from "ngx-markdown";
import { DatePipe } from "@angular/common";

@Component({
  selector: "course-info-tab",
  imports: [NzSplitterModule, NzTabsModule, MarkdownModule, DatePipe],
  standalone: true,
  template: `
    <nz-tabs [nzSelectedIndex]="1">
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
          <div class="submit-info">
            <h4>提交信息</h4>
            @if (assigData!.submit?.time) {
              <p><strong>提交时间:</strong> {{ assigData!.submit!.time | date:'yyyy-MM-dd HH:mm:ss' }}</p>
            }
            @if (assigData!.submit?.score !== undefined) {
              <p><strong>得分:</strong> {{ getSubmitScore(assigData) }}</p>
            }
            @if (assigData!.submit?.submitCode) {
              <h4>提交代码</h4>
              <pre class="code-block">{{ assigData!.submit!.submitCode }}</pre>
            }
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
          @if (isValidMarkdown(assigData?.analysis)) {
            <markdown [data]="assigData!.analysis"></markdown>
          } @else {
            <div class="empty-content">
              <p>暂无题解内容</p>
            </div>
          }
        </nz-tab>
      }
    </nz-tabs>
  `,
  styles: [`
  .course-con{
    width: 100%;
    height: calc(100vh - var(--size-top-bar) - 20px);
    display: flex;
    padding: 10px;

    .col{
      &.left{
        width: 20%;
        height: 100%;
        background-color: #f0f2f5;
      }
      &.right{
        width: 80%;
        height: 100%;
      }
    }
  }

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
    margin-bottom: 16px;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 8px;
  }

  h4 {
    color: #595959;
    font-size: 16px;
    font-weight: 500;
    margin: 16px 0 8px 0;
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
  .submit-info {
    background: #fafafa;
    padding: 16px;
    border-radius: 6px;
    border: 1px solid #f0f0f0;

    p {
      margin: 8px 0;
      color: #595959;

      strong {
        color: #262626;
        margin-right: 8px;
      }
    }
  }

  /* 代码块样式 */
  .code-block {
    background: #f6f8fa;
    border: 1px solid #e1e4e8;
    border-radius: 6px;
    padding: 16px;
    font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.5;
    color: #24292e;
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  ::ng-deep .ant-tabs-content,::ng-deep .ant-tabs-tabpane{
    height: 100%;
  }
  `],
  // styleUrl
})
export class CourseInfoTabComponent implements OnInit, OnChanges {
  @Input() assigData!: AssigData | undefined;

  ngOnInit() {
    console.log('ngOnInit - assigData:', this.assigData);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['assigData']) {
      console.log('assigData changed:', changes['assigData'].currentValue);
    }
  }

  // 辅助方法：检查 markdown 内容是否有效
  isValidMarkdown(content: string | null | undefined): content is string {
    return content != null && typeof content === 'string' && content.trim().length > 0;
  }

  // 辅助方法：获取有效的分数
  getSubmitScore(assigData: AssigData | undefined): number | null {
    return assigData?.submit?.score ?? null;
  }

  // 辅助方法：获取提交时间
  getSubmitTime(assigData: AssigData | undefined): Date | null {
    return assigData?.submit?.time ?? null;
  }

  // 辅助方法：获取提交代码
  getSubmitCode(assigData: AssigData | undefined): string | null {
    return assigData?.submit?.submitCode ?? null;
  }
}