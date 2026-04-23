import {Component, computed, OnInit, signal} from '@angular/core';
import {CategoryForm} from "../../components/add-category-drawer/add-category-drawer.component";
import {CategoryAdminResponse, CategoryService} from "../../../core/services/category/category.service";

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
export class CategoriesComponent implements OnInit {

  constructor(private categoryService: CategoryService) {
  }

  searchQuery = signal('');
  selectedType = signal('');

  showDrawer = false;

  typeOptions = [
    { value: '',       label: 'Tất cả' },
    { value: 'parent', label: 'Danh mục cha' },
    { value: 'child',  label: 'Danh mục con' },
  ];

  categories = signal<CategoryAdminResponse[]>([]);

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategoryAdminResponse().subscribe({
      next: (response: any) => {
        this.categories.set(response.data);
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh mục:', err);
      }
    })
  }

  categoryLength = computed(() =>
    this.categories().length
  );

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

  parentList = computed(() => this.categories().filter(c => !c.parent));

  toggleShowOnHomeStatus(cat: AdminCategory) {
    cat.showOnHome = !cat.showOnHome;
  }

  onCategorySaved(form: CategoryForm) {}
}
