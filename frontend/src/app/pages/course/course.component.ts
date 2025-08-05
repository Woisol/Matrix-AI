import { Component } from "@angular/core";
import { NzSplitterModule } from "ng-zorro-antd/splitter";
import { CourseInfoTabComponent } from "./components/course-info-tab.component";

@Component({
  selector: "app-course",
  imports: [NzSplitterModule, CourseInfoTabComponent],
  standalone: true,
  template: `
  <div class="course-con">
    <nz-splitter>
      <nz-splitter-panel nzMin="100px" nzDefaultSize="30%" [nzCollapsible]="true" class="col left">
        <course-info-tab [assigData]="assigData"/>
      </nz-splitter-panel>
      <nz-splitter-panel nzMin="200px" nzDefaultSize="70%" [nzCollapsible]="true" class="col right">
        right
      </nz-splitter-panel>
    </nz-splitter>
  </div>
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
  `]
})

export class CourseComponent {
  assigData = "hello";
}