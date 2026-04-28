import { Component } from '@angular/core';

@Component({
  selector: 'app-review-page',
  templateUrl: './review-page.component.html',
  styleUrls: ['./review-page.component.css']
})
export class ReviewPageComponent {
  productInfo = {
    name: 'Băng bảo vệ đầu gối trái/phải',
    price: 199000,
    image: 'assets/image-9f025281-316b-4ca2-8557-7cc5b4c9e346.png',
    totalReviews: 2835,
    averageRating: 4.7,
    recommendPercent: 45
  };

  ratingStats = [
    { star: 5, count: 37 },
    { star: 4, count: 31 },
    { star: 3, count: 99 },
    { star: 2, count: 351 },
    { star: 1, count: 2317 }
  ];

  ratingFilters = [
    { label: 'Tất cả', count: 128, active: true },
    { label: '5 sao', count: 72, active: false },
    { label: '4 sao', count: 34, active: false },
    { label: '3 sao', count: 14, active: false },
    { label: '1-2 sao', count: 8, active: false }
  ];

  reviews = [
    {
      userName: 'Nguyen V.',
      rating: 5,
      date: '2 ngày trước',
      title: 'Giày chạy rất êm, đúng size',
      content: 'Mình chạy 10km mỗi buổi, đế đàn hồi tốt và không đau gót chân. Giao hàng nhanh, đóng gói cẩn thận.',
      product: 'Nike Air Zoom Pegasus 40'
    },
    {
      userName: 'Minh T.',
      rating: 4,
      date: '5 ngày trước',
      title: 'Áo thể thao thoáng, mặc tập gym ổn',
      content: 'Chất vải mát, co giãn tốt. Form hơi ôm nên ai thích rộng có thể tăng 1 size.',
      product: 'Adidas Techfit Compression Shirt'
    },
    {
      userName: 'Hoang L.',
      rating: 5,
      date: '1 tuần trước',
      title: 'Dịch vụ tư vấn tốt, sản phẩm chuẩn',
      content: 'Nhân viên tư vấn nhiệt tình, chọn đúng mẫu quần chạy bộ. Màu sắc giống ảnh và đường may chắc chắn.',
      product: 'UA Rival Fleece Jogger'
    }
  ];

  setActiveFilter(index: number): void {
    this.ratingFilters = this.ratingFilters.map((filter, i) => ({
      ...filter,
      active: i === index
    }));
  }

  getStars(rating: number): string[] {
    return Array.from({ length: rating }, () => 'star');
  }

  getRatingPercent(count: number): number {
    return (count / this.productInfo.totalReviews) * 100;
  }
}
