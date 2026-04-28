import { Component } from '@angular/core';

@Component({
  selector: 'app-filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.css']
})
export class FilterSidebarComponent {
  selectedCategoryLabel = '';

  categories = [
    { label: 'Dưới 199K', count: 26755, image: 'assets/duoi199k.jpg' },
    { label: 'Đồ mặc hàng ngày', count: 1752, image: 'assets/duoi199k.jpg' },
    { label: 'Sản phẩm mới', count: 887, image: 'assets/duoi199k.jpg' },
    { label: 'Đồ bơi nam', count: 592, image: 'assets/duoi199k.jpg' },
    { label: 'Giày dép nam', count: 4620, image: 'assets/duoi199k.jpg' },
    { label: 'Áo thể thao nam', count: 4152, image: 'assets/duoi199k.jpg' },
    { label: 'Quần thể thao nam', count: 2749, image: 'assets/duoi199k.jpg' },
    { label: 'Phụ kiện thể thao nam', count: 3383, image: 'assets/duoi199k.jpg' },
    { label: 'Đồ lót thể thao', count: 141, image: 'assets/duoi199k.jpg' }
  ];

  onSelectCategory(label: string): void {
    this.selectedCategoryLabel = this.selectedCategoryLabel === label ? '' : label;
  }

  clearQuickCategory(): void {
    this.selectedCategoryLabel = '';
  }
}
