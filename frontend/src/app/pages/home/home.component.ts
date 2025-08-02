import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, signal, ViewChild, ElementRef } from "@angular/core";
import { RouterLink } from "@angular/router";
import { NzImageModule } from "ng-zorro-antd/image";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { register } from "swiper/element";
import { NgModel } from "@angular/forms";
import { NzCarouselModule } from "ng-zorro-antd/carousel";

export interface CarouselItem {
  isRouterLink?: boolean;
  link: string;
  imagePath: string;
}

register();
@Component({
  selector: "app-home",
  imports: [RouterLink, NzImageModule, NzCarouselModule,],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
  <div class="home-con">
    <section class="col col-left">
      <nz-carousel
        #carousel
        class="swiper-con"
        nzAutoPlay
        nzEffect="slide"
        [nzLoop]="true"
        [nzDotRender]="dotTpl">
        @for (content of carouselItems; track $index) {
          <div nz-carousel-content class="swiper-slide">
            <!-- <img nz-image nzSrc="{{content.imagePath}}" routerLink="{{content.link}}" nzDisablePreview loading="lazy" /> -->
            <!-- {{content}} -->
            <img [src]="content.imagePath"  />
        </div>
        }
      </nz-carousel>

      <ng-template #dotTpl let-index>
        <span class="custom-dot"></span>
      </ng-template>

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
  `],
})
export class HomeComponent {
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