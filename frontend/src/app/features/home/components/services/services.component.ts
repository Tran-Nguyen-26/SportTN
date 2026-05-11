import { Component } from '@angular/core';
import { Router } from '@angular/router';

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
  route?: string;
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {

  services: ServiceItem[] = [
    {
      title: 'Chương trình tích điểm',
      description: 'Tích điểm dễ dàng, đổi ngàn ưu đãi hấp dẫn.',
      icon: 'assets/icon-points.png',
      route: '/loyalty'
    },
    {
      title: 'Hệ thống cửa hàng',
      description: 'Tìm cửa hàng SportTN gần nhất để mua sắm.',
      icon: 'assets/icon-store.png',
      route: '/stores'
    },
    {
      title: 'Click & Collect',
      description: 'Đặt online, nhận tại cửa hàng miễn phí vận chuyển.',
      icon: 'assets/icon-collect.png',
      route: '/click-collect'
    },
    {
      title: 'Đơn hàng doanh nghiệp',
      description: 'Chiết khấu ưu đãi khi mua số lượng lớn.',
      icon: 'assets/icon-business.png',
      route: '/b2b'
    },
    {
      title: 'Blog thể thao',
      description: 'Kiến thức và tips luyện tập cho mọi bộ môn.',
      icon: 'assets/icon-blog.png',
      route: '/blog'
    },
    {
      title: 'Sản phẩm bền vững',
      description: 'Cam kết vật liệu thân thiện với môi trường.',
      icon: 'assets/icon-eco.png',
      route: '/eco'
    }
  ];

  constructor(private router: Router) {}

  onServiceClick(service: ServiceItem): void {
    if (service.route) {
      this.router.navigate([service.route]);
    }
  }
}
