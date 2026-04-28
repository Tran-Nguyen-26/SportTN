import { Component } from '@angular/core';

@Component({
  selector: 'app-color-filter',
  templateUrl: './color-filter.component.html',
  styleUrls: ['./color-filter.component.css']
})
export class ColorFilterComponent {
  showAll = false;
  selectedColorName = '';

  colors = [
    { name: 'Đen', count: 1367, code: '#000000' },
    { name: 'Xanh dương', count: 616, code: '#0000ff' },
    { name: 'Xanh lá', count: 336, code: '#008000' },
    { name: 'Xám', count: 258, code: '#808080' },
    { name: 'Trắng', count: 125, code: '#ffffff' },
    { name: 'Be', count: 120, code: '#f5f5dc' },
    { name: 'Nâu', count: 82, code: '#8b4513' },
    { name: 'Hồng', count: 69, code: '#ff69b4' },
    { name: 'Tím', count: 65, code: '#800080' },
    { name: 'Xám nhạt', count: 60, code: '#d3d3d3' },
    { name: 'Cam', count: 46, code: '#ffa500' },
    { name: 'Vàng', count: 40, code: '#ffff00' },
    { name: 'Đỏ', count: 37, code: '#ff0000' },
    { name: 'Xám rất nhạt', count: 6, code: '#f0f0f0' }
  ];

  get visibleColors() {
    return this.showAll ? this.colors : this.colors.slice(0, 8);
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }

  onSelectColor(name: string): void {
    this.selectedColorName = this.selectedColorName === name ? '' : name;
  }

  clearSelectedColor(): void {
    this.selectedColorName = '';
  }
}
