import { Component } from '@angular/core';

export type BannerPosition = 'HERO' | 'SUB_LEFT' | 'SUB_RIGHT' | 'CATEGORY' | 'POPUP';


// export enum BannerPosition {
//   HOME_MAIN = 'HOME_MAIN',
//   HOME_SUB = 'HOME_SUB',
//   CATEGORY_TOP = 'CATEGORY_TOP'
// }

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
  previewColor: string; // dùng để hiển thị placeholder màu thay cho ảnh thật
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
}

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.css']
})
export class BannersComponent {

  searchQuery = '';
  selectedPosition = '';
  selectedStatus = '';
  drawerVisible = false;
  editingBanner: Banner | null = null;

  positionTabs = [
    { value: '',          label: 'Tất cả' },
    { value: 'HERO',      label: 'Hero Slider' },
    { value: 'SUB_LEFT',  label: 'Sub trái' },
    { value: 'SUB_RIGHT', label: 'Sub phải' },
    { value: 'CATEGORY',  label: 'Danh mục' },
    { value: 'POPUP',     label: 'Popup' },
  ];

  positionOptions = [
    { value: 'HERO',      label: 'Hero Slider',   icon: 'panorama',     desc: 'Banner chính, toàn chiều rộng trang' },
    { value: 'SUB_LEFT',  label: 'Sub trái',       icon: 'view_sidebar', desc: 'Banner phụ bên trái dưới hero' },
    { value: 'SUB_RIGHT', label: 'Sub phải',       icon: 'view_sidebar', desc: 'Banner phụ bên phải dưới hero' },
    { value: 'CATEGORY',  label: 'Danh mục',       icon: 'grid_view',    desc: 'Banner trong section danh mục' },
    { value: 'POPUP',     label: 'Popup',          icon: 'open_in_new',  desc: 'Hiện dạng popup khi vào trang' },
  ];

  banners: Banner[] = [
    {
      id: 1, title: 'Banner hè 2025 - Bộ sưu tập bơi lội',
      altText: 'Bộ sưu tập đồ bơi mùa hè 2025',
      imageUrl: '', linkUrl: '/the-thao/boi-loi',
      position: 'HERO', displayOrder: 1,
      startDate: '01/06/2025', endDate: '31/08/2025',
      active: true, previewColor: '#dbeafe'
    },
    {
      id: 2, title: 'Flash Sale Giày Chạy Bộ',
      altText: 'Flash sale giày chạy bộ giảm 30%',
      imageUrl: '', linkUrl: '/the-thao/chay-bo',
      position: 'HERO', displayOrder: 2,
      startDate: '01/07/2025', endDate: '31/07/2025',
      active: true, previewColor: '#fce7f3'
    },
    {
      id: 3, title: 'Bộ sưu tập Tennis mới nhất',
      altText: 'Đồ tennis cao cấp',
      imageUrl: '', linkUrl: '/the-thao/tennis',
      position: 'HERO', displayOrder: 3,
      startDate: '', endDate: '',
      active: true, previewColor: '#d1fae5'
    },
    {
      id: 4, title: 'Ưu đãi kính bơi TYR',
      altText: 'Kính bơi TYR giảm giá',
      imageUrl: '', linkUrl: '/boi-loi/kinh-boi',
      position: 'SUB_LEFT', displayOrder: 1,
      startDate: '', endDate: '',
      active: true, previewColor: '#fef3c7'
    },
    {
      id: 5, title: 'Áo chống nắng UPF50+',
      altText: 'Áo chống nắng UPF50',
      imageUrl: '', linkUrl: '/chong-nang',
      position: 'SUB_RIGHT', displayOrder: 1,
      startDate: '', endDate: '',
      active: true, previewColor: '#ede9fe'
    },
    {
      id: 6, title: 'Danh mục Bóng đá',
      altText: 'Đồ bóng đá chính hãng',
      imageUrl: '', linkUrl: '/the-thao/bong-da',
      position: 'CATEGORY', displayOrder: 1,
      startDate: '', endDate: '',
      active: false, previewColor: '#fee2e2'
    },
    {
      id: 7, title: 'Popup khuyến mãi tháng 7',
      altText: 'Khuyến mãi đặc biệt',
      imageUrl: '', linkUrl: '/khuyen-mai',
      position: 'POPUP', displayOrder: 1,
      startDate: '01/07/2025', endDate: '31/07/2025',
      active: true, previewColor: '#f0fdf4'
    },
  ];

  form: BannerForm = this.emptyForm();

  // ── Computed ────────────────────────────────
  activeCount()   { return this.banners.filter(b => b.active).length; }
  hiddenCount()   { return this.banners.filter(b => !b.active).length; }
  positionCount() {
    return new Set(this.banners.filter(b => b.active).map(b => b.position)).size;
  }

  activeBanners() {
    return this.banners
      .filter(b => b.active && b.position === 'HERO')
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  // ── Filter ──────────────────────────────────
  get filteredBanners(): Banner[] {
    return this.banners.filter(b => {
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q || b.title.toLowerCase().includes(q);
      const matchPos    = !this.selectedPosition || b.position === this.selectedPosition;
      const matchStatus = !this.selectedStatus
        || b.active.toString() === this.selectedStatus;
      return matchSearch && matchPos && matchStatus;
    });
  }

  getPositionCount(pos: string): number {
    if (!pos) return this.banners.length;
    return this.banners.filter(b => b.position === pos).length;
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

  // ── Order ────────────────────────────────────
  moveUp(banner: Banner) {
    if (banner.displayOrder <= 1) return;
    const prev = this.banners.find(
      b => b.position === banner.position && b.displayOrder === banner.displayOrder - 1
    );
    if (prev) prev.displayOrder++;
    banner.displayOrder--;
  }

  moveDown(banner: Banner) {
    const next = this.banners.find(
      b => b.position === banner.position && b.displayOrder === banner.displayOrder + 1
    );
    if (next) next.displayOrder--;
    banner.displayOrder++;
  }

  changeOrder(delta: number) {
    this.form.displayOrder = Math.max(1, Math.min(99, this.form.displayOrder + delta));
  }

  // ── Drawer ──────────────────────────────────
  openDrawer(banner?: Banner) {
    if (banner) {
      this.editingBanner = banner;
      this.form = {
        title:        banner.title,
        altText:      banner.altText,
        imageUrl:     banner.imageUrl,
        linkUrl:      banner.linkUrl,
        position:     banner.position,
        displayOrder: banner.displayOrder,
        startDate:    banner.startDate,
        endDate:      banner.endDate,
        active:       banner.active,
        previewUrl:   null,
        imageWidth:   null,
        imageHeight:  null,
      };
    } else {
      this.editingBanner = null;
      this.form = this.emptyForm();
    }
    this.drawerVisible = true;
  }

  closeDrawer() {
    this.drawerVisible = false;
    this.editingBanner = null;
    this.form = this.emptyForm();
  }

  onOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('overlay')) this.closeDrawer();
  }

  onFileChange(event: Event) {
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

  removeImage() {
    this.form.previewUrl   = null;
    this.form.imageWidth   = null;
    this.form.imageHeight  = null;
  }

  isFormValid(): boolean {
    return !!(this.form.title && (this.form.previewUrl || this.form.imageUrl));
  }

  save() {
    if (!this.isFormValid()) return;
    // TODO: gọi API
    this.closeDrawer();
  }

  deleteBanner(id: number) {
    // TODO: confirm + API
    this.banners = this.banners.filter(b => b.id !== id);
  }

  private emptyForm(): BannerForm {
    return {
      title: '', altText: '', imageUrl: '', linkUrl: '',
      position: 'HERO', displayOrder: 1,
      startDate: '', endDate: '', active: true,
      previewUrl: null, imageWidth: null, imageHeight: null,
    };
  }
}
