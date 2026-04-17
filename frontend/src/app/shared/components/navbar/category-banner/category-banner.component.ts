import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Category } from 'src/app/core/models/category/category.model';

@Component({
  selector: 'app-category-banner',
  templateUrl: './category-banner.component.html',
  styleUrls: ['./category-banner.component.css']
})
export class CategoryBannerComponent implements OnInit, OnChanges {
  categories: Category[] = [
    {
      id: 1,
      name: 'Môn thể thao',
      slug: 'mon-the-thao',
      children: [
        {
          id: 11,
          name: 'Nam',
          slug: 'nam',
          children: [
            { id: 111, name: 'Quần áo nam', slug: 'quan-ao-nam', children: [] },
            { id: 112, name: 'Giày nam', slug: 'giay-nam', children: [] }
          ]
        },
        {
          id: 12,
          name: 'Nữ',
          slug: 'nu',
          children: [
            { id: 121, name: 'Quần áo nữ', slug: 'quan-ao-nu', children: [] },
            { id: 122, name: 'Giày nữ', slug: 'giay-nu', children: [] }
          ]
        },
        {
          id: 13,
          name: 'Trẻ em',
          slug: 'tre-em',
          children: [
            { id: 131, name: 'Đồ thể thao trẻ em', slug: 'do-the-thao-tre-em', children: [] }
          ]
        },
        {
          id: 3,
          name: 'Phụ kiện thể thao',
          slug: 'phu-kien-the-thao',
          children: [
            { id: 31, name: 'Túi thể thao', slug: 'tui-the-thao', children: [] },
            { id: 32, name: 'Găng tay', slug: 'gang-tay', children: [] }
          ]
        },
        {
          id: 4,
          name: 'Du lịch',
          slug: 'du-lich',
          children: [
            { id: 41, name: 'Ba lô du lịch', slug: 'ba-lo-du-lich', children: [] },
            { id: 42, name: 'Lều trại', slug: 'leu-trai', children: [] }
          ]
        },
        {
          id: 5,
          name: 'Bơi lội',
          slug: 'boi-loi',
          children: [
            { id: 51, name: 'Đồ bơi nam', slug: 'do-boi-nam', children: [] },
            { id: 52, name: 'Đồ bơi nữ', slug: 'do-boi-nu', children: [] },
            { id: 53, name: 'Kính bơi', slug: 'kinh-boi', children: [] },
            { id: 54, name: 'Mũ bơi', slug: 'mu-boi', children: [] }
          ]
        },
        {
          id: 6,
          name: 'Sản phẩm mới',
          slug: 'san-pham-moi',
          children: []
        },
        {
          id: 7,
          name: 'Giá rẻ hơn',
          slug: 'gia-re-hon',
          children: []
        }
      ]
    }
  ];

  @Input() selectedCategoryId: string | null = null;
  @Output() close = new EventEmitter<void>();

  // Breadcrumb trail tracked as array of categories
  breadcrumbs: Category[] = [];
  currentLevel: Category | null = null;

  ngOnInit() {
    this.initializeBreadcrumbs();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedCategoryId']) {
      this.initializeBreadcrumbs();
    }
  }

  initializeBreadcrumbs() {
    if (!this.selectedCategoryId) {
      this.breadcrumbs = [];
      this.currentLevel = null;
      return;
    }

    const id = parseInt(this.selectedCategoryId, 10);
    const path = this.findCategoryPath(id);
    
    if (path.length > 0) {
      this.breadcrumbs = path.slice(0, -1);
      this.currentLevel = path[path.length - 1];
    } else {
      this.breadcrumbs = [];
      this.currentLevel = null;
    }
  }

  findCategoryPath(id: number, currentPath: Category[] = []): Category[] {
    for (const cat of this.categories) {
      if (cat.id === id) {
        return [...currentPath, cat];
      }

      if (cat.children) {
        const found = this.findInChildren(cat, id, [...currentPath, cat]);
        if (found.length > 0) return found;
      }
    }
    return [];
  }

  findInChildren(parent: Category, id: number, path: Category[]): Category[] {
    if (!parent.children) return [];

    for (const child of parent.children) {
      if (child.id === id) {
        return [...path, child];
      }
      if (child.children) {
        const found = this.findInChildren(child, id, [...path, child]);
        if (found.length > 0) return found;
      }
    }
    return [];
  }

  get currentItems(): Category[] {
    return this.currentLevel?.children || [];
  }

  onSelectItem(item: Category) {
    if (item.children && item.children.length > 0) {
      // Drill down to next level
      const newBreadcrumbs = [...this.breadcrumbs];
      if (this.currentLevel) {
        newBreadcrumbs.push(this.currentLevel);
      }
      this.breadcrumbs = newBreadcrumbs;
      this.currentLevel = item;
    } else {
      // Leaf node - navigate and close
      console.log('Selected category:', item);
      this.closeBanner();
    }
  }

  onBreadcrumbClick(index: number) {
    if (index === -1) {
      // Go back to root
      this.breadcrumbs = [];
      this.currentLevel = this.categories[0] || null;
    } else {
      // Go to breadcrumb level
      this.currentLevel = this.breadcrumbs[index];
      this.breadcrumbs = this.breadcrumbs.slice(0, index);
    }
  }

  canGoBack(): boolean {
    return this.breadcrumbs.length > 0 || this.currentLevel?.id !== this.categories[0]?.id;
  }

  closeBanner() {
    this.close.emit();
  }
}
