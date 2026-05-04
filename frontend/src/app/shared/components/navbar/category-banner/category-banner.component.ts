import {
  Component, Input, Output, EventEmitter,
  OnInit, OnChanges, SimpleChanges
} from '@angular/core';
import { Category } from 'src/app/core/models/category/category.model';

@Component({
  selector: 'app-category-banner',
  templateUrl: './category-banner.component.html',
  styleUrls: ['./category-banner.component.css']
})
export class CategoryBannerComponent implements OnInit, OnChanges {

  categories: Category[] = [
    {
      id: 1, name: 'Môn thể thao', slug: 'mon-the-thao',
      children: [
        {
          id: 11, name: 'Nam', slug: 'nam',
          children: [
            { id: 111, name: 'Áo thể thao nam',      slug: 'ao-the-thao-nam',      children: [] },
            { id: 112, name: 'Quần thể thao nam',     slug: 'quan-the-thao-nam',    children: [] },
            { id: 113, name: 'Giày chạy bộ nam',      slug: 'giay-chay-bo-nam',     children: [] },
            { id: 114, name: 'Giày bóng đá nam',      slug: 'giay-bong-da-nam',     children: [] },
          ]
        },
        {
          id: 12, name: 'Nữ', slug: 'nu',
          children: [
            { id: 121, name: 'Áo yoga nữ',            slug: 'ao-yoga-nu',           children: [] },
            { id: 122, name: 'Quần legging nữ',       slug: 'quan-legging-nu',      children: [] },
            { id: 123, name: 'Giày gym nữ',           slug: 'giay-gym-nu',          children: [] },
          ]
        },
        {
          id: 13, name: 'Trẻ em', slug: 'tre-em',
          children: [
            { id: 131, name: 'Đồ thể thao trẻ em',   slug: 'do-the-thao-tre-em',   children: [] },
            { id: 132, name: 'Giày thể thao trẻ em', slug: 'giay-the-thao-tre-em', children: [] },
          ]
        },
        {
          id: 3, name: 'Phụ kiện', slug: 'phu-kien',
          children: [
            { id: 31, name: 'Túi thể thao',           slug: 'tui-the-thao',         children: [] },
            { id: 32, name: 'Găng tay',               slug: 'gang-tay',             children: [] },
            { id: 33, name: 'Băng đầu gối',           slug: 'bang-dau-goi',         children: [] },
            { id: 34, name: 'Bình nước thể thao',     slug: 'binh-nuoc-the-thao',   children: [] },
          ]
        },
        {
          id: 4, name: 'Du lịch & Dã ngoại', slug: 'du-lich',
          children: [
            { id: 41, name: 'Ba lô du lịch',          slug: 'ba-lo-du-lich',        children: [] },
            { id: 42, name: 'Lều trại',               slug: 'leu-trai',             children: [] },
            { id: 43, name: 'Áo khoác gió',           slug: 'ao-khoac-gio',         children: [] },
          ]
        },
        {
          id: 5, name: 'Bơi lội', slug: 'boi-loi',
          children: [
            { id: 51, name: 'Đồ bơi nam',             slug: 'do-boi-nam',           children: [] },
            { id: 52, name: 'Đồ bơi nữ',              slug: 'do-boi-nu',            children: [] },
            { id: 53, name: 'Kính bơi',               slug: 'kinh-boi',             children: [] },
            { id: 54, name: 'Mũ bơi',                 slug: 'mu-boi',               children: [] },
          ]
        },
        { id: 6, name: 'Sản phẩm mới', slug: 'san-pham-moi', children: [] },
        { id: 7, name: 'Giá rẻ hơn',   slug: 'gia-re-hon',   children: [] },
      ]
    }
  ];

  @Input() selectedCategoryId: string | null = null;
  @Output() close = new EventEmitter<void>();

  breadcrumbs: Category[] = [];
  currentLevel: Category | null = null;
  hoveredId: number | null = null;
  hoveredCategory: Category | null = null;

  ngOnInit(): void { this.initializeBreadcrumbs(); }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCategoryId']) this.initializeBreadcrumbs();
  }

  initializeBreadcrumbs(): void {
    if (!this.selectedCategoryId) {
      this.breadcrumbs  = [];
      this.currentLevel = this.categories[0] ?? null;
      return;
    }
    const id   = parseInt(this.selectedCategoryId, 10);
    const path = this.findPath(id);
    if (path.length > 0) {
      this.breadcrumbs  = path.slice(0, -1);
      this.currentLevel = path[path.length - 1];
    } else {
      this.breadcrumbs  = [];
      this.currentLevel = this.categories[0] ?? null;
    }
    this.hoveredId       = null;
    this.hoveredCategory = null;
  }

  private findPath(id: number, list = this.categories, trail: Category[] = []): Category[] {
    for (const cat of list) {
      if (cat.id === id) return [...trail, cat];
      if (cat.children?.length) {
        const found = this.findPath(id, cat.children, [...trail, cat]);
        if (found.length) return found;
      }
    }
    return [];
  }

  get currentItems(): Category[] {
    return this.currentLevel?.children ?? [];
  }

  get currentItemsWithChildren(): Category[] {
    return this.currentItems.filter(c => c.children?.length);
  }

  onHover(item: Category): void {
    this.hoveredId       = item.id;
    this.hoveredCategory = item.children?.length ? item : null;
  }

  onSelectItem(item: Category): void {
    if (item.children?.length) {
      this.breadcrumbs  = this.currentLevel
        ? [...this.breadcrumbs, this.currentLevel]
        : this.breadcrumbs;
      this.currentLevel    = item;
      this.hoveredId       = null;
      this.hoveredCategory = null;
    } else {
      // Leaf — navigate then close
      console.log('Navigate to:', item.slug);
      this.closeBanner();
    }
  }

  goBack(): void {
    if (!this.breadcrumbs.length) return;
    this.currentLevel    = this.breadcrumbs[this.breadcrumbs.length - 1];
    this.breadcrumbs     = this.breadcrumbs.slice(0, -1);
    this.hoveredId       = null;
    this.hoveredCategory = null;
  }

  onBreadcrumbClick(index: number): void {
    this.currentLevel    = this.breadcrumbs[index];
    this.breadcrumbs     = this.breadcrumbs.slice(0, index);
    this.hoveredId       = null;
    this.hoveredCategory = null;
  }

  closeBanner(): void { this.close.emit(); }
}
