import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product/product.service';
import { ProductDetail } from '../../../core/models/product/product.model';
import { CategoryService } from '../../../core/services/category/category.service';
import { BrandOption, BrandService } from '../../../core/services/brand/brand.service';
import {CategoryOption} from "../../pages/banners/banners.component";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  productId: number | null = null;
  isLoading = true;
  product: ProductDetail | null = null;

  activeTab: 'info' | 'variants' | 'images' = 'info';

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
