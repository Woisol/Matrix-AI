import { Component, Input, input } from "@angular/core";
import { NzSplitterModule } from "ng-zorro-antd/splitter";
import { NzTabsModule } from "ng-zorro-antd/tabs";

@Component({
  selector: "course-info-tab",
  imports: [NzSplitterModule, NzTabsModule],
  // standalone: true,
  template: `
    <nz-tabs>
      <nz-tab nzTitle="描述">
        abc
      </nz-tab>
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
  `],
})
export class CourseInfoTabComponent {
  @Input() assigData!: string;
}