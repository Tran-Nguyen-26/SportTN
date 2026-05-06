import {Component, computed, OnInit, signal} from '@angular/core';
import {Router} from "@angular/router";
import {ProductService} from "../../../core/services/product/product.service";
import {ProductAdminResponse} from "../../../core/models/product/product.model";

// export interface AdminProduct {
//   id: number;
//   name: string;
//   category: string;
//   brand: string;
//   price: number;
//   salePrice: number | null;
//   stock: number;
//   sold: number;
//   rating: number;
//   status: string;
//   image: string;
// }

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(private router: Router, private productService: ProductService) {
  }

  searchQuery = '';
  selectedCategory = '';
  viewMode: 'table' | 'grid' = 'table';

  openDropdownId: number | null = null;

  isAddPanelOpen = signal(false);

  categories = [
    { value: '',           label: 'Tất cả danh mục' },
    { value: 'Bơi lội',   label: 'Bơi lội' },
    { value: 'Chạy bộ',   label: 'Chạy bộ' },
    { value: 'Chống nắng', label: 'Chống nắng' },
  ];

  products = signal<ProductAdminResponse[]>([]);

  totalElements = signal(0);
  totalPages = signal(0);
  currentPage = signal(0);
  pageSize = signal(10);

  pagesArray = computed(
    () => Array.from({ length: this.totalPages() }, (_, i) => i));

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    const params = {
      page: this.currentPage(),
      size: this.pageSize(),
    }

    this.productService.getProductsForAdmin(params).subscribe({
      next: (res) => {
        if (res.data) {
          console.log("Danh sách sản phẩm: ", res.data);
          this.products.set(res.data.content);
          this.totalElements.set(res.data.totalElements);
          this.totalPages.set(res.data.totalPages);
        }
      },
      error: (err) => {
        console.error('Lỗi tải sản phẩm:', err);
      }
    })
  }

  get filteredProducts(): ProductAdminResponse[] {
    const data = this.products();

    return data.filter(p => {
      const matchCat    = !this.selectedCategory || p.categoryName === this.selectedCategory;
      const matchSearch = !this.searchQuery
        || p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        || p.brandName.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }

  formatPrice(price: number | null | undefined): string {
    if (price === null || price === undefined) {
      return '0đ';
    }
    return price.toLocaleString('vi-VN') + 'đ';
  }

  getInitials(name: string): string {
    if (!name) return 'TN';

    const normalizedName = name
      .normalize('NFD') // Tách dấu ra khỏi chữ cái (vd: Á -> A + dấu sắc)
      .replace(/[\u0300-\u036f]/g, '') // Xóa các ký tự dấu đó đi
      .replace(/đ/g, 'd').replace(/Đ/g, 'D'); // Xử lý riêng chữ đ/Đ

    const words = normalizedName.trim().split(/\s+/); // split(/\s+/) để xử lý nhiều khoảng trắng thừa

    if (words.length >= 2) {
      // Lấy chữ cái đầu của 2 từ đầu tiên
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }

    // Nếu chỉ có 1 từ, lấy 2 chữ cái đầu của từ đó
    return words[0].slice(0, 2).toUpperCase();
  }

  openAddProduct() {
    this.isAddPanelOpen.set(true);
  }

  // 3. Hàm đóng Panel
  closePanel() {
    this.isAddPanelOpen.set(false);
  }

  goToAdd(): void {
    this.router.navigate(['/admin/products/add']);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/admin/products/edit', id]);
    this.closeDropdown();
  }

  goToDetail(id: number): void {
    this.router.navigate(['/admin/products/detail', id]);
    this.closeDropdown();
  }

  toggleDropdown(id: number, event: Event): void {
    event.stopPropagation();
    this.openDropdownId = this.openDropdownId === id ? null : id;
  }

  closeDropdown(): void {
    this.openDropdownId = null;
  }

  onDeleteProduct(id: number): void {
    this.openDropdownId = null;
    // TODO: mở confirm dialog
    console.log('Delete product:', id);
  }

  onToggleStatus(product: any): void {
    product.status = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.openDropdownId = null;
  }

  onPageChange(pageIndex: number) {
    if (pageIndex >= 0 && pageIndex < this.totalPages()) {
      this.currentPage.set(pageIndex);
      this.loadProducts();
    }
  }

  goToPreviousPage() {
    if (this.currentPage() > 0) {
      this.onPageChange(this.currentPage() - 1);
    }
  }

  goToNextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.onPageChange(this.currentPage() + 1);
    }
  }

  trackByPageIndex(index: number, item: number) {
    return item;
  }

  protected readonly close = close;
}
