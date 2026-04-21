import { Component, EventEmitter, Input, Output } from '@angular/core';

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

@Component({
  selector: 'app-add-category-drawer',
  templateUrl: './add-category-drawer.component.html',
  styleUrls: ['./add-category-drawer.component.css']
})
export class AddCategoryDrawerComponent {
  @Input() visible = false;
  @Input() parentCategories: { id: number; name: string }[] = [];
  @Input() editMode = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<CategoryForm>();

  previewUrl: string | null = null;

  form: CategoryForm = this.emptyForm();

  emptyForm(): CategoryForm {
    return {
      name: '', slug: '', parentId: null, description: '',
      sectionTitle: '', linkUrl: '', imageUrl: '',
      displayOrder: 1, showOnHome: false, active: true
    };
  }

  onNameChange(val: string) {
    this.form.slug = val.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '')
      .trim().replace(/\s+/g, '-');
  }

  changeOrder(delta: number) {
    this.form.displayOrder = Math.max(1, Math.min(99, this.form.displayOrder + delta));
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { this.previewUrl = reader.result as string; };
    reader.readAsDataURL(file);
  }

  removeImage() { this.previewUrl = null; }

  onOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('overlay')) this.close();
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.form = this.emptyForm();
    this.previewUrl = null;
  }

  save() {
    if (!this.form.name || !this.form.slug) return;
    this.saved.emit({ ...this.form });
    this.close();
  }
}
