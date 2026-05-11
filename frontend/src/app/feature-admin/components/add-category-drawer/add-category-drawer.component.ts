import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

export interface CategoryForm {
  categoryId:   number | null;
  name:         string;
  slug:         string;
  parentId:     number | null;
  parentName:   string | null;
  description:  string;
  sectionTitle: string;
  linkUrl:      string;
  imageUrl:     string;
  displayOrder: number;
  showOnHome:   boolean;
  active:       boolean;
}

@Component({
  selector: 'app-add-category-drawer',
  templateUrl: './add-category-drawer.component.html',
  styleUrls: ['./add-category-drawer.component.css']
})
export class AddCategoryDrawerComponent implements OnChanges {
  @Input() visible = false;
  @Input() parentCategories: { categoryId: number; name: string }[] = [];
  @Input() editMode = false;
  @Input() initialData: CategoryForm | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<CategoryForm>();

  previewUrl:  string | null = null;
  imageSource: 'upload' | 'url' = 'url';
  urlPreview:  string = '';
  urlValid:    boolean | null = null;
  form:        CategoryForm = this.emptyForm();

  errors = {
    name: '',
    slug: ''
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.visible) return;

    const hasRelevantChange = changes['visible']
      || changes['editMode']
      || changes['initialData']
      || changes['parentCategories'];

    if (!hasRelevantChange) return;

    if (this.editMode && this.initialData) {
      this.loadInitialData(this.initialData);
    } else {
      this.resetForm();
    }
  }

  private loadInitialData(data: CategoryForm): void {
    this.form = {
      ...data,
      categoryId: data.categoryId ? Number(data.categoryId) : null,
      parentId: data.parentId != null ? Number(data.parentId) : null,
    };

    if (data.imageUrl) {
      this.imageSource = 'url';
      this.urlPreview  = data.imageUrl;
      this.urlValid    = true;
      this.previewUrl  = null;
    } else {
      this.imageSource = 'upload';
      this.urlPreview  = '';
      this.urlValid    = null;
      this.previewUrl  = null;
    }
  }

  private resetForm(): void {
    this.form        = this.emptyForm();
    this.previewUrl  = null;
    this.imageSource = 'url';
    this.urlPreview  = '';
    this.urlValid    = null;
    this.errors = { name: '', slug: '' };
  }

  emptyForm(): CategoryForm {
    return {
      categoryId: null, name: '', slug: '',
      parentId: null, parentName: null, description: '',
      sectionTitle: '', linkUrl: '', imageUrl: '',
      displayOrder: 1, showOnHome: false, active: true,
    };
  }

  onNameChange(val: string): void {
    this.errors.name = '';
    this.form.name = val;
    this.form.slug = val.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '')
      .trim().replace(/\s+/g, '-');
  }

  changeOrder(delta: number): void {
    this.form.displayOrder = Math.max(1, Math.min(99, this.form.displayOrder + delta));
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl    = reader.result as string;
      this.form.imageUrl = '';
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.previewUrl    = null;
    this.form.imageUrl = '';
  }

  onImageUrlChange(event: Event): void {
    const url          = (event.target as HTMLInputElement).value.trim();
    this.form.imageUrl = url;
    this.urlPreview    = url;
    this.urlValid      = null;
  }

  clearImageUrl(): void {
    this.form.imageUrl = '';
    this.urlPreview    = '';
    this.urlValid      = null;
  }

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('overlay')) this.close();
  }

  save(): void {
    if (!this.form.name || !this.form.slug) {
      if(!this.form.name) this.errors.name = 'Tên danh mục không được để trống';
      if(!this.form.slug) this.errors.slug = 'Slug không được để trống';
      return;
    }
    this.saved.emit({ ...this.form });
  }

  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  setErrors(backendErrors: {name?: string, slug?: string}) {
    this.errors.name = backendErrors.name || '';
    this.errors.slug = backendErrors.slug || '';
  }
}
