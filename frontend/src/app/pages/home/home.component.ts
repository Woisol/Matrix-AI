import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, signal, ViewChild, ElementRef, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { NzImageModule } from "ng-zorro-antd/image";
import { NzCarouselModule, NzCarouselComponent } from "ng-zorro-antd/carousel";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzListModule } from "ng-zorro-antd/list";
import { CourseInfo } from "../../services/course.service";
import { NzCollapseModule } from "ng-zorro-antd/collapse";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzTagModule } from "ng-zorro-antd/tag";
import { NzBadgeModule } from "ng-zorro-antd/badge";
import { NzSpaceModule } from "ng-zorro-antd/space";
import { DatePipe } from "@angular/common";

export interface CarouselItem {
  isRouterLink?: boolean;
  link: string;
  imagePath: string;
}

@Component({
  selector: "app-home",
  imports: [RouterLink, NzImageModule, NzCarouselModule, NzButtonModule, NzIconModule, NzListModule, NzCollapseModule, NzTableModule, NzTagModule, NzBadgeModule, NzSpaceModule, DatePipe],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
  <div class="home-con">
    <section class="col col-left">
      <div class="carousel-container">
        <nz-carousel
          #carousel
          class="swiper-con"
          nzAutoPlay
          nzEffect="transform-no-loop"
          [nzLoop]="true"
          >
          @for (content of carouselItems; track $index) {
            <div nz-carousel-content class="swiper-slide">
              <!-- <img nz-image nzSrc="{{content.imagePath}}" routerLink="{{content.link}}" nzDisablePreview loading="lazy" /> -->
              <!-- {{content}} -->
              <img [src]="content.imagePath"  />
            </div>
          }
        </nz-carousel>

        <!-- 自定义导航按钮 -->
        <button
          nz-button
          nzType="primary"
          nzShape="circle"
          class="carousel-nav prev"
          (click)="goToPrevSlide()"
          nzSize="small">
          <span nz-icon nzType="left" nzTheme="outline"></span>
        </button>

        <button
          nz-button
          nzType="primary"
          nzShape="circle"
          class="carousel-nav next"
          (click)="goToNextSlide()"
          nzSize="small">
          <span nz-icon nzType="right" nzTheme="outline"></span>
        </button>
      </div>

      <!-- <ng-template #dotTpl let-index>
        <span class="custom-dot"></span>
      </ng-template> -->

      <!-- <swiper-container class="swiper-con" loop="true" autoplay="{disableOnInteraction: false,pauseOnMouseEnter: true}" effect="slide" space-between="10" width ="0"> -->
        <!-- <div class="swiper-wrapper">  navigation="true" pagination="true" -->
      <!-- <swiper-container class="swiper-con"
        slides-per-view="3"
        space-between="spaceBetween"
        centered-slides="true"
        [pagination]="{ hideOnClick: true }"
        [breakpoints]="{
          '768': {
            slidesPerView: 3,
          },
        }">

        </div>
      </swiper-container> -->
      <!-- 课程列表 - 使用 List + Collapse 嵌套结构 -->
      <div class="course-section">
        <h3 class="section-title">
          <span nz-icon nzType="book" nzTheme="outline"></span>
          Todo-List
        </h3>

        <nz-list nzBordered nzSize="small" class="course-list">
          @for(course of courseInfo.courseListItems; track course.courseName) {
            <nz-list-item class="course-item">
              <nz-collapse nzGhost>
                <nz-collapse-panel
                  [nzHeader]="courseHeaderTpl"
                  [nzExtra]="courseExtraTpl"
                  [nzActive]="false">

                  <!-- 课程头部模板 -->
                  <ng-template #courseHeaderTpl>
                    <div class="course-header">
                      <span class="course-name">{{ course.courseName }}</span>
                    </div>
                  </ng-template>

                  <!-- 课程额外信息模板 -->
                  <ng-template #courseExtraTpl>
                      <nz-badge
                        [nzCount]="course.assigment.length"
                        [nzShowZero]="true"
                        nzSize="small"
                        class="assignment-count">
                      </nz-badge>
                  </ng-template>

                  <!-- 作业列表 -->
                  <nz-list nzSize="small" class="assignment-list">
                    @for(assignment of course.assigment; track assignment.assigmentName) {
                      <nz-list-item class="assignment-item">
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
                              <h3 class="assignment-name">{{ assignment.assigmentName }}</h3>
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
                                    已截止于：{{ assignment.ddl | date:'MM-dd HH:mm' }}
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
                    @if (course.assigment.length === 0) {
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
                </nz-collapse-panel>
              </nz-collapse>
            </nz-list-item>
          }

          <!-- 全局空状态 -->
          @if (courseInfo.courseListItems.length === 0) {
            <nz-list-item>
              <nz-list-item-meta
                nzTitle="没有更多作业"
                nzDescription="恭喜，你已经完成了所有题目！"
                [nzAvatar]="nzAvatar">
                <ng-template #nzAvatar>
                  <span nz-icon nzType="check" nzTheme="outline"></span>
                  <!-- <span nz-icon nzType="book" nzTheme="outline" class="empty-icon"></span> -->
                </ng-template>
              </nz-list-item-meta>
            </nz-list-item>
          }
        </nz-list>
      </div>
    </section>
    <section class="col col-right">
      <h2 class="">正在进行中的课程</h2>
      <div class="">
        <h3 class="">普通课程</h3>
        <a routerLink="/course/private" class="">&gt;&gt;查看所有课程</a>
      </div>
      <div class=""></div>
    </section>
  </div>
<!-- <h2>Home to be implement</h2> -->
  `,
  styles: [`
  .home-con{
    width: 100%;
    max-width: 100vw;
    display: flex;
    gap: 40px;

    &>.col{
      max-height: 100%;

      &.col-left{
        flex:1;
        display: flex;
        flex-direction: column;
      }
      &.col-right{
        width: min(400px,25%);
        flex-shrink: 0;

      }
    }
  }

  .carousel-container {
    position: relative;
    width: 100%;
  }

  .carousel-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    background: rgba(0, 0, 0, 0.2) ;
    border: none ;
    color: white ;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.5) ;
      transform: translateY(-50%) scale(1.1);
    }

    &.prev {
      left: 10px;
    }

    &.next {
      right: 10px;
    }
  }

  .swiper-con{
    width: 100% !important;
    /* max-width: 100%;*/
    height: fit-content;
    max-height: 200px;
    overflow: hidden;
    border-radius: var(--size-radius);
    background: linear-gradient(135deg, #eee, #ccc);

    /* 强制修复 slick 的宽度计算问题 */
    & ::ng-deep .slick-list {
      width: 100% !important;
    }

    & ::ng-deep .slick-track {
      width: auto !important;
      display: flex !important;
    }

    & ::ng-deep .slick-slide {
      width: 100% !important;
      height: fit-content !important;
      flex: 0 0 100% !important;
    }

    /* 关键：图片元素有可能突破布局() 解决关键就在于设置图片的宽高() */
    & img{
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }
  [nz-carousel-content] {
    text-align: center;
    width: 100%;
    height: fit-content;
    max-height: 200px;
    line-height: 200px;
    background: #364d79;
    color: #fff;
    overflow: hidden;
  }

  .slick-dots{
    &>li{
      >span{
      width: 5px;
      height: 5px;
      border-radius: 2.5px;
      background-color: #aaa;
    }
    &.slick-active>span{
      background-color: var(--color-primary);
    }

    }
  }

  /* 课程列表样式 */
  .course-section {
    margin-top: 24px;
    height: 100%;
    /*overflow-y: auto;*/

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #262626;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;

    }
  }

  .course-list {
    background: #fff;
    border-radius: 8px;

    .course-item {
      width: 100%;
      padding: 0 !important;
      border: none !important;

      nz-collapse{
        width: 100%;
      }

      ::ng-deep .ant-collapse {
        background: transparent;
        border: none;

        .ant-collapse-item {
          border: none;

          .ant-collapse-header {
            padding: 16px 24px;
            background: #fafafa;
            border-radius: 6px;
            margin-bottom: 2px;
            transition: all 0.3s ease;

            &:hover {
              background: #f0f2f5;
            }
          }

          .ant-collapse-content {
            background: #fff;
            border-radius: 0 0 6px 6px;
            border: 1px solid #f0f0f0;
            border-top: none;
          }
        }
      }
    }
  }

  .course-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;

    .course-name {
      font-weight: 500;
      font-size: 14px;
      color: #262626;
    }

  }
  .assignment-count {
    ::ng-deep .ant-badge-count {
      background: var(--color-primary);
      font-size: 12px;
      height: 18px;
      line-height: 18px;
      min-width: 18px;
    }
  }

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

  .empty-icon {
    color: #bfbfbf;
    font-size: 18px;
  }
  `],
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('carousel') carousel!: NzCarouselComponent;

  ngAfterViewInit() {
    // 延迟初始化，确保 DOM 完全渲染
    setTimeout(() => {
      if (this.carousel) {
        // 触发窗口 resize 事件
        window.dispatchEvent(new Event('resize'));
      }
    }, 100);
  }

  goToPrevSlide() {
    this.carousel.pre();
  }

  goToNextSlide() {
    this.carousel.next();
  }

  isOverdue(ddl: Date | null): boolean {
    if (!ddl) return false;
    return new Date() > new Date(ddl);
  }
  // constructor() {
  // swiper: Swiper | undefined;
  // ngAfterViewInit() {
  //   //~~ md 这个 .swiper 改了没用的啊？？？
  //   this.swiper = new Swiper('.swiper', {
  //     // 不设置具体 px 这里要加个 0 否则会导致元素莫名其妙被加个 3.35544e07 px……
  //     width: 0,
  //     loop: true,
  //     modules: [Navigation, Pagination],
  //     // ……@note — By changing classes you will also need to change Swiper's CSS to reflect changed classes
  //     // slideClass: 'swiper-item',
  //     autoplay: {
  //       delay: 1000,
  //       disableOnInteraction: false,
  //       pauseOnMouseEnter: true,
  //     },
  //     effect: 'slide',
  //     spaceBetween: 10,
  //   })
  // }
  protected readonly carouselItems: CarouselItem[] = [
    {
      link: "",
      imagePath: "banner-report-2024.png",
    },
    {
      link: "",
      imagePath: "banner-recruit-2025.png",
    },
  ]
  protected readonly courseInfo = inject(CourseInfo)
}