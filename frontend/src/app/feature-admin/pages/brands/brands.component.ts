import { Component } from '@angular/core';

export interface AdminBrand {
  id: number;
  name: string;
  productCount: number;
  active: boolean;
  initials: string;
  color: string;
}

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent {

  searchQuery = '';

  brands: AdminBrand[] = [
    { id: 1, name: 'DECATHLON',    productCount: 245, active: true,  initials: 'DC', color: '#2563eb' },
    { id: 2, name: 'NABAIJI',      productCount: 88,  active: true,  initials: 'NB', color: '#0891b2' },
    { id: 3, name: 'KIPRUN',       productCount: 112, active: true,  initials: 'KR', color: '#16a34a' },
    { id: 4, name: 'DOMYOS',       productCount: 76,  active: true,  initials: 'DM', color: '#7c3aed' },
    { id: 5, name: 'QUECHUA',      productCount: 95,  active: true,  initials: 'QC', color: '#ea580c' },
    { id: 6, name: 'NIKE',         productCount: 134, active: true,  initials: 'NK', color: '#111827' },
    { id: 7, name: 'ADIDAS',       productCount: 118, active: true,  initials: 'AD', color: '#1d4ed8' },
    { id: 8, name: 'SPEEDO',       productCount: 54,  active: false, initials: 'SP', color: '#dc2626' },
    { id: 9, name: 'YONEX',        productCount: 43,  active: true,  initials: 'YX', color: '#b45309' },
    { id: 10, name: 'WILSON',      productCount: 38,  active: true,  initials: 'WL', color: '#0f766e' },
  ];

  get filteredBrands(): AdminBrand[] {
    if (!this.searchQuery) return this.brands;
    return this.brands.filter(b =>
      b.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
