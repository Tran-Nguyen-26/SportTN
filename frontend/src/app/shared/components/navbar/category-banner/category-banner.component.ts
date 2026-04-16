import { Component } from '@angular/core';
import { Category } from 'src/app/core/models/category/category.model';

@Component({
  selector: 'app-category-banner',
  templateUrl: './category-banner.component.html',
  styleUrls: ['./category-banner.component.css']
})
export class CategoryBannerComponent {
  categories: Category[] = [
    {
      id: 1,
      name: 'Đồ bơi',
      slug: 'do-boi',
      children: [
        {
          id: 11,
          name: 'Nam',
          slug: 'do-boi-nam',
          children: [
            { id: 111, name: 'Quần bơi nam', slug: 'quan-boi-nam', children: [] },
            { id: 112, name: 'Áo bơi nam', slug: 'ao-boi-nam', children: [] }
          ]
        },
        {
          id: 12,
          name: 'Nữ',
          slug: 'do-boi-nu',
          children: [
            { id: 121, name: 'Đồ bơi 1 mảnh', slug: 'do-boi-1-manh', children: [] },
            { id: 122, name: 'Đồ bơi bikini', slug: 'do-boi-bikini', children: [] }
          ]
        },
        {
          id: 13,
          name: 'Trẻ em',
          slug: 'do-boi-tre-em',
          children: []
        }
      ]
    },
    {
      id: 2,
      name: 'Giày thể thao',
      slug: 'giay-the-thao',
      children: [
        { id: 21, name: 'Nam', slug: 'giay-nam', children: [] },
        { id: 22, name: 'Nữ', slug: 'giay-nu', children: [] }
      ]
    }
  ];

  selectedCategory: Category | null = null;

  onSelectCategory(cat: Category) {
    if (this.selectedCategory && this.selectedCategory.id === cat.id) {
      this.selectedCategory = null
    } else {
      this.selectedCategory = cat
    }
  }
}
