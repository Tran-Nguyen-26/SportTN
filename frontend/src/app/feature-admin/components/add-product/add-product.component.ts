import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandOption, BrandService } from '../../../core/services/brand/brand.service';
import { CategoryOption } from '../../pages/banners/banners.component';
import { CategoryService } from '../../../core/services/category/category.service';
import { ProductService } from '../../../core/services/product/product.service';

export interface VariantImage {
  preview: string;
  file: File | null;
}

export interface ProductVariantForm {
  sku: string;
  color: string;
  size: string;
  originalPrice: number | null;
  salePrice: number | null;
  stockQuantity: number | null;
  weightGram: number | null;
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

// ── Request DTOs gửi lên BE ──────────────────────────────────────────────────

export interface VariantImageRequest {
  imageUrl: string;
  displayOrder: number;
}

export interface ProductVariantRequest {
  sku: string;
  color: string;
  size: string;
  originalPrice: number;
  salePrice: number | null;
  stockQuantity: number;
  weightGram: number | null;
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

export interface ProductUpdateRequest {
  name: string;
  description: string;
  slug: string;
  categoryId: number;
  brandId: number;
  active: boolean;
  mainImageUrl: string;
  variants: ProductVariantRequest[];
}

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
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  // ── DROPDOWN DATA ────────────────────────────
  categories = signal<CategoryOption[]>([]);
  brands     = signal<BrandOption[]>([]);

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

  sizes  = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  colors = ['Đen', 'Trắng', 'Đỏ', 'Xanh dương', 'Xanh lá', 'Vàng', 'Hồng', 'Xám', 'Be'];

  // ── FORM DATA ────────────────────────────────
  form: ProductForm = {
    name: '', description: '', slug: '', categoryId: null,
    brandId: null, active: true, mainImageUrl: '', variants: [],
  };

  // ── UI STATE ─────────────────────────────────
  activeTab: 'info' | 'variants' | 'images' | 'reviews' = 'info';
  isEditMode  = false;
  productId: number | null = null;
  isLoading   = false;
  isSaving    = false;
  saveError   = '';
  saveSuccess = false;

  // ── MAIN IMAGE ───────────────────────────────
  mainImageSource: 'upload' | 'url' = 'upload';
  mainImagePreview: string | null = null;
  mainUrlPreview   = '';
  mainUrlValid: boolean | null = null;

  // ── EXTRA IMAGES ─────────────────────────────
  extraImageSource: 'upload' | 'url' = 'upload';
  extraImagePreviews: string[] = [];
  pendingExtraUrl = '';

  selectedRating = 0;
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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId  = +id;
      this.loadProduct(+id);
    }
  }

  // ── LOAD (edit mode) ─────────────────────────

  private loadProduct(id: number): void {
    this.isLoading = true;
    // TODO: gọi this.productService.getById(id)
    setTimeout(() => {
      this.form = {
        name: 'Áo thun chạy bộ nam thoáng khí - Run Dry',
        slug: 'ao-thun-chay-bo-nam-thoang-khi',
        description: 'Áo chạy bộ nam, chất liệu thoáng khí, thấm mồ hôi nhanh',
        categoryId: 3, brandId: 3, active: true, mainImageUrl: '',
        variants: [
          {
            sku: 'RUN-SHIRT-M-BLUE-M', color: 'Xanh dương', size: 'M',
            originalPrice: 299000, salePrice: 199000,
            stockQuantity: 80, weightGram: 180,
            images: [], imageSource: 'upload', pendingUrl: '',
          },
        ],
      };
      this.mainImagePreview = 'assets/products/ao-chay-bo.jpg';
      this.isLoading = false;
    }, 500);

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

  // ── BUILD REQUEST ─────────────────────────────

  private buildRequest(): ProductCreateRequest {
    return {
      name:         this.form.name.trim(),
      description:  this.form.description.trim(),
      slug: this.form.slug,
      categoryId:   this.form.categoryId!,
      brandId:      this.form.brandId!,
      active:       this.form.active,
      mainImageUrl: this.effectiveMainImage ?? this.form.mainImageUrl,
      variants: this.form.variants.map(v => ({
        sku:           v.sku.trim(),
        color:         v.color,
        size:          v.size,
        originalPrice: v.originalPrice!,
        salePrice:     v.salePrice ?? null,
        stockQuantity: v.stockQuantity!,
        weightGram:    v.weightGram ?? null,
        // Mỗi VariantImage.preview là URL string (upload → base64, url → http string)
        images: v.images.map((img, idx) => ({
          imageUrl:     img.preview,
          displayOrder: idx + 1,
        })),
      })),
    };
  }

  // ── SUBMIT ────────────────────────────────────

  onSubmit(): void {
    if (!this.isFormValid()) return;

    this.isSaving    = true;
    this.saveError   = '';
    this.saveSuccess = false;

    const request = this.buildRequest();

    if (this.isEditMode && this.productId) {
      // TODO: wire update khi có BE
      // this.productService.updateProduct(this.productId, request).subscribe(...)
      console.log('[AddProduct] updateProduct payload:', request);
      this.isSaving = false;
    } else {
      this.productService.createProduct(request).subscribe({
        next: (res) => {
          console.log('[AddProduct] createProduct success:', res);
          this.isSaving    = false;
          this.saveSuccess = true;
          // Chuyển về trang danh sách sau 1.2s
          setTimeout(() => this.router.navigate(['/admin/products']), 1200);
        },
        error: (err) => {
          console.error('[AddProduct] createProduct error:', err);
          this.isSaving  = false;
          this.saveError = err?.error?.message || 'Tạo sản phẩm thất bại. Vui lòng thử lại.';
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/products']);
  }

  // ── VARIANT METHODS ───────────────────────────

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

  // ── MAIN IMAGE ───────────────────────────────

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

  clearMainUrl(): void {
    this.form.mainImageUrl = '';
    this.mainUrlPreview    = '';
    this.mainUrlValid      = null;
  }

  onUrlImgLoad(type: 'main'): void  { if (type === 'main') this.mainUrlValid = true; }
  onUrlImgError(type: 'main'): void { if (type === 'main') this.mainUrlValid = false; }

  // ── EXTRA IMAGES ─────────────────────────────

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

  // ── VARIANT IMAGES ────────────────────────────

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

  // ── HELPERS ───────────────────────────────────

  isFormValid(): boolean {
    return !!(
      this.form.name &&
      this.form.categoryId &&
      this.form.brandId &&
      this.form.variants.length > 0 &&
      this.form.variants.every(v =>
        v.sku && v.color && v.size &&
        v.originalPrice !== null && v.originalPrice > 0 &&
        v.stockQuantity !== null && v.stockQuantity >= 0
      )
    );
  }

  getDiscountPercent(variant: ProductVariantForm): number {
    if (!variant.salePrice || !variant.originalPrice) return 0;
    if (variant.salePrice >= variant.originalPrice) return 0;
    return Math.round((variant.originalPrice - variant.salePrice) / variant.originalPrice * 100);
  }

  getCategoryName(id: number | null): string {
    if (id === null) return '—';
    return this.categories().find(c => c.id === id)?.name || '—';
  }

  getBrandName(id: number | null): string {
    if (id === null) return '—';
    return this.brands().find(b => b.id === id)?.name || '—';
  }

  get totalStock(): number {
    return this.form.variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);
  }

  get minVariantPrice(): number {
    const prices = this.form.variants
      .map(v => v.salePrice || v.originalPrice || 0)
      .filter(p => p > 0);
    return prices.length > 0 ? Math.min(...prices) : 0;
  }

  get effectiveMainImage(): string | null {
    if (this.mainImageSource === 'upload') return this.mainImagePreview;
    return this.mainUrlValid === true ? this.form.mainImageUrl : null;
  }

  // ── REVIEWS ───────────────────────────────────

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

  get visibleReviewsCount(): number  { return this.reviews.filter(r =>  r.isVisible).length; }
  get hiddenReviewsCount(): number   { return this.reviews.filter(r => !r.isVisible).length; }
  get repliedReviewsCount(): number  { return this.reviews.filter(r => !!r.adminReply).length; }

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

  //tự động tạo slug
  onNameChange() {
    if (this.form.name) {
      this.form.slug = this.form.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        // Thay thế các ký tự đặc biệt (đặc biệt là chữ đ/Đ)
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
    } else {
      this.form.slug = '';
    }
  }
}
