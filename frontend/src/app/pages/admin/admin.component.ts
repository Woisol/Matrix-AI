import { Component, inject } from '@angular/core';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CourseInfo } from '../../services/course/course-store.service';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { AssignId, CourseId } from '../../api/type/general';
import { CourseApi } from '../../services/course/course-api.service';

@Component({
  selector: 'app-admin',
  imports: [NzListModule, NzCollapseModule, NzButtonModule, NzIconModule, NzBadgeModule, NzModalModule],
  standalone: true,
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <h2>
          管理中心
        </h2>
        <p class="admin-description">此页面仅为方便数据管理，不做展示使用</p>
        <button style="margin-right: 8px" (click)="handleAddCourse()">添加课程</button>
        <button (click)="handleAddAssignment()">添加作业</button>
        <small>（请提前复制好课程 ID）</small>
      </div>

      <div class="course-management">
        <nz-list nzBordered nzSize="small" class="admin-course-list">
          @for(course of courseInfo.allCourseList; track course.courseId) {
            <nz-list-item class="course-item">
              <nz-collapse nzGhost>
                <nz-collapse-panel
                  [nzHeader]="courseHeaderTpl"
                  [nzExtra]="courseExtraTpl"
                  [nzActive]="true">

                  <!-- 课程头部模板 -->
                  <ng-template #courseHeaderTpl>
                    <div class="course-header" (click)="copyCourseId(course.courseId, $event)">
                      <span nz-icon nzType="book" nzTheme="outline" class="course-icon"></span>
                      <span class="course-name">{{ course.courseName }}</span>
                      <span class="course-id-hint">(点击复制课程ID)</span>
                    </div>
                  </ng-template>

                  <!-- 课程管理按钮模板 -->
                  <ng-template #courseExtraTpl>
                    <div class="course-actions" (click)="$event.stopPropagation()">
                      <nz-badge
                        [nzCount]="course.assignment.length || 0"
                        [nzShowZero]="true"
                        nzSize="small"
                        class="assignment-count">
                      </nz-badge>
                      <button
                        nz-button
                        nzType="primary"
                        nzSize="small"
                        nzGhost
                        class="action-btn upload-btn"
                        (click)="handleUploadCourse(course.courseId)"
                        title="上传课程">
                        <span nz-icon nzType="upload" nzTheme="outline"></span>
                      </button>
                      <button
                        nz-button
                        nzType="primary"
                        nzDanger
                        nzSize="small"
                        nzGhost
                        class="action-btn delete-btn"
                        (click)="handleDeleteCourse(course.courseId)"
                        title="删除课程">
                        <span nz-icon nzType="delete" nzTheme="outline"></span>
                      </button>
                    </div>
                  </ng-template>

                  <!-- 作业列表 -->
                  <div class="assignment-list">
                    @for(assignment of course.assignment; track assignment.assignId) {
                      <nz-list nzSize="small" class="nested-assignment-list">
                        <nz-list-item class="assignment-item" (click)="copyAssignId(assignment.assignId)">
                          <div class="assignment-header">
                            <span nz-icon nzType="code" nzTheme="outline" class="assignment-icon"></span>
                            <span class="assignment-name">{{ assignment.assignmentName }}</span>
                            <span class="assignment-id-hint">(点击复制作业ID)</span>
                          </div>

                          <div class="assignment-actions" (click)="$event.stopPropagation()">
                            <button
                              nz-button
                              nzType="primary"
                              nzSize="small"
                              nzGhost
                              class="action-btn upload-btn"
                              (click)="handleUploadAssignment(assignment.assignId)"
                              title="上传作业">
                              <span nz-icon nzType="upload" nzTheme="outline"></span>
                            </button>
                            <button
                              nz-button
                              nzType="primary"
                              nzDanger
                              nzSize="small"
                              nzGhost
                              class="action-btn delete-btn"
                              (click)="handleDeleteAssignment(course.courseId, assignment.assignId)"
                              title="删除作业">
                              <span nz-icon nzType="delete" nzTheme="outline"></span>
                            </button>
                          </div>
                        </nz-list-item>
                      </nz-list>
                    }

                    @if (!course.assignment || course.assignment.length === 0) {
                      <div class="empty-assignment">
                        <span nz-icon nzType="inbox" nzTheme="outline"></span>
                        <span>暂无作业</span>
                      </div>
                    }
                  </div>
                </nz-collapse-panel>
              </nz-collapse>
            </nz-list-item>
          }

          <!-- 空状态 -->
          @if (!courseInfo.allCourseList || courseInfo.allCourseList.length === 0) {
            <nz-list-item>
              <nz-list-item-meta
                nzTitle="暂无课程"
                nzDescription="还没有创建任何课程"
                [nzAvatar]="emptyAvatar">
                <ng-template #emptyAvatar>
                  <span nz-icon nzType="inbox" nzTheme="outline"></span>
                </ng-template>
              </nz-list-item-meta>
            </nz-list-item>
          }
        </nz-list>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      width: 100%;
      max-width: 1080px;
      margin: 0 auto;
      padding: 20px 40px;
    }

    .admin-header {
      margin-bottom: 24px;

      h2 {
        margin: 0 0 8px 0;
        font-size: 24px;
        font-weight: 600;
        color: #262626;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .admin-description {
        margin: 0;
        color: #8c8c8c;
        font-size: 14px;
      }
    }

    .admin-course-list {
      background: #fff;
      border-radius: 6px;

      .course-item {
        width: 100%;
        border: none;
        padding: 0;

        ::ng-deep .ant-collapse {
          width: 100%;
          background: transparent;
          border: none;

          .ant-collapse-item {
            border: none;

            &:last-child {
              border-radius: 0;
            }

            .ant-collapse-header {
              padding: 16px 12px;
              border-radius: 0;

              &:hover {
                background-color: #f5f5f5;
              }
            }

            .ant-collapse-content {
              border: none;
              background: #fafafa;

              .ant-collapse-content-box {
                padding: 0 12px 16px 12px;
              }
            }
          }
        }
      }
    }

    .course-header {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      flex: 1;

      .course-icon {
        color: #1890ff;
        font-size: 16px;
      }

      .course-name {
        font-weight: 500;
        color: #262626;
        font-size: 16px;
      }

      .course-id-hint {
        font-size: 12px;
        color: #8c8c8c;
        margin-left: auto;
      }

      &:hover {
        .course-name {
          color: #1890ff;
        }
      }
    }

    .course-actions {
      display: flex;
      align-items: center;
      gap: 8px;

      .assignment-count {
        margin-right: 8px;
      }
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      border-radius: 4px;

      span {
        font-size: 14px;
      }

      &.upload-btn:hover {
        background-color: #e6f7ff;
        border-color: #1890ff;
      }

      &.delete-btn:hover {
        background-color: #fff2f0;
        border-color: #ff7875;
      }
    }

    .assignment-list {
      .nested-assignment-list {
        margin-bottom: 8px;
        background: #fff;
        border-radius: 4px;
        border: 1px solid #f0f0f0;

        &:last-child {
          margin-bottom: 0;
        }

        .assignment-item {
          width: 100%;
          padding: 0;
          cursor: pointer;
          transition: background-color 0.2s;

          &:hover {
            background-color: #f8f9fa;
          }

          .assignment-header {
            padding: 12px 16px;
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1;

            .assignment-icon {
              color: #52c41a;
              font-size: 14px;
            }

            .assignment-name {
              font-weight: 400;
              color: #595959;
              font-size: 14px;
            }

            .assignment-id-hint {
              font-size: 11px;
              color: #bfbfbf;
              margin-left: auto;
            }
          }

          &:hover .assignment-name {
            color: #52c41a;
          }
        }
      }
    }

    .assignment-actions {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    .empty-assignment {
      text-align: center;
      padding: 20px;
      color: #bfbfbf;
      font-size: 14px;

      span {
        display: block;

        &:first-child {
          font-size: 24px;
          margin-bottom: 8px;
        }
      }
    }
  `]
})
export class AdminComponent {
  courseInfo = inject(CourseInfo);
  courseApi = inject(CourseApi)
  message = inject(NzMessageService);

  modal = inject(NzModalService);
  // confirm = inject(NzModalService).confirm;

  /**
   * 复制课程ID到剪贴板
   */
  copyCourseId(courseId: string, event: Event) {
    event.stopPropagation();
    navigator.clipboard.writeText(courseId).then(() => {
      this.message.success(`课程ID已复制: ${courseId}`);
    }).catch(() => {
      this.message.error('复制失败，请手动复制');
    });
  }

  /**
   * 复制作业ID到剪贴板
   */
  copyAssignId(assignId: string) {
    navigator.clipboard.writeText(assignId).then(() => {
      this.message.success(`作业ID已复制: ${assignId}`);
    }).catch(() => {
      this.message.error('复制失败，请手动复制');
    });
  }

  handleAddCourse() {

  }

  /**
   * 处理课程上传
   */
  handleUploadCourse(courseId: CourseId) {
    console.log('Upload course:', courseId);
    this.message.info('课程上传功能待实现');
    // TODO: 实现课程上传逻辑
  }

  /**
   * 处理课程删除
   */
  handleDeleteCourse(courseId: CourseId) {
    this.modal.confirm({
      nzTitle: '确认删除课程',
      nzContent: `您确定要删除课程(${courseId})吗？`,
      nzOkDanger: true,
      nzClosable: false,
      nzOkText: '删除',
      nzOnOk: () => {
        this.courseApi.deleteCourse$(courseId).subscribe(success => {
          if (success) {
            this.message.success(`课程(${courseId})已删除`);
            window.location.reload();
          }
        });
      }
    });
  }

  handleAddAssignment() { }

  /**
   * 处理作业上传
   */
  handleUploadAssignment(assignId: AssignId) {
    console.log('Upload assignment:', assignId);
    this.message.info('作业上传功能待实现');
    // TODO: 实现作业上传逻辑
  }

  /**
   * 处理作业删除
   */
  handleDeleteAssignment(courseId: CourseId, assignId: AssignId) {
    this.modal.confirm({
      nzTitle: '确认删除作业',
      nzContent: `您确定要删除作业(${assignId})吗？`,
      nzOkDanger: true,
      nzClosable: false,
      nzOkText: '删除',
      nzOnOk: () => {
        this.courseApi.deleteAssignment$(courseId, assignId).subscribe(success => {
          if (success) {
            this.message.success(`作业(${assignId})已删除`);
            window.location.reload();
          }
        });
      }
    });
  }
}
