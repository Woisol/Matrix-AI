import { Component, inject, signal, computed } from '@angular/core';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgIf } from '@angular/common';
import { CourseInfo } from '../../services/course/course-store.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [NzListModule, NzTagModule, NzBadgeModule, NzIconModule, RouterLink],
  template: `
  <div class="course-list-page">
    <header class="page-header">
      <h2>课程列表</h2>
      <summary class="summary">
        <span>全部课程: {{ allCourses().length }}</span>
        <span>进行中: {{ ongoingCourses().length }}</span>
        <span>已完成: {{ completedCourses().length }}</span>
      </summary>
    </header>

    <section class="section">
      <h3 class="section-title">进行中的课程</h3>
      <nz-list [nzDataSource]="ongoingCourses()" nzItemLayout="horizontal" [nzRenderItem]="ongoingTpl" [nzSplit]="false" [nzLoading]="false">
      <ng-template #ongoingTpl let-item>
        <nz-list-item class="course-item" [routerLink]="['/course/private', item.courseId]">
          <nz-list-item-meta
            [nzTitle]="titleTpl"
            [nzDescription]="descTpl">
          </nz-list-item-meta>
          <ng-template #titleTpl>
            <span class="course-name">{{ item.courseName }}</span>
          </ng-template>
          <ng-template #descTpl>
            <span class="course-progress" [class.completed]="item.completed">{{ item.completed ? '已完成' : '进行中' }}</span>
          </ng-template>
          <div class="right-tags">
            @if (item.completed) {
              <nz-tag nzColor="green">已完成</nz-tag>
            } @else {
              <nz-tag nzColor="blue">学习中</nz-tag>
            }
          </div>
        </nz-list-item>
      </ng-template>
      </nz-list>
      @if (ongoingCourses().length === 0) {
        <div class="empty">暂无进行中课程</div>
      }
    </section>

    <section class="section">
      <h3 class="section-title">已完成课程</h3>
      <nz-list [nzDataSource]="completedCourses()" nzItemLayout="horizontal" [nzRenderItem]="allTpl" [nzSplit]="false">
      <ng-template #allTpl let-item>
        <nz-list-item class="course-item" [routerLink]="['/course/private', item.courseId]">
          <nz-list-item-meta [nzTitle]="allTitle" [nzDescription]="allDesc"></nz-list-item-meta>
          <ng-template #allTitle>
            <span class="course-name">{{ item.courseName }}</span>
          </ng-template>
          <ng-template #allDesc>
            <span class="course-progress" [class.completed]="item.completed">{{ item.completed ? '已完成' : '进行中' }}</span>
          </ng-template>
          <div class="right-tags">
            @if (item.completed) {
              <nz-tag nzColor="green">已完成</nz-tag>
            } @else {
              <nz-tag nzColor="blue">学习中</nz-tag>
            }
          </div>
        </nz-list-item>
      </ng-template>
      </nz-list>
      @if (allCourses().length === 0) {
        <div class="empty">暂无课程</div>
      }
    </section>
  </div>
  `,
  styles: [`
  .course-list-page{ max-width: 1080px; margin:0 auto; padding:20px 32px 40px; display:flex; flex-direction:column; gap:32px; }
  .page-header{ display:flex; align-items:center; gap:24px; flex-wrap:wrap; }
  .page-header h2{ font-size:24px; font-weight:600; margin:0; }
  summary{ display:flex; gap:8px; font-size:13px; color:#595959; }
  .section{ display:flex; flex-direction:column; gap:12px; }
  .section-title{ font-size:16px; font-weight:600; }
  nz-list{ background:#fff; border-radius:var(--size-radius-sm); padding:4px 0; box-shadow:0 2px 4px rgba(0,0,0,0.04); overflow: hidden;}
  .course-item{
    padding:12px 20px !important;
    border-radius:var(--size-radius-sm);
    transition:background .25s ease;
    cursor:pointer;
  }
  .course-item:hover{ background:var(--color-primary-light); }
  .course-name{ font-weight:500; color:#262626; }
  .course-progress{ font-size:12px; color:#8c8c8c; }
  .course-progress.completed{ color:#52c41a; }
  .right-tags{ margin-left:auto; display:flex; gap:8px; align-items:center; }
  .empty{ padding:16px; text-align:center; color:#8c8c8c; font-size:13px; }
  @media (max-width: 640px){ .course-item{ padding:12px 16px !important; } .page-header{ flex-direction:column; align-items:flex-start; gap:8px; } }
  `]
})
export class CourseListComponent {
  private courseInfo = inject(CourseInfo);

  allCourses = signal(this.courseInfo.allCourseList);
  ongoingCourses = computed(() => this.allCourses().filter(c => !c.completed));
  completedCourses = computed(() => this.allCourses().filter(c => c.completed));
}
