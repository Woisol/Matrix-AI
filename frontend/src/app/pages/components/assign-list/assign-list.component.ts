import { DatePipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzListModule } from "ng-zorro-antd/list";
import { NzSpaceModule } from "ng-zorro-antd/space";
import { NzTagModule } from "ng-zorro-antd/tag";
import { CourseInfo } from "../../../services/course/course-store.service";
import { AllCourse, TodoCourse } from "../../../api/type/course";

@Component({
  selector: 'app-assign-list',
  imports: [DatePipe, NzListModule, RouterLink, NzTagModule, NzIconModule, NzSpaceModule],
  template: `
  <nz-list nzSize="small" class="assignment-list">
    @for(assignment of course?.assignment; track assignment.assignId) {
      <nz-list-item class="assignment-item" [routerLink]="['/course/private', course?.courseId, 'assignment', assignment.assignId]">
        <!-- <nz-list-item-meta
        [nzTitle]="assignmentTitleTpl"
          [nzDescription]="assignmentDescTpl"
          [nzAvatar]="assignmentAvatarTpl"> -->

          <!-- 作业类型图标 -->
          <!-- <ng-template #assignmentAvatarTpl>
            <nz-badge [nzDot]="isOverdue(assignment.ddl)" nzStatus="error">
              <span
                nz-icon
                [nzType]="assignment.type === 'program' ? 'code' : 'file-text'"
                nzTheme="outline"
                class="assignment-icon"
                [class.program-type]="assignment.type === 'program'"
                [class.choose-type]="assignment.type === 'choose'">
              </span>
            </nz-badge>
          </ng-template> -->

          <!-- 作业标题 -->
          <!-- <ng-template #assignmentTitleTpl> -->
            <div class="assignment-title">
              <h3 class="assignment-name">{{ assignment.assignmentName }}</h3>
              @if (assignment.score !== null) {
                <nz-tag [nzColor]="assignment.score >= 60? 'green':'orange'" class="score-tag">
                  {{ assignment.score }} 分
                </nz-tag>
              } @else {
                <nz-tag nzColor="orange" class="status-tag">
                  未提交
                </nz-tag>
              }
              <span class="assignment-type">
                <nz-icon nzType="tag" nzTheme="outline" />
                {{ assignment.type === 'program' ? '实时编程题' : '选择题' }}
              </span>
            </div>
            <div class="assignment-desc">
              <nz-space>
                <span *nzSpaceItem class="assignment-ddl" [class.no-ddl]="!assignment.ddl" [class.overdue]="isOverdue(assignment.ddl)">
                  <nz-icon nzType="clock-circle" nzTheme="outline"/>
                  @if(!assignment.ddl){
                    不截止
                  }
                  @else if (isOverdue(assignment.ddl)) {
                    已截止
                  }
                  @else{
                    截止于：{{ assignment.ddl | date:'MM-dd HH:mm' }}
                  }
                  </span>
              </nz-space>
            </div>
          <!-- </ng-template> -->

          <!-- 作业描述信息 -->
          <!-- <ng-template #assignmentDescTpl> -->
          <!-- </ng-template> -->
        <!-- </nz-list-item-meta> -->

        <!-- 作业操作按钮 -->
        <!-- <ul nz-list-item-actions>
          <nz-list-item-action>
            <button nz-button nzType="primary" nzSize="small" nzGhost>
              <span nz-icon nzType="edit" nzTheme="outline"></span>
              {{ assignment.score !== null ? '查看' : '开始' }}
            </button>
          </nz-list-item-action>
        </ul> -->
      </nz-list-item>
    }

    <!-- 空状态 -->
    @if (!course?.assignment?.length) {
      <nz-list-item>
        <nz-list-item-meta
          nzDescription="暂无作业"
          [nzAvatar]="nzAvatar">
          <ng-template #nzAvatar>
            <nz-icon nzType="inbox" nzTheme="outline" class="empty-icon"/>
          </ng-template>
        </nz-list-item-meta>
      </nz-list-item>
    }
  </nz-list>
  `,
  styles: `

  .assignment-list {
    ::ng-deep .ant-list-item {
      padding: 12px 24px;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: #fafafa;
      }
    }
  }

  .assignment-item {
    .assignment-title {
      display: flex;
      align-items: center;
      gap: 8px;

      .assignment-name {
        margin: 0;
        font-weight: 500;
        color: #262626;
      }

      .score-tag, .status-tag {
        margin: 0;
        padding: 2px 5px;
        font-size: 11px;
        line-height: 1.2;
      }
    }

    .assignment-type {
      color: #8c8c8c;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .assignment-desc {
      height: 100%;
      line-height: 12px;


      .assignment-ddl {
        /*color: #fa8c16;*/
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 4px;

        &.overdue {
          color: #ff4d4f;
          font-weight: 500;
        }
        &.no-ddl{
          color: #aaa;
        }
      }
    }
  }
  `
})
export class AssignListComponent {
  @Input() course: AllCourse | TodoCourse | undefined;
  isOverdue(ddl: Date | null): boolean {
    if (!ddl) return false;
    return new Date() > new Date(ddl);
  }

}