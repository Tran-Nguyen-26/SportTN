import { Component } from '@angular/core';

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  website: string;
  logoUrl: string;
  color: string;
  initials: string;
  productCount: number;
  active: boolean;
}

export interface BrandForm {
  name: string;
  slug: string;
  description: string;
  website: string;
  logoUrl: string;
  color: string;
  active: boolean;
}

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent {

  searchQuery = '';
  drawerVisible = false;
  editingBrand: Brand | null = null;

  // ── Logo state ───────────────────────────────
  logoSource: 'upload' | 'url' = 'upload';
  logoPreview: string | null = null;       // base64 khi upload file
  logoUrlPreview: string = '';             // khi nhập URL
  logoUrlValid: boolean | null = null;

  // ── Preset colors ────────────────────────────
  presetColors = [
    '#2563eb', '#16a34a', '#dc2626', '#d97706',
    '#7c3aed', '#db2777', '#0891b2', '#0f172a',
    '#64748b', '#ea580c',
  ];

  form: BrandForm = this.emptyForm();

  brands: Brand[] = [
    { id: 1,  name: 'DECATHLON', slug: 'decathlon', description: 'Thương hiệu thể thao Pháp', website: 'www.decathlon.com', logoUrl: '', color: '#2563eb', initials: 'DE', productCount: 142, active: true },
    { id: 2,  name: 'NABAIJI',   slug: 'nabaiji',   description: 'Thương hiệu đồ bơi',       website: 'www.decathlon.com', logoUrl: '', color: '#0891b2', initials: 'NA', productCount: 68,  active: true },
    { id: 3,  name: 'KIPRUN',    slug: 'kiprun',    description: 'Thương hiệu chạy bộ',      website: 'www.decathlon.com', logoUrl: '', color: '#16a34a', initials: 'KI', productCount: 54,  active: true },
    { id: 4,  name: 'DOMYOS',    slug: 'domyos',    description: 'Thương hiệu gym & fitness', website: 'www.decathlon.com', logoUrl: '', color: '#7c3aed', initials: 'DO', productCount: 38,  active: true },
    { id: 5,  name: 'NIKE',      slug: 'nike',      description: 'Just Do It',                website: 'www.nike.com',      logoUrl: '', color: '#0f172a', initials: 'NK', productCount: 96,  active: true },
    { id: 6,  name: 'ADIDAS',    slug: 'adidas',    description: 'Impossible is Nothing',    website: 'www.adidas.com',    logoUrl: '', color: '#dc2626', initials: 'AD', productCount: 87,  active: true },
    { id: 7,  name: 'SPEEDO',    slug: 'speedo',    description: 'Thương hiệu bơi lội',      website: 'www.speedo.com',    logoUrl: '', color: '#d97706', initials: 'SP', productCount: 45,  active: false },
  ];

  // ── Filter ───────────────────────────────────
  get filteredBrands(): Brand[] {
    const q = this.searchQuery.toLowerCase();
    if (!q) return this.brands;
    return this.brands.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.slug.toLowerCase().includes(q)
    );
  }

  // ── Drawer ───────────────────────────────────
  openDrawer(brand?: Brand): void {
    if (brand) {
      this.editingBrand = brand;
      this.form = {
        name:        brand.name,
        slug:        brand.slug,
        description: brand.description,
        website:     brand.website,
        logoUrl:     brand.logoUrl,
        color:       brand.color,
        active:      brand.active,
      };
      if (brand.logoUrl) {
        this.logoSource     = 'url';
        this.logoUrlPreview = brand.logoUrl;
        this.logoUrlValid   = true;
      }
    } else {
      this.editingBrand = null;
      this.form         = this.emptyForm();
    }
    this.drawerVisible = true;
  }

  closeDrawer(): void {
    this.drawerVisible  = false;
    this.editingBrand   = null;
    this.form           = this.emptyForm();
    this.logoPreview    = null;
    this.logoSource     = 'upload';
    this.logoUrlPreview = '';
    this.logoUrlValid   = null;
  }

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('overlay')) this.closeDrawer();
  }

  isFormValid(): boolean {
    return !!(this.form.name && this.form.slug);
  }

  save(): void {
    if (!this.isFormValid()) return;
    const logoUrl = this.effectiveLogo || '';
    if (this.editingBrand) {
      // TODO: gọi update API
      Object.assign(this.editingBrand, {
        ...this.form,
        logoUrl,
        initials: this.getInitials(this.form.name),
      });
    } else {
      // TODO: gọi create API
      this.brands.push({
        id:           Date.now(),
        ...this.form,
        logoUrl,
        initials:     this.getInitials(this.form.name),
        productCount: 0,
      });
    }
    this.closeDrawer();
  }

  deleteBrand(id: number): void {
    // TODO: confirm + API
    this.brands = this.brands.filter(b => b.id !== id);
  }

  // ── Name / Slug ──────────────────────────────
  onNameChange(val: string): void {
    this.form.slug = val.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }

  // ── Logo upload ──────────────────────────────
  onLogoChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { this.logoPreview = reader.result as string; };
    reader.readAsDataURL(file);
  }

  removeLogo(): void {
    this.logoPreview  = null;
    this.form.logoUrl = '';
  }

  // ── Logo URL ─────────────────────────────────
  onLogoUrlChange(event: Event): void {
    const url = (event.target as HTMLInputElement).value.trim();
    this.form.logoUrl   = url;
    this.logoUrlPreview = url;
    this.logoUrlValid   = null;
  }

  clearLogoUrl(): void {
    this.form.logoUrl   = '';
    this.logoUrlPreview = '';
    this.logoUrlValid   = null;
  }

  // ── Helpers ──────────────────────────────────
  get effectiveLogo(): string | null {
    if (this.logoSource === 'upload') return this.logoPreview;
    return this.logoUrlValid === true ? this.form.logoUrl : null;
  }

  private getInitials(name: string): string {
    return name.slice(0, 2).toUpperCase();
  }

  private emptyForm(): BrandForm {
    return {
      name: '', slug: '', description: '',
      website: '', logoUrl: '',
      color: '#2563eb', active: true,
    };
  }
}
