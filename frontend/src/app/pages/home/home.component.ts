import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, signal, ViewChild, ElementRef } from "@angular/core";
import { RouterLink } from "@angular/router";
import { NzImageModule } from "ng-zorro-antd/image";
import { NzCarouselModule, NzCarouselComponent } from "ng-zorro-antd/carousel";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconModule } from "ng-zorro-antd/icon";

export interface CarouselItem {
  isRouterLink?: boolean;
  link: string;
  imagePath: string;
}

@Component({
  selector: "app-home",
  imports: [RouterLink, NzImageModule, NzCarouselModule, NzButtonModule, NzIconModule],
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
          nzEffect="slide"
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
      <table class=""></table>
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
      imagePath: "banner-report-2024.png",
    },
    {
      link: "",
      imagePath: "banner-recruit-2025.png",
    },

  ]
}