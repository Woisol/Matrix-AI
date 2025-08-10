import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseInfo } from '../../services/course.service';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgIf } from '@angular/common';
import { testAllAssigns } from '../../api/test/course';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [NzListModule, NzTagModule, NzIconModule, RouterLink, NgIf],
  template: `
  <div class="course-detail-page" *ngIf="course() as c; else notFoundTpl">
    <header class="page-header">
      <div class="title-line">
        <h2>{{ c.courseName }}</h2>
        <nz-tag [nzColor]="c.completed ? 'green' : 'blue'">{{ c.completed ? '已完成' : '进行中' }}</nz-tag>
      </div>
      <a routerLink="/course/private" class="back-link">返回课程列表</a>
    </header>

    <section class="section">
      <h3 class="section-title">作业列表</h3>
      <nz-list *ngIf="assignments().length" [nzDataSource]="assignments()" [nzSplit]="false" [nzRenderItem]="assigTpl">
      <ng-template #assigTpl let-item>
        <nz-list-item class="assig-item" [routerLink]="['/course/private', c.courseId, 'assignment', item.assigId]">
          <nz-list-item-meta [nzTitle]="titleTpl" [nzDescription]="descTpl"></nz-list-item-meta>
          <ng-template #titleTpl>
            <div class="assig-line">
              <span class="assig-name">{{ item.assigmentName }}</span>
              <nz-tag *ngIf="item.score !== null" [nzColor]="item.score >= 60 ? 'green' : 'orange'">{{ item.score }}分</nz-tag>
              <nz-tag *ngIf="item.score === null" nzColor="orange">未提交</nz-tag>
              <nz-tag nzColor="purple" *ngIf="item.type === 'program'">编程题</nz-tag>
              <nz-tag nzColor="cyan" *ngIf="item.type === 'choose'">选择题</nz-tag>
            </div>
          </ng-template>
          <ng-template #descTpl>
            <small class="meta">{{ formatDDL(item.ddl) }}</small>
          </ng-template>
        </nz-list-item>
      </ng-template>
      <ng-template #emptyTpl>
        <div class="empty">暂无作业</div>
      </ng-template>
      </nz-list>
    </section>
  </div>
  <ng-template #notFoundTpl>
    <div class="empty">课程不存在或已被移除。</div>
  </ng-template>
  `,
  styles: [`
  .course-detail-page{ max-width:1080px; margin:0 auto; padding:20px 32px 40px; display:flex; flex-direction:column; gap:32px; }
  .page-header .title-line{ display:flex; align-items:center; gap:12px; }
  h2{ margin:0; font-size:24px; font-weight:600; }
  .back-link{ margin-left:auto; font-size:13px; color:#595959; text-decoration:none; }
  .back-link:hover{ color:var(--color-primary); }
  .section{ display:flex; flex-direction:column; gap:12px; }
  .section-title{ font-size:16px; font-weight:600; margin:0; }
  nz-list{ background:#fff; border-radius:var(--size-radius-sm); padding:4px 0; box-shadow:0 2px 4px rgba(0,0,0,0.04); }
  .assig-item{ padding:12px 20px !important; cursor:pointer; transition:background .25s ease; }
  .assig-item:hover{ background:var(--color-primary-light); }
  .assig-line{ display:flex; flex-wrap:wrap; align-items:center; gap:8px; }
  .assig-name{ font-weight:500; color:#262626; }
  .meta{ color:#8c8c8c; }
  .empty{ padding:40px 0; text-align:center; color:#8c8c8c; }
  `]
})
export class CourseComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private courseInfo = inject(CourseInfo);

  courseId = signal<string>('');
  course = computed(() => this.courseInfo.allCourseList.find(c => c.courseId === this.courseId()));
  assignments = computed(() => testAllAssigns(this.courseId()) ?? []);

  ngOnInit() {
    this.route.paramMap.subscribe(pm => {
      const id = pm.get('courseId') || '';
      this.courseId.set(id);
    });
  }

  formatDDL(date: Date | null): string {
    if (!date) return '不截止';
    const d = new Date(date);
    const now = new Date();
    if (d < now) return '已截止';
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `截止于 ${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}
