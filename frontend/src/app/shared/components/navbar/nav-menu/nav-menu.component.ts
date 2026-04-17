import { Component, Output, EventEmitter } from '@angular/core';

interface MenuItem {
  label: string;
  highlight: 'new' | 'sale' | null;
  hasChildren: boolean;
  categoryId: string | null;
}

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  menuItems: MenuItem[] = [
    { label: 'Môn Thể Thao', highlight: null, hasChildren: true, categoryId: '1' },
    { label: 'Nam', highlight: null, hasChildren: true, categoryId: '11' },
    { label: 'Nữ', highlight: null, hasChildren: true, categoryId: '12' },
    { label: 'Trẻ Em', highlight: null, hasChildren: true, categoryId: '13' },
    { label: 'Phụ Kiện Thể Thao', highlight: null, hasChildren: true, categoryId: '3' },
    { label: 'Du Lịch', highlight: null, hasChildren: true, categoryId: '4' },
    { label: 'Bơi Lội', highlight: null, hasChildren: false, categoryId: null },
    { label: 'Sản Phẩm Mới', highlight: 'new', hasChildren: false, categoryId: null },
    { label: 'Giá Rẻ Hơn', highlight: 'sale', hasChildren: false, categoryId: null },
  ];

  @Output() selectCategory = new EventEmitter<string | null>();

  onClickMenuItem(categoryId: string | null) {
    this.selectCategory.emit(categoryId);
  }
}

