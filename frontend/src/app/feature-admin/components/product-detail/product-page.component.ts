import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandOption, BrandService } from '../../../core/services/brand/brand.service';
import { CategoryOption } from '../../pages/banners/banners.component';
import { CategoryService } from '../../../core/services/category/category.service';
import { ProductService } from '../../../core/services/product/product.service';
import { ProductDetail, VariantDetail } from '../../../core/models/product/product.model';

// ── Form interfaces ──────────────────────────────────────────────────────────

export interface VariantImage {
  preview: string;
  file: File | null;
}

export interface ProductVariantForm {
  id?: number | null;
  sku: string;
  color: string;
  size: string;
  originalPrice: number | null;
  salePrice: number | null;
  stockQuantity: number | null;
  weightGram: number | null;
  mainImageUrl?: string | null;
  images: VariantImage[];
  imageSource: 'upload' | 'url';
  pendingUrl: string;
}

export interface ProductForm {
  name: string;
  description: string;
  slug: string;
  categoryId: number | null;
  brandId: number | null;
  active: boolean;
  mainImageUrl: string;
  variants: ProductVariantForm[];
}

// ── Request DTOs ─────────────────────────────────────────────────────────────

export interface VariantImageRequest {
  imageUrl: string;
  displayOrder: number;
}

export interface ProductVariantRequest {
  id?: number | null;
  sku: string;
  color: string;
  size: string;
  originalPrice: number;
  salePrice: number | null;
  stockQuantity: number;
  weightGram: number | null;
  mainImageUrl: string | null;
  images: VariantImageRequest[];
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  slug: string;
  categoryId: number;
  brandId: number;
  active: boolean;
  mainImageUrl: string;
  variants: ProductVariantRequest[];
}

export type ProductUpdateRequest = ProductCreateRequest;

// ── Review interface ─────────────────────────────────────────────────────────

export interface ProductReview {
  id: number;
  customerName: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  date: string;
  isVisible: boolean;
  adminReply: string | null;
  images: string[];
}

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {

  // ── Mode flags ────────────────────────────────
  isViewMode  = false;
  isEditMode  = false;
  // add mode = !isViewMode && !isEditMode

  productId: number | null = null;
  isLoading = false;
  isSaving  = false;
  saveError = '';
  saveSuccess = false;

  // ── Dropdown data ─────────────────────────────
  categories = signal<CategoryOption[]>([]);
  brands     = signal<BrandOption[]>([]);

  sizes  = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  colors = ['Đen', 'Trắng', 'Đỏ', 'Xanh dương', 'Xanh lá', 'Vàng', 'Hồng', 'Xám', 'Be'];

  // ── View mode: raw product data ───────────────
  product: ProductDetail | null = null;

  // ── Edit/Add mode: form data ──────────────────
  form: ProductForm = {
    name: '', description: '', slug: '',
    categoryId: null, brandId: null,
    active: true, mainImageUrl: '', variants: [],
  };

  // ── UI state ──────────────────────────────────
  activeTab: 'info' | 'variants' = 'info';

  // ── Main image ────────────────────────────────
  mainImageSource: 'upload' | 'url' = 'url';
  mainImagePreview: string | null = null;
  mainUrlPreview   = '';
  mainUrlValid: boolean | null = null;

  // ── Extra images ──────────────────────────────
  extraImageSource: 'upload' | 'url' = 'url';
  extraImagePreviews: string[] = [];
  pendingExtraUrl = '';

  // ── Reviews (mock data) ───────────────────────
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

  selectedRating  = 0;
  replyingId: number | null = null;
  replyText = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadBrands();
    this.loadCategories();

    // Xác định mode từ URL:
    //   /admin/products/add          → add
    //   /admin/products/edit/:id     → edit
    //   /admin/products/detail/:id   → view
    const url  = this.router.url;
    const id   = this.route.snapshot.paramMap.get('id');

    if (url.includes('/detail/') && id) {
      this.isViewMode = true;
      this.productId  = +id;
      this.loadProduct(+id);
    } else if (url.includes('/edit/') && id) {
      this.isEditMode = true;
      this.productId  = +id;
      this.loadProduct(+id);
    }
    // else: add mode, không cần load
  }

  // ── Load product ──────────────────────────────

  private loadProduct(id: number): void {
    this.isLoading = true;
    this.productService.getEditDetail(id).subscribe({
      next: (res) => {
        if (res.data) {
          // View mode: lưu raw data để hiển thị read-only
          this.product = res.data;

          // Edit mode: map sang form
          if (this.isEditMode) {
            const p = res.data;
            this.form = {
              name:         p.name,
              description:  p.description,
              slug:         p.slug,
              categoryId:   p.categoryId,
              brandId:      p.brandId,
              active:       p.active,
              mainImageUrl: p.mainImageUrl,
              variants: p.variants.map((v: VariantDetail) => ({
                id:            v.id ?? null,
                sku:           v.sku,
                color:         v.color,
                size:          v.size,
                originalPrice: v.originalPrice,
                salePrice:     v.salePrice,
                stockQuantity: v.stockQuantity,
                weightGram:    v.weightGram,
                mainImageUrl:  v.mainImageUrl ?? null,
                imageSource:   'url' as const,
                pendingUrl:    '',
                images: (v.imageUrls?.length
                    ? v.imageUrls.map((item: any) => ({
                      preview: typeof item === 'string' ? item : (item.imageUrl ?? item.preview ?? ''),
                      file: null,
                    }))
                    : v.mainImageUrl
                      ? [{ preview: v.mainImageUrl, file: null }]
                      : []
                ),
              })),
            };

            if (p.mainImageUrl) {
              this.mainImageSource = 'url';
              this.mainUrlPreview  = p.mainImageUrl;
              this.mainUrlValid    = true;
            }
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('[ProductPage] Lỗi tải sản phẩm:', err);
        this.isLoading = false;
      }
    });
  }

  private loadBrands(): void {
    this.brandService.getBrandOption().subscribe({
      next:  (res) => { if (res.success) this.brands.set(res.data); },
      error: (err) => console.error('Lỗi tải thương hiệu:', err)
    });
  }

  private loadCategories(): void {
    this.categoryService.getCategoryOption().subscribe({
      next:  (res) => { if (res.success) this.categories.set(res.data); },
      error: (err) => console.error('Lỗi tải danh mục:', err)
    });
  }

  // ── Build request ─────────────────────────────

  private buildRequest(): ProductCreateRequest {
    return {
      name:         this.form.name.trim(),
      description:  this.form.description.trim(),
      slug:         this.form.slug,
      categoryId:   this.form.categoryId!,
      brandId:      this.form.brandId!,
      active:       this.form.active,
      mainImageUrl: this.effectiveMainImage ?? this.form.mainImageUrl,
      variants: this.form.variants.map(v => {
        const mainImageUrl = v.images.length > 0
          ? v.images[0].preview
          : (this.effectiveMainImage || null);
        return {
          id:            v.id,
          sku:           v.sku.trim(),
          color:         v.color,
          size:          v.size,
          originalPrice: v.originalPrice!,
          salePrice:     v.salePrice ?? null,
          stockQuantity: v.stockQuantity!,
          weightGram:    v.weightGram ?? null,
          mainImageUrl,
          images: v.images.map((img, idx) => ({
            imageUrl:     img.preview,
            displayOrder: idx + 1,
          })),
        };
      }),
    };
  }

  // ── Submit ────────────────────────────────────

  onSubmit(): void {
    if (!this.isFormValid()) return;

    this.isSaving    = true;
    this.saveError   = '';
    this.saveSuccess = false;

    const request = this.buildRequest();

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, request).subscribe({
        next: (res) => {
          if (res.data) {
            this.isSaving    = false;
            this.saveSuccess = true;
            setTimeout(() => this.router.navigate([`/admin/products/detail/${this.productId}`]), 1000);
          }
        },
        error: (err) => {
          console.error('[ProductPage] updateProduct error:', err);
          this.isSaving  = false;
          this.saveError = err?.error?.message || 'Cập nhật thất bại. Vui lòng thử lại.';
        }
      });
    } else {
      this.productService.createProduct(request).subscribe({
        next: (res) => {
          console.log('[ProductPage] createProduct success:', res);
          this.isSaving    = false;
          this.saveSuccess = true;
          setTimeout(() => this.router.navigate(['/admin/products']), 1200);
        },
        error: (err) => {
          console.error('[ProductPage] createProduct error:', err);
          this.isSaving  = false;
          this.saveError = err?.error?.message || 'Tạo sản phẩm thất bại. Vui lòng thử lại.';
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/products']);
  }

  goToEdit(): void {
    this.router.navigate(['/admin/products/edit', this.productId]);
  }

  // ── Variant methods ───────────────────────────

  addVariant(): void {
    this.form.variants.push({
      sku: '', color: '', size: '',
      originalPrice: null, salePrice: null,
      stockQuantity: null, weightGram: null,
      images: [], imageSource: 'upload', pendingUrl: '',
    });
  }

  removeVariant(index: number): void {
    this.form.variants.splice(index, 1);
  }

  generateSku(variant: ProductVariantForm, index: number): void {
    const name  = this.form.name.slice(0, 4).toUpperCase().replace(/\s/g, '');
    const color = variant.color.slice(0, 3).toUpperCase();
    const size  = variant.size.replace(/\s/g, '');
    variant.sku = `${name}-${color}-${size}-${index + 1}`;
  }

  // ── Main image ────────────────────────────────

  onMainImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { this.mainImagePreview = reader.result as string; };
    reader.readAsDataURL(file);
  }

  removeMainImage(): void { this.mainImagePreview = null; }

  onMainImageUrlChange(event: Event): void {
    const url = (event.target as HTMLInputElement).value.trim();
    this.form.mainImageUrl = url;
    this.mainUrlPreview    = url;
    this.mainUrlValid      = null;
  }

  onUrlImgLoad(type: 'main'): void  { if (type === 'main') this.mainUrlValid = true; }
  onUrlImgError(type: 'main'): void { if (type === 'main') this.mainUrlValid = false; }

  // ── Extra images ──────────────────────────────

  onExtraImagesChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;
    const remaining = 6 - this.extraImagePreviews.length;
    Array.from(files).slice(0, remaining).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => { this.extraImagePreviews.push(reader.result as string); };
      reader.readAsDataURL(file);
    });
    (event.target as HTMLInputElement).value = '';
  }

  removeExtraImage(index: number): void { this.extraImagePreviews.splice(index, 1); }

  addExtraUrl(): void {
    const url = this.pendingExtraUrl.trim();
    if (!url || this.extraImagePreviews.length >= 6) return;
    this.extraImagePreviews.push(url);
    this.pendingExtraUrl = '';
  }

  // ── Variant images ────────────────────────────

  onVariantImageChange(event: Event, variantIndex: number): void {
    const files   = Array.from((event.target as HTMLInputElement).files || []);
    const variant = this.form.variants[variantIndex];
    const remaining = 4 - (variant.images?.length || 0);
    files.slice(0, remaining).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => { variant.images.push({ preview: reader.result as string, file }); };
      reader.readAsDataURL(file);
    });
    (event.target as HTMLInputElement).value = '';
  }

  removeVariantImage(variantIndex: number, imageIndex: number): void {
    this.form.variants[variantIndex].images.splice(imageIndex, 1);
  }

  addVariantUrl(variant: ProductVariantForm): void {
    const url = variant.pendingUrl?.trim();
    if (!url || (variant.images?.length ?? 0) >= 4) return;
    variant.images.push({ preview: url, file: null });
    variant.pendingUrl = '';
  }

  // ── Helpers ───────────────────────────────────

  isFormValid(): boolean {
    const basicValid = !!(
      this.form.name.trim() &&
      this.form.categoryId &&
      this.form.brandId &&
      this.form.variants.length > 0 &&
      this.effectiveMainImage
    );
    const variantsValid = this.form.variants.every(v =>
      v.sku.trim() && v.color && v.size &&
      v.originalPrice !== null && v.originalPrice > 0 &&
      v.stockQuantity !== null && v.stockQuantity >= 0
    );
    return basicValid && variantsValid;
  }

  /** Dùng cho edit/add mode (1 tham số) */
  getDiscountPercent(variant: ProductVariantForm): number;
  /** Dùng cho view mode (2 tham số) */
  getDiscountPercent(original: number, sale: number | null): number;
  getDiscountPercent(variantOrOriginal: ProductVariantForm | number, sale?: number | null): number {
    if (typeof variantOrOriginal === 'number') {
      const original = variantOrOriginal;
      if (!sale || !original || sale >= original) return 0;
      return Math.round((original - sale) / original * 100);
    }
    const variant = variantOrOriginal;
    if (!variant.salePrice || !variant.originalPrice) return 0;
    if (variant.salePrice >= variant.originalPrice) return 0;
    return Math.round((variant.originalPrice - variant.salePrice) / variant.originalPrice * 100);
  }

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

  hasVariantImage(variant: any): boolean {
    return !!variant.mainImageUrl && variant.mainImageUrl !== this.product?.mainImageUrl;
  }

  onNameChange(): void {
    this.form.slug = this.form.name
      ? this.form.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
      : '';
  }

  compareById = (a: number, b: number): boolean => Number(a) === Number(b);

  // ── Getters ───────────────────────────────────

  get effectiveMainImage(): string | null {
    if (this.mainImageSource === 'upload') return this.mainImagePreview;
    return this.mainUrlValid === true ? this.form.mainImageUrl : null;
  }

  get totalStock(): number {
    if (this.isViewMode) {
      return this.product?.variants.reduce((s, v) => s + (v.stockQuantity || 0), 0) ?? 0;
    }
    return this.form.variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);
  }

  get minVariantPrice(): number {
    const prices = this.form.variants
      .map(v => v.salePrice || v.originalPrice || 0)
      .filter(p => p > 0);
    return prices.length ? Math.min(...prices) : 0;
  }

  get minPrice(): number {
    const prices = this.product?.variants
      .map(v => v.salePrice || v.originalPrice)
      .filter((p): p is number => !!p && p > 0) ?? [];
    return prices.length ? Math.min(...prices) : 0;
  }

  // ── Reviews ───────────────────────────────────

  get filteredReviews(): ProductReview[] {
    if (!this.selectedRating) return this.reviews;
    return this.reviews.filter(r => r.rating === this.selectedRating);
  }

  get ratingBreakdown(): { star: number; count: number; percent: number }[] {
    return [5, 4, 3, 2, 1].map(star => {
      const count = this.reviews.filter(r => r.rating === star).length;
      return { star, count, percent: this.reviews.length ? Math.round(count / this.reviews.length * 100) : 0 };
    });
  }

  get avgRating(): number {
    if (!this.reviews.length) return 0;
    return Math.round(this.reviews.reduce((s, r) => s + r.rating, 0) / this.reviews.length * 10) / 10;
  }

  get visibleReviewsCount(): number { return this.reviews.filter(r =>  r.isVisible).length; }
  get hiddenReviewsCount(): number  { return this.reviews.filter(r => !r.isVisible).length; }
  get repliedReviewsCount(): number { return this.reviews.filter(r => !!r.adminReply).length; }

  toggleVisibility(review: ProductReview): void { review.isVisible = !review.isVisible; }

  startReply(id: number): void {
    this.replyingId = id;
    this.replyText  = this.reviews.find(r => r.id === id)?.adminReply || '';
  }

  submitReply(review: ProductReview): void {
    review.adminReply = this.replyText;
    this.replyingId   = null;
    this.replyText    = '';
  }

  cancelReply(): void { this.replyingId = null; this.replyText = ''; }

  deleteReview(id: number): void { this.reviews = this.reviews.filter(r => r.id !== id); }

  getStars(rating: number): number[] { return Array(5).fill(0).map((_, i) => i + 1); }
}
