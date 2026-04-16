import { Component, Output, EventEmitter } from '@angular/core';

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

  @Output() toggleCategory = new EventEmitter<void>();

  onClickCategoryMenu() {
    this.toggleCategory.emit();
  }
}

