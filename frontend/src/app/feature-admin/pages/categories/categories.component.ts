import { Component, computed, OnInit, signal } from '@angular/core';
import { CategoryForm } from '../../components/add-category-drawer/add-category-drawer.component';
import { CategoryAdminResponse, CategoryService } from '../../../core/services/category/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  constructor(private categoryService: CategoryService) {}

  // ── State ──────────────────────────────────────────────────────
  searchQuery  = signal('');
  selectedType = '';
  categories   = signal<CategoryAdminResponse[]>([]);

  showDrawer       = false;
  editMode         = false;
  editingCategory: CategoryForm | null = null;   // đổi sang CategoryForm

  typeOptions = [
    { value: '',       label: 'Tất cả' },
    { value: 'parent', label: 'Danh mục cha' },
    { value: 'child',  label: 'Danh mục con' },
  ];

  // ── Lifecycle ──────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategoryAdminResponse().subscribe({
      next: (response: any) => this.categories.set(response.data),
      error: (err) => console.error('Lỗi khi lấy danh mục:', err),
    });
  }

  // ── Computed stats ─────────────────────────────────────────────
  categoryLength = computed(() => this.categories().length);
  parentCount    = computed(() => this.categories().filter(c => !c.parent).length);
  childCount     = computed(() => this.categories().filter(c =>  c.parent).length);
  homeCount      = computed(() => this.categories().filter(c =>  c.showOnHome).length);
  parentList     = computed(() => this.categories().filter(c => !c.parent));

  // ── Filter ─────────────────────────────────────────────────────
  get filteredCategories(): CategoryAdminResponse[] {
    const data  = this.categories();
    const type  = this.selectedType;
    const query = this.searchQuery().toLowerCase();

    return data.filter(c => {
      const matchType = !type
        || (type === 'parent' && !c.parent)
        || (type === 'child'  &&  c.parent);
      const matchSearch = !query
        || c.name.toLowerCase().includes(query)
        || c.slug.toLowerCase().includes(query);
      return matchType && matchSearch;
    });
  }

  // ── Drawer: thêm mới ───────────────────────────────────────────
  openAddDrawer(): void {
    this.editMode       = false;
    this.editingCategory = null;
    this.showDrawer     = true;
  }

  // ── Drawer: chỉnh sửa ──────────────────────────────────────────
  openEditDrawer(cat: CategoryAdminResponse): void {
    this.editMode = true;
    this.editingCategory = {
      name:         cat.name,
      slug:         cat.slug,
      parentId:     cat.parentId     ?? null,
      description:  cat.description  ?? '',
      sectionTitle: cat.sectionTitle ?? '',
      linkUrl:      cat.linkUrl      ?? '',
      imageUrl:     cat.imageUrl     ?? '',
      displayOrder: cat.displayOrder ?? 1,
      showOnHome:   cat.showOnHome   ?? false,
      active:       cat.active       ?? true,
    };
    this.showDrawer = true;
  }

  // ── Lưu (tạo mới hoặc cập nhật) ───────────────────────────────
  onCategorySaved(form: CategoryForm): void {
    if (this.editMode) {
      // TODO: this.categoryService.update(id, form).subscribe(...)
      console.log('Cập nhật danh mục:', form);
    } else {
      // TODO: this.categoryService.create(form).subscribe(...)
      console.log('Tạo danh mục mới:', form);
    }
    this.loadCategories();
  }

  // ── Toggle hiện home ───────────────────────────────────────────
  toggleShowOnHomeStatus(cat: CategoryAdminResponse): void {
    cat.showOnHome = !cat.showOnHome;
    // TODO: this.categoryService.updateShowOnHome(cat.id, cat.showOnHome).subscribe(...)
  }

  // ── Xóa ────────────────────────────────────────────────────────
  onDelete(cat: CategoryAdminResponse): void {
    if (!confirm(`Xóa danh mục "${cat.name}"?`)) return;
    // TODO: this.categoryService.delete(cat.id).subscribe(() => this.loadCategories())
    console.log('Xóa danh mục:', cat.id);
  }
}
