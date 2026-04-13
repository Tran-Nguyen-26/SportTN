import { Component } from '@angular/core';
import { ProductCategory } from '../../product-card/product-card.component';

interface MenuItem {
  label: string;
  highlight: 'new' | 'sale' | null;
  hasChildren: boolean;
}

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  menuItems: MenuItem[] = [
    { label: 'Môn Thể Thao', highlight: null, hasChildren: true },
    { label: 'Nam', highlight: null, hasChildren: true },
    { label: 'Nữ', highlight: null, hasChildren: true },
    { label: 'Trẻ Em', highlight: null, hasChildren: true },
    { label: 'Phụ Kiện Thể Thao', highlight: null, hasChildren: true },
    { label: 'Du Lịch', highlight: null, hasChildren: true },
    { label: 'Bơi Lội', highlight: null, hasChildren: false },
    { label: 'Sản Phẩm Mới', highlight: 'new', hasChildren: false },
    { label: 'Giá Rẻ Hơn', highlight: 'sale', hasChildren: false },
  ];

  selectedCategory: ProductCategory | null = null;

  selectItem(item: MenuItem) {
    switch (item.label) {
      case 'Bơi Lội':
        this.selectedCategory = { title: 'Bơi Lội', items: ['Đồ bơi','Kính bơi','Mũ bơi'] };
        break;
      case 'Nam':
        this.selectedCategory = { title: 'Nam', items: ['Áo nam','Quần nam','Giày nam'] };
        break;
      case 'Nữ':
        this.selectedCategory = { title: 'Nữ', items: ['Áo nữ','Quần nữ','Giày nữ'] };
        break;
      default:
        this.selectedCategory = { title: item.label, items: ['Sản phẩm mẫu 1','Sản phẩm mẫu 2'] };
    }
  }
}

