import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

export interface CategoryForm {
  name: string;
  slug: string;
  parentId: number | null;
  description: string;
  sectionTitle: string;
  linkUrl: string;
  imageUrl: string;
  displayOrder: number;
  showOnHome: boolean;
  active: boolean;
}

export interface ParentCategory {
  id: number;
  name: string;
}

@Component({
  selector: 'app-add-category-drawer',
  templateUrl: './add-category-drawer.component.html',
  styleUrls: ['./add-category-drawer.component.css']
})
export class AddCategoryDrawerComponent implements OnChanges {
  @Input() visible = false;
  @Input() parentCategories: { id: number; name: string }[] = [];
  @Input() editMode = false;

  // Truyền data vào để edit — null nghĩa là tạo mới
  @Input() initialData: CategoryForm | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<CategoryForm>();

  previewUrl: string | null = null;
  imageSource: 'upload' | 'url' = 'upload';
  urlPreview: string = '';
  urlValid: boolean | null = null;
  form: CategoryForm = this.emptyForm();

  ngOnChanges(changes: SimpleChanges): void {
    // Khi drawer được mở (visible chuyển thành true), load data nếu có
    const visibleChanged = changes['visible'];
    const dataChanged = changes['initialData'];

    if (visibleChanged?.currentValue === true || dataChanged) {
      if (this.initialData) {
        this.loadInitialData(this.initialData);
      } else {
        // Tạo mới — reset form sạch
        this.form = this.emptyForm();
        this.previewUrl = null;
        this.imageSource = 'upload';
        this.urlPreview = '';
        this.urlValid = null;
      }
    }
  }

  private loadInitialData(data: CategoryForm): void {
    this.form = { ...data };

    // Khôi phục trạng thái ảnh
    if (data.imageUrl) {
      this.imageSource = 'url';
      this.urlPreview = data.imageUrl;
      this.urlValid = true;
      this.previewUrl = null;
    } else {
      this.imageSource = 'upload';
      this.urlPreview = '';
      this.urlValid = null;
      this.previewUrl = null;
    }
  }

  emptyForm(): CategoryForm {
    return {
      name: '', slug: '', parentId: null, description: '',
      sectionTitle: '', linkUrl: '', imageUrl: '',
      displayOrder: 1, showOnHome: false, active: true
    };
  }

  onNameChange(val: string): void {
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
      this.previewUrl = reader.result as string;
      this.form.imageUrl = '';
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.previewUrl = null;
    this.form.imageUrl = '';
  }

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('overlay')) this.close();
  }

  save(): void {
    if (!this.form.name || !this.form.slug) return;
    this.saved.emit({ ...this.form });
    this.close();
  }

  onImageUrlChange(event: Event): void {
    const url = (event.target as HTMLInputElement).value.trim();
    this.form.imageUrl = url;
    this.urlPreview    = url;
    this.urlValid      = null;
  }

  clearImageUrl(): void {
    this.form.imageUrl = '';
    this.urlPreview    = '';
    this.urlValid      = null;
  }

  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.form        = this.emptyForm();
    this.previewUrl  = null;
    this.imageSource = 'upload';
    this.urlPreview  = '';
    this.urlValid    = null;
  }
}
