import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { register } from 'swiper/element';

@Directive({
  selector: '[fmSwiper]',
  standalone: true,
})
export class SwiperDirective implements AfterViewInit {

  private readonly swiperElement: HTMLElement;

  // @Input('config')
  // config?: SwiperOptions;

  constructor(private el: ElementRef<HTMLElement>) {
    this.swiperElement = el.nativeElement;
  }

  ngAfterViewInit() {
    // Object.assign(this.el.nativeElement);
    register();
    // @ts-ignore
    this.el.nativeElement.initialize();
  }
}