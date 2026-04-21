import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

export interface VariantImage {
  preview: string;   // base64 để hiển thị
  file: File;        // file thực để gửi lên BE
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
}

export interface ProductForm {
  name: string;
  description: string;
  categoryId: number | null;
  brandId: number | null;
  active: boolean;
  variants: ProductVariantForm[];
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  // ── DROPDOWN DATA ────────────────────────────
  categories = [
    { id: 1,  name: 'Thể Thao' },
    { id: 2,  name: 'Bơi lội' },
    { id: 3,  name: 'Chạy bộ' },
    { id: 4,  name: 'Chống nắng' },
    { id: 5,  name: 'Bóng đá' },
    { id: 6,  name: 'Tennis' },
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

  sizes  = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  colors = ['Đen', 'Trắng', 'Đỏ', 'Xanh dương', 'Xanh lá', 'Vàng', 'Hồng', 'Xám', 'Be'];

  // ── MAIN IMAGES ──────────────────────────────
  mainImagePreview: string | null = null;
  extraImagePreviews: string[] = [];

  // ── FORM DATA ─────────────────────────────────
  form: ProductForm = {
    name:        '',
    description: '',
    categoryId:  null,
    brandId:     null,
    active:      true,
    variants:    [],
  };

  // ── ACTIVE TAB ────────────────────────────────
  activeTab: 'info' | 'variants' | 'images' = 'info';

  isEditMode = false;
  productId: number | null = null;
  isLoading = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  // ── VARIANT METHODS ───────────────────────────
  addVariant(): void {
    this.form.variants.push({
      sku:           '',
      color:         '',
      size:          '',
      originalPrice: null,
      salePrice:     null,
      stockQuantity: null,
      weightGram:    null,
      images: [],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = +id;
      this.loadProduct(+id);
    }
  }

  private loadProduct(id: number): void {
    this.isLoading = true;

    // TODO: gọi API thật
    // this.productService.getById(id).subscribe(...)

    setTimeout(() => {
      this.form = {
        name:        'Áo thun chạy bộ nam thoáng khí - Run Dry',
        description: 'Áo chạy bộ nam, chất liệu thoáng khí, thấm mồ hôi nhanh',
        categoryId:  3,
        brandId:     3,
        active:      true,
        variants: [
          {
            sku:           'RUN-SHIRT-M-BLUE-M',
            color:         'Xanh dương',
            size:          'M',
            originalPrice: 299000,
            salePrice:     199000,
            stockQuantity: 80,
            weightGram:    180,
            images: [],
          },
          {
            sku:           'RUN-SHIRT-M-BLACK-L',
            color:         'Đen',
            size:          'L',
            originalPrice: 299000,
            salePrice:     199000,
            stockQuantity: 65,
            weightGram:    190,
            images: [],
          }
        ],
      };
      this.mainImagePreview = 'assets/products/ao-chay-bo.jpg';
      this.isLoading = false;
    }, 500);
  }

  removeVariant(index: number): void {
    this.form.variants.splice(index, 1);
  }

  generateSku(variant: ProductVariantForm, index: number): void {
    const name     = this.form.name.slice(0, 4).toUpperCase().replace(/\s/g, '');
    const color    = variant.color.slice(0, 3).toUpperCase();
    const size     = variant.size.replace(/\s/g, '');
    variant.sku    = `${name}-${color}-${size}-${index + 1}`;
  }

  // ── IMAGE METHODS ─────────────────────────────
  onMainImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.mainImagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onExtraImagesChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.extraImagePreviews.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  removeExtraImage(index: number): void {
    this.extraImagePreviews.splice(index, 1);
  }

  removeMainImage(): void {
    this.mainImagePreview = null;
  }

  // ── SUBMIT ────────────────────────────────────
  onSubmit(): void {
    if (this.isEditMode) {
      //api
    } else {
      //api
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
    if (this.form.variants.length === 0) return 0;
    // Lấy giá nhỏ nhất từ originalPrice hoặc salePrice
    const prices = this.form.variants
      .map(v => v.salePrice || v.originalPrice || 0)
      .filter(p => p > 0);
    return prices.length > 0 ? Math.min(...prices) : 0;
  }

  // Xử lý upload ảnh variant
  onVariantImageChange(event: Event, variantIndex: number) {
    const files = Array.from((event.target as HTMLInputElement).files || []);
    const variant = this.form.variants[variantIndex];
    const remaining = 4 - (variant.images?.length || 0);

    files.slice(0, remaining).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        variant.images.push({
          preview: reader.result as string,
          file
        });
      };
      reader.readAsDataURL(file);
    });

    // Reset input để có thể chọn lại cùng file
    (event.target as HTMLInputElement).value = '';
  }

  removeVariantImage(variantIndex: number, imageIndex: number) {
    this.form.variants[variantIndex].images.splice(imageIndex, 1);
  }
}
