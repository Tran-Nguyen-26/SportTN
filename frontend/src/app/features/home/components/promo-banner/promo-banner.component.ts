import { Component } from '@angular/core';

@Component({
  selector: 'app-promo-banner',
  templateUrl: './promo-banner.component.html',
  styleUrls: ['./promo-banner.component.css']
})
export class PromoBannerComponent {
  banners = [
    {
      title: 'Tải ứng dụng Decathlon',
      description: 'Nhận ưu đãi độc quyền & thông tin khuyến mãi mới nhất',
      image: 'assets/promo-app.jpg',
      button: 'Tải app ngay'
    },
    {
      title: 'Trở thành thành viên Decathlon',
      description: 'Nhận mã giảm 10% tháng sinh nhật, tích điểm từng đơn hàng',
      image: 'assets/promo-member.jpg',
      button: 'Tìm hiểu thêm'
    },
    {
      title: 'Grab Express 2H',
      description: 'Nhận hàng sớm cùng giao hoả tốc tại HN/HCM',
      image: 'assets/promo-delivery.jpg',
      button: 'Tìm hiểu thêm'
    }
  ];
}
