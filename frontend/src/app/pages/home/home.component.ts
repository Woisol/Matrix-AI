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
import { AssignListComponent } from "../components/assign-list/assign-list.component";

export interface CarouselItem {
  isRouterLink?: boolean;
  link: string;
  imagePath: string;
}

@Component({
  selector: "app-home",
  imports: [RouterLink, NzImageModule, NzCarouselModule, NzButtonModule, NzIconModule, NzListModule, NzCollapseModule, NzTableModule, NzTagModule, NzBadgeModule, NzSpaceModule, DatePipe, AssignListComponent],
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
          @for(course of courseInfo.todoCourseList; track course.courseId) {
            <nz-list-item class="course-item">
              <nz-collapse nzGhost>
                <nz-collapse-panel
                  [nzHeader]="courseHeaderTpl"
                  [nzExtra]="courseExtraTpl"
                  [nzActive]="true">

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
                  <app-assign-list [course]="course"/>
                </nz-collapse-panel>
              </nz-collapse>
            </nz-list-item>
          }

          <!-- 全局空状态 -->
          @if (courseInfo.todoCourseList.length === 0) {
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
    <!-- 课程右栏 -->
    <section class="col col-right all-course-con">
      <h2 class="">正在进行中的课程</h2>
      <div class="header">
        <h3 style="display: inline-block; margin-right: auto;">普通课程</h3>
        <a routerLink="/course/private">&gt;&gt;所有课程</a>
      </div>
      <div class="list">
        <nz-list>
          @for(course of courseInfo.allCourseList; track course.courseId) {
            <nz-list-item [routerLink]="['/course/private', course.courseId]">
              <nz-list-item-meta
                nzTitle="{{ course.courseName }}"
                [nzAvatar]="nzAvatar">
                <ng-template #nzAvatar>
                  <span nz-icon nzType="book" nzTheme="outline"></span>
                </ng-template>
              </nz-list-item-meta>
              <span style="margin-left: auto;" class="course-status" [class.completed]='course.completed'>{{course.completed?'已':'未'}}完成
              </span>
            </nz-list-item>
          }
        </nz-list>
      </div>
    </section>
  </div>
<!-- <h2>Home to be implement</h2> -->
  `,
  styles: [`
  .home-con{
    width: 100%;
    max-width: 1080px;
    display: flex;
    gap: 40px;
    padding: 20px 40px;
    margin: 0 auto;

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
    background: rgba(0, 0, 0, 0.2);
    border: none;
    color: white;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.5);
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
    border-radius: var(--size-radius-sm);

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
            margin-bottom: 2px;
            transition: all 0.3s ease;

            &:hover {
              background: #f0f2f5;
            }
          }

          .ant-collapse-content {
            background: #fff;
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
  .all-course-con{
    &>.header{
      display: flex;
      align-items: center;
      margin-bottom: 4px;

      &>h3{
        font-size: 16px;
        font-weight: 600;
        color: #262626;
      }

      &>a{
        margin-left: auto;
        color: grey;
        transition: all 0.3s ease;

        &:hover {
          color: var(--color-primary);
          text-decoration: none;
        }
      }
    }
    &>.list  nz-list-item{
      padding: 12px 6px;
      border-radius: var(--size-radius-sm);
      transition: all 0.3s ease;
      &:hover{
        background-color: var(--color-primary-light);
      }
    }
  }

  .empty-icon {
    color: #bfbfbf;
    font-size: 18px;
  }

  .course-status{
    &::before{
      content: '';
      width: 10px;
      height: 10px;
      line-height: 10px;
      display: inline-block;
      border-radius: 50%;
      margin-right: 5px;
      background-color: #ff4d4f;
    }
    &.completed::before{
      background-color: #52c41a;
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
      imagePath: "banner/banner-report-2024.png",
    },
    {
      link: "",
      imagePath: "banner/banner-recruit-2025.png",
    },
  ]
  protected readonly courseInfo = inject(CourseInfo)
}