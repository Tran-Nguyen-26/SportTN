import {Component, computed, signal} from '@angular/core';

export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  parent: string | null;
  productCount: number;
  displayOrder: number;
  showOnHome: boolean;
  active: boolean;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {

  searchQuery = signal('');
  selectedType = signal('');

  typeOptions = [
    { value: '',       label: 'Tất cả' },
    { value: 'parent', label: 'Danh mục cha' },
    { value: 'child',  label: 'Danh mục con' },
  ];

  categories = signal<AdminCategory[]>([
    { id: 1,  name: 'Thể Thao',          slug: 'sport',                parent: null,       productCount: 0,    displayOrder: 1,  showOnHome: false, active: true },
    { id: 2,  name: 'Bơi lội',           slug: 'swimming',             parent: 'Thể Thao', productCount: 120,  displayOrder: 1,  showOnHome: true,  active: true },
    { id: 3,  name: 'Chạy bộ',           slug: 'running',              parent: 'Thể Thao', productCount: 98,   displayOrder: 2,  showOnHome: true,  active: true },
    { id: 4,  name: 'Chống nắng',        slug: 'sun-protection',       parent: 'Thể Thao', productCount: 64,   displayOrder: 3,  showOnHome: true,  active: true },
    { id: 5,  name: 'Bóng đá',           slug: 'football',             parent: 'Thể Thao', productCount: 87,   displayOrder: 4,  showOnHome: false, active: true },
    { id: 6,  name: 'Tennis',            slug: 'tennis',               parent: 'Thể Thao', productCount: 45,   displayOrder: 5,  showOnHome: false, active: true },
    { id: 7,  name: 'Mũ Bơi',           slug: 'swimming-cap',         parent: 'Bơi lội',  productCount: 18,   displayOrder: 1,  showOnHome: false, active: true },
    { id: 8,  name: 'Kính Bơi',         slug: 'swimming-goggle',      parent: 'Bơi lội',  productCount: 24,   displayOrder: 2,  showOnHome: false, active: true },
    { id: 9,  name: 'Đồ Bơi',           slug: 'swimwear',             parent: 'Bơi lội',  productCount: 32,   displayOrder: 3,  showOnHome: false, active: true },
    { id: 10, name: 'Giày Chạy Bộ',     slug: 'running-shoe',         parent: 'Chạy bộ',  productCount: 28,   displayOrder: 1,  showOnHome: false, active: true },
    { id: 11, name: 'Áo Chạy Bộ',       slug: 'running-shirt',        parent: 'Chạy bộ',  productCount: 35,   displayOrder: 2,  showOnHome: false, active: true },
    { id: 12, name: 'Áo Chống Nắng',    slug: 'sun-shirt',            parent: 'Chống nắng', productCount: 22, displayOrder: 1,  showOnHome: false, active: false },
  ]);

  parentCount = computed(() =>
    this.categories().filter(c => !c.parent).length
  );

  childCount = computed(() =>
    this.categories().filter(c => c.parent).length
  );

  homeCount = computed(() =>
    this.categories().filter(c => c.showOnHome).length
  );

  get filteredCategories(): AdminCategory[] {
    const data = this.categories();
    const type = this.selectedType();
    const query = this.searchQuery().toLowerCase();

    return data.filter(c => {
      const matchType = !type
        || (type === 'parent' && c.parent === null)
        || (type === 'child' && c.parent !== null);

      const matchSearch = !query
        || c.name.toLowerCase().includes(query)
        || c.slug.toLowerCase().includes(query);

      return matchType && matchSearch;
    });
  }
}
