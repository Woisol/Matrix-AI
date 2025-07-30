import { AfterViewInit, Component, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { NzCarouselModule } from "ng-zorro-antd/carousel";
import { NzImageModule } from "ng-zorro-antd/image";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface bannerContent {
  img: string;
  alt?: string;
  link?: string;
}

@Component({
  selector: "app-home",
  imports: [RouterLink, NzImageModule],
  standalone: true,
  template: `
  <div class="home-con">
    <section class="col col-left">
      <div class="swiper swiper-con">
        <div class="swiper-wrapper">
          @for (content of carouselContents(); track $index) {
            <div class="swiper-slide">
              <img nz-image nzSrc="{{content.img}}" [alt]="content.alt" routerLink="{{content.link}}" nzDisablePreview />
              <!-- {{content}} -->
              <!-- <img [src]="content.image" [alt]="content.title" /> -->
            </div>
          }
        </div>
        <!-- If we need pagination -->
        <div class="swiper-pagination"></div>
        <!-- If we need navigation buttons -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
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
  .swiper{
    width: 100%;
    /* max-width: 100%;*/
    /*height: min(fit-content,200px);*/
    height: fit-content;
    max-height: 200px;
    overflow: hidden;
    border-radius: var(--size-radius);
    background: linear-gradient(135deg, #eee, #ccc);
    /* 关键：图片元素有可能突破布局() 解决关键就在于设置图片的宽高() */
    & img{
      width: 100%;
      height: 100%;
    }
  }
  `],
})
export class HomeComponent implements AfterViewInit {
  // constructor() {
  swiper: Swiper | undefined;
  ngAfterViewInit() {
    //~~ md 这个 .swiper 改了没用的啊？？？
    this.swiper = new Swiper('.swiper', {
      // 不设置具体 px 这里要加个 0 否则会导致元素莫名其妙被加个 3.35544e07 px……
      width: 0,
      loop: true,
      modules: [Navigation, Pagination],
      // ……@note — By changing classes you will also need to change Swiper's CSS to reflect changed classes
      // slideClass: 'swiper-item',
      autoplay: {
        delay: 1000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      effect: 'slide',
      spaceBetween: 10,
    })
  }
  protected readonly carouselContents = signal<bannerContent[]>([
    {
      img: "banner-report-2024.png",
      alt: "2024 年度报告报告",
    },
    {
      img: "banner-recruit-2025.png",
      alt: "2025 Matrix 招新",
    },

  ])
}