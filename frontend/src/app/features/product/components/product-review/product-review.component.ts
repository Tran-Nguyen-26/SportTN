import { Component, Input, OnInit } from '@angular/core';

export interface CustomerReview {
  id: number;
  customerName: string;
  avatar: string;       // 2 chữ cái initials
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.css']
})
export class ProductReviewComponent implements OnInit {

  @Input() productId!: number;
  @Input() rating    = 0;
  @Input() totalReviews = 0;

  reviews: CustomerReview[] = [];
  displayCount = 2; // Hiện 2 review đầu, "Xem thêm" load thêm

  get visibleReviews(): CustomerReview[] {
    return this.reviews.slice(0, this.displayCount);
  }

  get hasMore(): boolean {
    return this.displayCount < this.reviews.length;
  }

  get ratingBreakdown(): { star: number; count: number; pct: number }[] {
    return [5, 4, 3, 2, 1].map(star => {
      const count = this.reviews.filter(r => r.rating === star).length;
      return { star, count, pct: this.reviews.length ? count / this.reviews.length * 100 : 0 };
    });
  }

  get stars(): number[] { return [1, 2, 3, 4, 5]; }

  isStarFilled(star: number, rating: number): boolean {
    return star <= Math.floor(rating);
  }

  isStarHalf(star: number, rating: number): boolean {
    return star === Math.ceil(rating) && rating % 1 >= 0.5;
  }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    // TODO: gọi API this.reviewService.getByProduct(this.productId)
    this.reviews = [
      { id: 1, customerName: 'Trần Quốc Việt', avatar: 'TV', rating: 5,
        comment: 'Giày chạy rất thoáng, đệm nảy tốt. Mang size 41 vừa đẹp. Giao hàng nhanh, đóng gói cẩn thận. Sẽ mua lại!',
        date: '21/03/2026', verified: true },
      { id: 2, customerName: 'Lê Minh Khoa', avatar: 'LM', rating: 4,
        comment: 'Form giày đẹp, chất lượng ổn. Chỉ hơi tiếc màu thực tế hơi khác ảnh một chút nhưng nhìn chung vẫn ưng.',
        date: '15/03/2026', verified: true },
      { id: 3, customerName: 'Nguyễn Thị Mai', avatar: 'NM', rating: 5,
        comment: 'Mua cho chồng, chồng rất thích. Chất lượng tốt, đúng hàng chính hãng. Shop tư vấn nhiệt tình.',
        date: '10/03/2026', verified: true },
      { id: 4, customerName: 'Phạm Văn Đức', avatar: 'PD', rating: 3,
        comment: 'Giày ổn nhưng đế hơi cứng so với kỳ vọng. Cần thời gian để mềm dần.',
        date: '05/03/2026', verified: false },
    ];
  }

  loadMore(): void {
    this.displayCount += 2;
    // TODO: khi có API → gọi thêm trang tiếp theo
  }
}
