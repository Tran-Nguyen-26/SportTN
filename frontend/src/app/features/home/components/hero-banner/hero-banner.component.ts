import {Component, Input} from '@angular/core';
import {BannerResponse} from "../../../../core/models/home-response/home-response";

@Component({
  selector: 'app-hero-banner',
  templateUrl: './hero-banner.component.html',
  styleUrls: ['./hero-banner.component.css']
})
export class HeroBannerComponent {
  // slides = [
  //   { image: 'assets/images/banners/slide1.webp', title: 'Nạp deal giữa tháng'},
  //   { image: 'assets/images/banners/slide2.webp', title: 'Thể thao dưới nước'},
  //   { image: 'assets/images/banners/slide3.png', title: 'Đứng bỏ lỡ'},
  //   { image: 'assets/images/banners/slide4.webp', title: 'Combo bơi lội giá rẻ'},
  //   { image: 'assets/images/banners/slide5.webp', title: 'Combo PICKLEBALL giá tốt'},
  //   { image: 'assets/images/banners/slide6.webp', title: 'Combo'}
  // ]

  @Input() slides: BannerResponse[] = [];

  currentIndex = 0;
  intervalId: any;

  ngOnInit() {
    this.intervalId = setInterval(() => this.next(), 5000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(i: number) {
    this.currentIndex = i;
  }
}
