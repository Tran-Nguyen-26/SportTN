import {Component, OnInit, signal} from '@angular/core';
import {BrandAddRequest, BrandResponse} from "../../../core/models/brand/brand";
import {BrandService} from "../../../core/services/brand/brand.service";

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements OnInit {

  constructor(private brandService: BrandService) {

  }

  brands = signal<BrandResponse[]>([]);
  searchQuery = signal('');
  drawerVisible = false;
  editingBrand: BrandResponse | null = null;
  isLoading = signal(false);

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

  form: BrandAddRequest = this.emptyForm();

  ngOnInit() {
    this.loadBrands();
  }

  loadBrands() {
    this.isLoading.set(true);
    this.brandService.getBrands().subscribe({
      next: (res) => {
        if (res.data) {
          this.brands.set(res.data);
        }
        this.isLoading.set(false);
        console.log(res.data);
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách thương hiệu:', err);
        this.isLoading.set(false);
      }
    })
  }

  // ── Filter ───────────────────────────────────
  get filteredBrands(): BrandResponse[] {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.brands();
    return this.brands().filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.slug.toLowerCase().includes(q)
    );
  }

  // ── Drawer ───────────────────────────────────
  openDrawer(brand?: BrandResponse): void {
    if (brand) {
      this.editingBrand = brand;
      this.form = {
        name:        brand.name,
        slug:        brand.slug,
        description: brand.description,
        websiteUrl:     brand.websiteUrl,
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
      const updateData: BrandAddRequest = {
        ...this.form,
        logoUrl
      }
      this.brandService.updateBrand(this.editingBrand.id, updateData).subscribe({
        next: (res) => {
          if (res.data) {
            this.brands.update(all =>
              all.map(b => b.id === res.data!.id ? res.data! : b)
            );
            this.closeDrawer();
          }
        }
      })
    } else {
      this.brandService.addBrand({...this.form, logoUrl}).subscribe(res => {
        if (res.data) {
          this.brands.update(all => [res.data, ...all]);
          this.closeDrawer();
        }
      })
    }
    this.closeDrawer();
  }

  deleteBrand(id: number): void {
    // TODO: confirm + API
    // this.brands = this.brands().filter(b => b.id !== id);
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

  private emptyForm(): BrandAddRequest {
    return {
      name: '', slug: '', description: '',
      websiteUrl: '', logoUrl: '',
      color: '#2563eb',
      active: true,
    };
  }
}
