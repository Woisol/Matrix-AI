import { Component, Input } from "@angular/core";
import { MdCodeContent, Complexity, MdContent } from "../../../api/type/assigment";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { MarkdownComponent } from "ngx-markdown";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconModule } from "ng-zorro-antd/icon";

export interface MatrixAnalysisProps {
  content: {
    title: string
    content: MdCodeContent
    complexity?: Complexity
  }[]
  summary?: MdContent
  showInEditor?: boolean
}

@Component({
  selector: "matrix-analyse",
  imports: [NzTabsModule, MarkdownComponent, NzButtonModule, NzIconModule],
  template: `
    <nz-tabs>
      @for (tab of analysis?.content; track $index) {
        <nz-tab [nzTitle]="tab.title">
          <div class="analyse-con">
            <div class="complexity">
              @if (tab.complexity) {
                <span><nz-icon nzType="clock-circle" nzTheme="outline" /> {{ tab.complexity.time }}</span>
                <span><nz-icon nzType="appstore" nzTheme="outline" /> {{ tab.complexity.space }}</span>
              }
            </div>
            <markdown class="markdown-patched" [data]="tab.content || '这里没有内容呢'" ></markdown>
          </div>
        </nz-tab>
      }
    </nz-tabs>
    <summary class="analyse-summary">
      @if (analysis?.summary) {
        <markdown class="markdown-patched" [data]="analysis?.summary"></markdown>
      }
    </summary>
  `,
  styles: [`
    .analyse-con {
      width: 100%;
      max-height: 100%;
      padding: 16px;
      background: #f0f2f5;
      border-radius: var(--size-radius-sm);
      display: relative;

      .complexity {
        span {
          text-align: center;
          &:not(:last-child) {
            margin-right: 8px;
          }
        }
      }
    }
    .analyse-summary {
      margin-top: 10px;
      padding: 8px 16px;
      background: #fafafa;
      border-left: 2px solid var(--color-primary);
      border-radius: var(--size-radius-sm);
    }
  `]
})
export class MatrixAnalyseComponent {
  @Input() analysis: MatrixAnalysisProps | undefined = undefined
}