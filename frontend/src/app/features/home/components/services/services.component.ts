import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {
  services = [
    { title: 'Chương trình tích điểm', description: 'Tích Điểm Dễ Dàng - Thêm Ngàn Ưu Đãi.', icon: 'assets/icon-points.png' },
    { title: 'Cửa Hàng Decathlon', description: 'Tìm cửa hàng Decathlon gần nhất và mua sắm nào.', icon: 'assets/icon-store.png' },
    { title: 'Dịch vụ Click & Collect', description: 'Miễn phí vận chuyển cùng dịch vụ Click & Collect.', icon: 'assets/icon-collect.png' },
    { title: 'Đơn Hàng Doanh Nghiệp', description: 'Nhận chiết khấu ưu đãi khi mua hàng số lượng lớn.', icon: 'assets/icon-business.png' },
    { title: 'Blog Thể Thao', description: 'Kiến thức thể thao cho tất cả!', icon: 'assets/icon-blog.png' },
    { title: 'Thiết Kế Sinh Thái', description: 'Tìm hiểu về thiết kế sinh thái tại Decathlon.', icon: 'assets/icon-eco.png' }
  ];
}
