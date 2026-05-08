import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product/product.service';
import { ProductDetail } from '../../../core/models/product/product.model';
import { CategoryService } from '../../../core/services/category/category.service';
import { BrandOption, BrandService } from '../../../core/services/brand/brand.service';
import {CategoryOption} from "../../pages/banners/banners.component";
import {ProductReview} from "../add-product/add-product.component";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  productId: number | null = null;
  isLoading = true;
  product: ProductDetail | null = null;

  activeTab: 'info' | 'variants' | 'images' | 'reviews' = 'info';

  reviews: ProductReview[] = [
    {
      id: 1, customerName: 'Nguyễn Văn An', customerAvatar: 'NA', rating: 5,
      comment: 'Sản phẩm rất tốt, chất liệu mềm mại, mặc thoáng khí khi chạy bộ. Giao hàng nhanh, đóng gói cẩn thận. Sẽ mua lại!',
      date: '20/04/2025', isVisible: true,
      adminReply: 'Cảm ơn bạn đã tin tưởng SportZone! Chúc bạn tập luyện vui vẻ 🏃', images: []
    },
    {
      id: 2, customerName: 'Trần Thị Bình', customerAvatar: 'TB', rating: 4,
      comment: 'Áo đẹp, mặc vừa size M. Màu xanh đúng như hình. Chỉ hơi tiếc là không có túi nhỏ bên hông.',
      date: '18/04/2025', isVisible: true, adminReply: null, images: []
    },
    {
      id: 3, customerName: 'Lê Văn Cường', customerAvatar: 'LC', rating: 3,
      comment: 'Chất liệu ổn nhưng đường may hơi thô. Giá hơi cao so với chất lượng.',
      date: '15/04/2025', isVisible: true, adminReply: null, images: []
    },
    {
      id: 4, customerName: 'Phạm Thị Dung', customerAvatar: 'PD', rating: 5,
      comment: 'Mua lần 2 rồi, vẫn ưng lắm! Size chuẩn, màu đẹp, giặt nhiều lần không phai.',
      date: '12/04/2025', isVisible: true,
      adminReply: 'Cảm ơn bạn đã ủng hộ SportZone lần 2! ❤️', images: []
    },
    {
      id: 5, customerName: 'Hoàng Văn Em', customerAvatar: 'HE', rating: 2,
      comment: 'Hàng nhận được khác màu so với ảnh, liên hệ shop chưa được phản hồi.',
      date: '10/04/2025', isVisible: false, adminReply: null, images: []
    },
  ];

  categories = signal<CategoryOption[]>([]);
  brands     = signal<BrandOption[]>([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    this.loadDropdowns();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productId = +id;
      this.loadProduct(+id);
    }
  }

  private loadDropdowns(): void {
    this.categoryService.getCategoryOption().subscribe({
      next: (res) => { if (res.success) this.categories.set(res.data); }
    });
    this.brandService.getBrandOption().subscribe({
      next: (res) => { if (res.success) this.brands.set(res.data); }
    });
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.productService.getEditDetail(id).subscribe({
      next: (res) => {
        if (res.data) this.product = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('[ProductDetail] Lỗi tải sản phẩm:', err);
        this.isLoading = false;
      }
    });
  }

  goToEdit(): void {
    this.router.navigate(['/admin/products/edit', this.productId]);
  }

  goBack(): void {
    this.router.navigate(['/admin/products']);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  getCategoryName(id: number | null): string {
    if (!id) return '—';
    return this.categories().find(c => c.id === id)?.name || '—';
  }

  getBrandName(id: number | null): string {
    if (!id) return '—';
    return this.brands().find(b => b.id === id)?.name || '—';
  }

  formatPrice(price: number | null | undefined): string {
    if (!price) return '—';
    return price.toLocaleString('vi-VN') + 'đ';
  }

  getDiscountPercent(original: number, sale: number | null): number {
    if (!sale || !original || sale >= original) return 0;
    return Math.round((original - sale) / original * 100);
  }

  get totalStock(): number {
    return this.product?.variants.reduce((s, v) => s + (v.stockQuantity || 0), 0) ?? 0;
  }

  get minPrice(): number {
    const prices = this.product?.variants
      .map(v => v.salePrice || v.originalPrice)
      .filter(p => p > 0) ?? [];
    return prices.length ? Math.min(...prices) : 0;
  }
}
