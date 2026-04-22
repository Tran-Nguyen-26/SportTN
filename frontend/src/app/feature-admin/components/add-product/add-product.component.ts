import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export interface VariantImage {
  preview: string;
  file: File | null; // null khi thêm bằng URL
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
  categoryId: number | null;
  brandId: number | null;
  active: boolean;
  mainImageUrl: string;
  variants: ProductVariantForm[];
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
  categories = [
    { id: 1, name: 'Thể Thao' },
    { id: 2, name: 'Bơi lội' },
    { id: 3, name: 'Chạy bộ' },
    { id: 4, name: 'Chống nắng' },
    { id: 5, name: 'Bóng đá' },
    { id: 6, name: 'Tennis' },
  ];

  brands = [
    { id: 1, name: 'DECATHLON' },
    { id: 2, name: 'NABAIJI' },
    { id: 3, name: 'KIPRUN' },
    { id: 4, name: 'DOMYOS' },
    { id: 5, name: 'QUECHUA' },
    { id: 6, name: 'NIKE' },
    { id: 7, name: 'ADIDAS' },
  ];

  reviews: ProductReview[] = [
    {
      id: 1,
      customerName:   'Nguyễn Văn An',
      customerAvatar: 'NA',
      rating:          5,
      comment:         'Sản phẩm rất tốt, chất liệu mềm mại, mặc thoáng khí khi chạy bộ. Giao hàng nhanh, đóng gói cẩn thận. Sẽ mua lại!',
      date:            '20/04/2025',
      isVisible:       true,
      adminReply:      'Cảm ơn bạn đã tin tưởng SportZone! Chúc bạn tập luyện vui vẻ 🏃',
      images:          []
    },
    {
      id: 2,
      customerName:   'Trần Thị Bình',
      customerAvatar: 'TB',
      rating:          4,
      comment:         'Áo đẹp, mặc vừa size M. Màu xanh đúng như hình. Chỉ hơi tiếc là không có túi nhỏ bên hông.',
      date:            '18/04/2025',
      isVisible:       true,
      adminReply:      null,
      images:          []
    },
    {
      id: 3,
      customerName:   'Lê Văn Cường',
      customerAvatar: 'LC',
      rating:          3,
      comment:         'Chất liệu ổn nhưng đường may hơi thô. Giá hơi cao so với chất lượng.',
      date:            '15/04/2025',
      isVisible:       true,
      adminReply:      null,
      images:          []
    },
    {
      id: 4,
      customerName:   'Phạm Thị Dung',
      customerAvatar: 'PD',
      rating:          5,
      comment:         'Mua lần 2 rồi, vẫn ưng lắm! Size chuẩn, màu đẹp, giặt nhiều lần không phai.',
      date:            '12/04/2025',
      isVisible:       true,
      adminReply:      'Cảm ơn bạn đã ủng hộ SportZone lần 2! ❤️',
      images:          []
    },
    {
      id: 5,
      customerName:   'Hoàng Văn Em',
      customerAvatar: 'HE',
      rating:          2,
      comment:         'Hàng nhận được khác màu so với ảnh, liên hệ shop chưa được phản hồi.',
      date:            '10/04/2025',
      isVisible:       false,
      adminReply:      null,
      images:          []
    },
  ];


  sizes  = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  colors = ['Đen', 'Trắng', 'Đỏ', 'Xanh dương', 'Xanh lá', 'Vàng', 'Hồng', 'Xám', 'Be'];

  // ── FORM DATA ────────────────────────────────
  form: ProductForm = {
    name:         '',
    description:  '',
    categoryId:   null,
    brandId:      null,
    active:       true,
    mainImageUrl: '',
    variants:     [],
  };

  // ── TAB STATE ────────────────────────────────
  activeTab: 'info' | 'variants' | 'images' | 'reviews' = 'info';
  isEditMode = false;
  productId: number | null = null;
  isLoading = false;

  // ── MAIN IMAGE ───────────────────────────────
  mainImageSource: 'upload' | 'url' = 'upload';
  mainImagePreview: string | null = null;   // dùng khi upload file
  mainUrlPreview: string = '';              // dùng khi nhập URL
  mainUrlValid: boolean | null = null;      // null=chưa check, true=ok, false=lỗi

  // ── EXTRA IMAGES ─────────────────────────────
  extraImageSource: 'upload' | 'url' = 'upload';
  extraImagePreviews: string[] = [];
  pendingExtraUrl: string = '';

  selectedRating = 0;
  replyingId: number | null = null;
  replyText = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
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
    // TODO: gọi API thật
    setTimeout(() => {
      this.form = {
        name:         'Áo thun chạy bộ nam thoáng khí - Run Dry',
        description:  'Áo chạy bộ nam, chất liệu thoáng khí, thấm mồ hôi nhanh',
        categoryId:   3,
        brandId:      3,
        active:       true,
        mainImageUrl: '',
        variants: [
          {
            sku: 'RUN-SHIRT-M-BLUE-M', color: 'Xanh dương', size: 'M',
            originalPrice: 299000, salePrice: 199000,
            stockQuantity: 80, weightGram: 180,
            images: [], imageSource: 'upload', pendingUrl: '',
          },
          {
            sku: 'RUN-SHIRT-M-BLACK-L', color: 'Đen', size: 'L',
            originalPrice: 299000, salePrice: 199000,
            stockQuantity: 65, weightGram: 190,
            images: [], imageSource: 'upload', pendingUrl: '',
          },
        ],
      };
      this.mainImagePreview = 'assets/products/ao-chay-bo.jpg';
      this.isLoading = false;
    }, 500);
  }

  // ── VARIANT METHODS ───────────────────────────
  addVariant(): void {
    this.form.variants.push({
      sku: '', color: '', size: '',
      originalPrice: null, salePrice: null,
      stockQuantity: null, weightGram: null,
      images: [],
      imageSource: 'upload',
      pendingUrl: '',
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
    reader.onload = () => {
      this.mainImagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeMainImage(): void {
    this.mainImagePreview = null;
  }

  onMainImageUrlChange(event: Event): void {
    const url = (event.target as HTMLInputElement).value.trim();
    this.form.mainImageUrl = url;
    this.mainUrlPreview    = url;
    this.mainUrlValid      = null; // reset, chờ img onload/onerror
  }

  clearMainUrl(): void {
    this.form.mainImageUrl = '';
    this.mainUrlPreview    = '';
    this.mainUrlValid      = null;
  }

  onUrlImgLoad(type: 'main'): void {
    if (type === 'main') this.mainUrlValid = true;
  }

  onUrlImgError(type: 'main'): void {
    if (type === 'main') this.mainUrlValid = false;
  }

  // ── EXTRA IMAGES ─────────────────────────────
  onExtraImagesChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;
    const remaining = 6 - this.extraImagePreviews.length;
    Array.from(files).slice(0, remaining).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.extraImagePreviews.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
    (event.target as HTMLInputElement).value = '';
  }

  removeExtraImage(index: number): void {
    this.extraImagePreviews.splice(index, 1);
  }

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
      reader.onload = () => {
        variant.images.push({ preview: reader.result as string, file });
      };
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

  // ── SUBMIT ────────────────────────────────────
  onSubmit(): void {
    if (this.isEditMode) {
      // TODO: gọi update API
    } else {
      // TODO: gọi create API
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/products']);
  }

  // ── HELPERS ───────────────────────────────────
  isFormValid(): boolean {
    return !!(
      this.form.name &&
      this.form.categoryId &&
      this.form.brandId &&
      this.form.variants.length > 0
    );
  }

  getDiscountPercent(variant: ProductVariantForm): number {
    if (!variant.salePrice || !variant.originalPrice) return 0;
    if (variant.salePrice >= variant.originalPrice) return 0;
    return Math.round(
      (variant.originalPrice - variant.salePrice) / variant.originalPrice * 100
    );
  }

  getCategoryName(id: number | null): string {
    if (id === null) return '—';
    return this.categories.find(c => c.id === id)?.name || '—';
  }

  getBrandName(id: number | null): string {
    if (id === null) return '—';
    return this.brands.find(b => b.id === id)?.name || '—';
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

  // Ảnh chính thực sự đang có (upload hoặc URL)
  get effectiveMainImage(): string | null {
    if (this.mainImageSource === 'upload') return this.mainImagePreview;
    return this.mainUrlValid === true ? this.form.mainImageUrl : null;
  }

  get filteredReviews(): ProductReview[] {
    if (!this.selectedRating) return this.reviews;
    return this.reviews.filter(r => r.rating === this.selectedRating);
  }

  get ratingBreakdown(): { star: number; count: number; percent: number }[] {
    return [5, 4, 3, 2, 1].map(star => {
      const count = this.reviews.filter(r => r.rating === star).length;
      return {
        star,
        count,
        percent: this.reviews.length
          ? Math.round(count / this.reviews.length * 100)
          : 0
      };
    });
  }

  get avgRating(): number {
    if (!this.reviews.length) return 0;
    const sum = this.reviews.reduce((s, r) => s + r.rating, 0);
    return Math.round(sum / this.reviews.length * 10) / 10;
  }

  toggleVisibility(review: ProductReview): void {
    review.isVisible = !review.isVisible;
  }

  startReply(id: number): void {
    this.replyingId = id;
    const review = this.reviews.find(r => r.id === id);
    this.replyText = review?.adminReply || '';
  }

  submitReply(review: ProductReview): void {
    review.adminReply = this.replyText;
    this.replyingId   = null;
    this.replyText    = '';
  }

  cancelReply(): void {
    this.replyingId = null;
    this.replyText  = '';
  }

  deleteReview(id: number): void {
    this.reviews = this.reviews.filter(r => r.id !== id);
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  get visibleReviewsCount(): number {
    return this.reviews ? this.reviews.filter(r => r.isVisible).length : 0;
  }

// Thống kê số lượng review đã ẩn
  get hiddenReviewsCount(): number {
    return this.reviews ? this.reviews.filter(r => !r.isVisible).length : 0;
  }

// Thống kê số lượng review đã trả lời
  get repliedReviewsCount(): number {
    return this.reviews ? this.reviews.filter(r => !!r.adminReply).length : 0;
  }
}
