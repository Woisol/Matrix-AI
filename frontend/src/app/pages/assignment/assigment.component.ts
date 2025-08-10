import { Component, signal, WritableSignal } from "@angular/core";
import { NzSplitterModule } from "ng-zorro-antd/splitter";
import { CourseInfoTabComponent } from "./components/course-info-tab.component";
import { testAssigData } from "../../api/test/assig";
import { AssigData } from "../../api/type/assigment";
import { CodeEditorComponent } from "./components/code-editor.component";

@Component({
  selector: "app-assignment",
  imports: [NzSplitterModule, CourseInfoTabComponent, CodeEditorComponent],
  standalone: true,
  template: `
  <div class="assignment-con">
    <nz-splitter>
      <nz-splitter-panel nzMin="100px" nzDefaultSize="30%" [nzCollapsible]="true">
        <course-info-tab [assigData]="assigData()"/>
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

export class AssignmentComponent {
  constructor() {
    let assigData = testAssigData
    this.assigData.set(assigData)
    this.code.set(assigData.submit?.submitCode[0]?.content ?? assigData.assigOriginalCode?.[0]?.content ?? '');
  }
  assigData: WritableSignal<AssigData | undefined> = signal(undefined);
  code: WritableSignal<string> = signal('');
}