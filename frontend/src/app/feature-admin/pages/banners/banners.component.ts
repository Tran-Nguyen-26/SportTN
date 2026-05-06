import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import {BannerCreateRequest, BannerResponse, BannerService} from '../../../core/services/banner/banner.service';
import {CategoryService} from "../../../core/services/category/category.service";

export type BannerPosition = 'HERO' | 'SUB_LEFT' | 'SUB_RIGHT' | 'CATEGORY' | 'POPUP';

export interface Banner {
  id: number;
  title: string;
  altText: string;
  imageUrl: string;
  linkUrl: string;
  position: BannerPosition;
  displayOrder: number;
  startDate: string;
  endDate: string;
  active: boolean;
  previewColor: string
}

export interface BannerForm {
  title: string;
  altText: string;
  imageUrl: string;
  linkUrl: string;
  position: BannerPosition;
  displayOrder: number;
  startDate: string;
  endDate: string;
  active: boolean;
  previewUrl: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  categoryId: number | null;
}

export interface CategoryOption {
  id: number;
  name: string;
  slug: string;
  // imageUrl?: string;
}


@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.css']
})
export class BannersComponent implements OnInit {

  searchQuery      = '';
  selectedPosition = '';
  selectedStatus   = '';
  drawerVisible    = false;
  editingBanner: BannerResponse | null = null;
  isSaving = false;

  // Category selector
  categories: CategoryOption[] = [];
  isCategoryLoading = false;
  categorySearchQuery = '';
  selectedCategory: CategoryOption | null = null;


  positionTabs = [
    { value: '',          label: 'Tất cả'     },
    { value: 'HERO',      label: 'Hero Slider' },
    { value: 'SUB_LEFT',  label: 'Sub trái'   },
    { value: 'SUB_RIGHT', label: 'Sub phải'   },
    { value: 'CATEGORY',  label: 'Danh mục'   },
    { value: 'POPUP',     label: 'Popup'       },
  ];

  positionOptions = [
    { value: 'HERO',      label: 'Hero Slider', icon: 'panorama',     desc: 'Banner chính, toàn chiều rộng trang'   },
    { value: 'SUB_LEFT',  label: 'Sub trái',    icon: 'view_sidebar', desc: 'Banner phụ bên trái dưới hero'         },
    { value: 'SUB_RIGHT', label: 'Sub phải',    icon: 'view_sidebar', desc: 'Banner phụ bên phải dưới hero'         },
    { value: 'CATEGORY',  label: 'Danh mục',    icon: 'grid_view',    desc: 'Banner trong section danh mục'         },
    { value: 'POPUP',     label: 'Popup',       icon: 'open_in_new',  desc: 'Hiện dạng popup khi vào trang'         },
  ];

  banners = signal<BannerResponse[]>([]);

  form: BannerForm = this.emptyForm();

  constructor(
    private router: Router,
    private bannerService: BannerService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadBanners();
  }

  // ── Data ────────────────────────────────────────────────────────────────────

  loadBanners(): void {
    this.bannerService.getAllBanners().subscribe({
      next: (res) => {
        if (res.data) {
          // Cast position string → BannerPosition để dùng được getPositionLabel()
          const mapped = res.data.map(b => ({
            ...b,
            position: b.position as BannerPosition
          }));
          console.log('Danh sách banners:', mapped);
          this.banners.set(mapped);
        }
      },
      error: (err) => console.error('Lỗi tải banner:', err)
    });
  }

  loadCategories(): void {
    if (this.categories.length > 0) return;

    this.isCategoryLoading = true;

    this.categoryService.getCategoryOption().subscribe({
      next: (res) => {
        this.categories = res.data;
        console.log("category options: ", this.categories);
        this.isCategoryLoading = false;
      },
      error: (err) => {
        console.error("Lỗi load categories:", err);
        this.isCategoryLoading = false;
      }
    });
  }


  // ── Computed ────────────────────────────────────────────────────────────────

  get totalCount(): number {
    return this.banners().length;
  }

  activeCount(): number {
    return this.banners().filter(b => b.active).length;
  }

  hiddenCount(): number {
    return this.banners().filter(b => !b.active).length;
  }

  positionCount(): number {
    return new Set(this.banners().filter(b => b.active).map(b => b.position)).size;
  }

  activeBanners(): BannerResponse[] {
    return this.banners()
      .filter(b => b.active && b.position === 'HERO')
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  // ── Filter ──────────────────────────────────────────────────────────────────

  get filteredBanners(): BannerResponse[] {
    return this.banners().filter(b => {
      const q           = this.searchQuery.toLowerCase();
      const matchSearch = !q || b.title.toLowerCase().includes(q);
      const matchPos    = !this.selectedPosition || b.position === this.selectedPosition;
      const matchStatus = !this.selectedStatus   || b.active.toString() === this.selectedStatus;
      return matchSearch && matchPos && matchStatus;
    });
  }

  getPositionCount(pos: string): number {
    if (!pos) return this.banners().length;
    return this.banners().filter(b => b.position === pos).length;
  }

  getPositionLabel(pos: BannerPosition): string {
    const map: Record<BannerPosition, string> = {
      HERO:      'Hero',
      SUB_LEFT:  'Sub trái',
      SUB_RIGHT: 'Sub phải',
      CATEGORY:  'Danh mục',
      POPUP:     'Popup',
    };
    return map[pos] ?? pos;
  }

  // ── Order ────────────────────────────────────────────────────────────────────

  moveUp(banner: BannerResponse): void {
    if (banner.displayOrder <= 1) return;
    this.banners.update(list => {
      const prev = list.find(
        b => b.position === banner.position && b.displayOrder === banner.displayOrder - 1
      );
      if (prev) prev.displayOrder++;
      banner.displayOrder--;
      return [...list];
    });
  }

  moveDown(banner: BannerResponse): void {
    this.banners.update(list => {
      const next = list.find(
        b => b.position === banner.position && b.displayOrder === banner.displayOrder + 1
      );
      if (next) next.displayOrder--;
      banner.displayOrder++;
      return [...list];
    });
  }

  changeOrder(delta: number): void {
    this.form.displayOrder = Math.max(1, Math.min(99, this.form.displayOrder + delta));
  }

  // ── Drawer ───────────────────────────────────────────────────────────────────

  openDrawer(banner?: BannerResponse): void {
    if (banner) {
      this.editingBanner = banner;
      this.form = {
        title:        banner.title,
        altText:      banner.altText,
        imageUrl:     banner.imageUrl,
        linkUrl:      banner.linkUrl,
        position:     banner.position as BannerPosition,
        displayOrder: banner.displayOrder,
        startDate:    banner.startDate,
        endDate:      banner.endDate,
        active:       banner.active,
        previewUrl:   null,
        imageWidth:   null,
        imageHeight:  null,
        categoryId:   banner.categoryId ?? null,
      };

      if (banner.categoryId) {
        this.selectedCategory = this.categories.find(c => c.id === banner.categoryId) ?? null;
      }

    } else {
      this.editingBanner = null;
      this.selectedCategory = null;
      this.form = this.emptyForm();
    }
    this.categorySearchQuery = '';
    this.loadCategories();
    this.drawerVisible = true;
  }

  closeDrawer(): void {
    this.drawerVisible = false;
    this.editingBanner = null;
    this.form = this.emptyForm();
  }

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('overlay')) this.closeDrawer();
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.form.previewUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        this.form.imageWidth  = img.naturalWidth;
        this.form.imageHeight = img.naturalHeight;
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.form.previewUrl  = null;
    this.form.imageWidth  = null;
    this.form.imageHeight = null;
  }

  isFormValid(): boolean {
    return !!(this.form.title && (this.form.previewUrl || this.form.imageUrl));
  }

  save(): void {
    if (!this.isFormValid()) return;
    this.isSaving = true;

    const request: BannerCreateRequest = {
      title:        this.form.title,
      altText:      this.form.altText,
      imageUrl:     this.form.previewUrl ?? this.form.imageUrl,
      linkUrl:      this.form.linkUrl,
      position:     this.form.position,
      displayOrder: this.form.displayOrder,
      active:       this.form.active,
      startDate:    this.toDateTime(this.form.startDate),
      endDate:      this.toDateTime(this.form.endDate),
      // previewColor: '#E8F2FF', // default, có thể để user chọn sau
      categoryId: this.form.position === 'CATEGORY' ? this.form.categoryId : null,
    };

    if (this.editingBanner) {
      // TODO: updateBanner — làm sau
      this.closeDrawer();
      this.isSaving = false;
    } else {
      this.bannerService.createBanner(request).subscribe({
        next: (res) => {
          if (res.data) {
            this.banners.update(list =>
              [...list, { ...res.data!, position: res.data!.position as BannerPosition }]);
          }
          this.isSaving = false;
          this.closeDrawer();
        },
        error: (err) => {
          console.error('Lỗi tạo banner:', err);
          this.isSaving = false;
        }
      });
    }
  }

  toggleActive(banner: BannerResponse): void {
    const previousState = banner.active;

    this.banners.update(list =>
      list.map(b => b.id === banner.id ? { ...b, active: !b.active } : b)
    );

    this.bannerService.toggleBannerStatus(banner.id).subscribe({
      next: (response) => {
        console.log('Cập nhật trạng thái banner thành công:', response);
      },
      error: (error) => {
        console.error('Lỗi khi cập nhật trạng thái banner:', error);

        this.banners.update(list =>
          list.map(b => b.id === banner.id ? { ...b, active: previousState } : b)
        );
      }
    });
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none'; // ẩn img lỗi → fallback background + icon hiện ra
  }

  deleteBanner(id: number): void {
    if (!confirm('Bạn chắc chắn muốn xóa banner này?')) return;

    const previousList = this.banners();

    this.banners.update(list => list.filter(b => b.id !== id));

    this.bannerService.deleteBanner(id).subscribe({
      next: (response) => {
        console.log('Xóa banner thành công:', response);
      },
      error: (error) => {
        console.error('Lỗi khi xóa banner:', error);
        this.banners.set(previousList);
      }
    });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  private toDateTime(date: string): string {
    if (!date) return '';
    if (date.includes('-') && date.length === 10) {
      const [yyyy, mm, dd] = date.split('-');
      return `${dd}-${mm}-${yyyy}`;
    }
    return date;
  }

  private emptyForm(): BannerForm {
    return {
      title: '', altText: '', imageUrl: '', linkUrl: '',
      position: 'HERO', displayOrder: 1,
      startDate: '', endDate: '', active: true,
      previewUrl: null, imageWidth: null, imageHeight: null, categoryId: null
    };
  }

  get filteredCategories(): CategoryOption[] {
    const q = this.categorySearchQuery.toLowerCase();
    if (!q) return this.categories;
    return this.categories.filter(c => c.name.toLowerCase().includes(q));
  }

  selectCategory(cat: CategoryOption): void {
    this.form.categoryId  = cat.id;
    this.selectedCategory = cat;
    if (!this.form.linkUrl) {
      this.form.linkUrl = `/category/${cat.slug}`;
    }
  }

  clearCategory(): void {
    this.form.categoryId  = null;
    this.selectedCategory = null;
  }

}
