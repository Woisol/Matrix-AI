import { Component, inject } from "@angular/core";
import { CourseInfo } from "../../services/course/course-store.service";
import { NzListModule } from "ng-zorro-antd/list";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconModule } from "ng-zorro-antd/icon";

@Component({
  selector: 'matrix-admin',
  imports: [NzListModule, NzButtonModule, NzIconModule],
  standalone: true,
  template: `
  <div class="admin-con">
    <h2>管理</h2>
    <span>此页面仅为方便数据处理，不做展示使用</span>
    <!-- <div class="grid-wrapper"> -->
    <section class="section">
      <nz-list [nzDataSource]="courseInfo.allCourseList" nzItemLayout="horizontal" [nzRenderItem]="allTpl" [nzSplit]="false">
      <ng-template #allTpl let-item>
        <nz-list-item class="course-item">
          <nz-list-item-meta [nzTitle]="allTitle" [nzDescription]="allDesc"></nz-list-item-meta>
          <ng-template #allTitle>
            <span class="course-name">{{ item.courseName }}</span>
          </ng-template>
          <ng-template #allDesc>
            <span class="course-progress" [class.completed]="item.completed">{{ item.completed ? '已完成' : '进行中' }}</span>
          </ng-template>
          <div class="right-tags">
            <button class="nz-icon-btn" nz-button><span class="nz-icon" nz-icon nzType="clock-circle" nzTheme="outline"></span></button>
            <button class="nz-icon-btn" nz-button nzType="primary" nzDanger="true" ><span class="nz-icon" nz-icon nzType="close" nzTheme="outline" ></span></button>
          </div>

        </nz-list-item>
      </ng-template>
      </nz-list>
      @if (courseInfo.allCourseList.length === 0) {
        <div class="empty">没有课程</div>
      }
    </section>
    <!-- </div> -->
</div>
`,
  styles: `
  .admin-con{
    width: 100%;
    max-width: 1080px;
    height: calc(100vh - var(--size-top-bar));
    padding: 20px 40px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
  }
  section{
    width: 100%;
    height: 100%;
    padding: 12px 16px;
    border: 1px solid #eee;
    border-radius: var(--size-radius);
    display:flex;
    flex-direction:column;
    gap:12px;

      .right-tags{
        margin-left:auto;
        display:flex;
        gap:8px;
        align-items:center;
      }

  }
  .course-item{
    padding:12px 20px !important;
    border-radius:var(--size-radius-sm);
    transition:background .25s ease;
    cursor:pointer;
  }
  .course-item:hover{ background:var(--color-primary-light); }

  /*--- patch ---*/
  .nz-icon-btn{
    display: relative;
    border-radius: 10px;

    .nz-icon{
      width: 1em;
      height: 1em;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  }
`,
})
export class AdminComponent {
  courseInfo = inject(CourseInfo)
}
