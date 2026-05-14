import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from "@angular/router";
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductService } from "../../../core/services/product/product.service";
import { ProductAdminResponse } from "../../../core/models/product/product.model";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  // ── State ─────────────────────────────────────────────────────────────────
  isLoading      = false;
  products       = signal<ProductAdminResponse[]>([]);
  totalElements  = signal(0);
  totalPages     = signal(0);
  currentPage    = signal(0);
  pageSize       = signal(10);

  searchKeyword    = '';
  selectedCategory = '';
  selectedActive: boolean | undefined = undefined;
  viewMode: 'table' | 'grid' = 'table';
  openDropdownId: number | null = null;
  isAddPanelOpen = signal(false);

  private searchSubject = new Subject<string>();

  // ── Filter options ────────────────────────────────────────────────────────
  // categories = [
  //   { value: '',            label: 'Tất cả danh mục' },
  //   { value: 'boi-loi',    label: 'Bơi lội'          },
  //   { value: 'chay-bo',    label: 'Chạy bộ'          },
  //   { value: 'chong-nang', label: 'Chống nắng'       },
  // ];

  statusOptions = [
    { value: undefined, label: 'Tất cả'         },
    { value: true,      label: 'Đang bán'        },
    { value: false,     label: 'Đã ẩn'           },
  ];

  pagesArray = computed(
    () => Array.from({ length: this.totalPages() }, (_, i) => i));

  constructor(
    private router: Router,
    private productService: ProductService
  ) {}

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadProducts();

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(keyword => {
      this.searchKeyword = keyword;
      this.currentPage.set(0);
      this.loadProducts();
    });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  // ── Load ──────────────────────────────────────────────────────────────────
  loadProducts(): void {
    this.isLoading = true;

    this.productService.getProductsForAdmin({
      page:         this.currentPage(),
      size:         this.pageSize(),
      keyword:      this.searchKeyword     || undefined,
      categorySlug: this.selectedCategory  || undefined,
      active:       this.selectedActive,
    }).subscribe({
      next: (res) => {
        if (res.data) {
          this.products.set(res.data.content);
          this.totalElements.set(res.data.totalElements);
          this.totalPages.set(res.data.totalPages);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('[PRODUCT] Lỗi tải sản phẩm:', err);
        this.isLoading = false;
      }
    });
  }

  // ── Search & Filter ───────────────────────────────────────────────────────
  onSearchInput(keyword: string): void {
    this.searchSubject.next(keyword);
  }

  onCategoryChange(categorySlug: string): void {
    this.selectedCategory = categorySlug;
    this.currentPage.set(0);
    this.loadProducts();
  }

  onStatusChange(active: boolean | undefined): void {
    this.selectedActive = active;
    this.currentPage.set(0);
    this.loadProducts();
  }

  // ── Pagination ────────────────────────────────────────────────────────────
  onPageChange(pageIndex: number): void {
    if (pageIndex >= 0 && pageIndex < this.totalPages()) {
      this.currentPage.set(pageIndex);
      this.loadProducts();
    }
  }

  onPageSizeChange(): void {
    this.currentPage.set(0);
    this.loadProducts();
  }

  goToPreviousPage(): void {
    if (this.currentPage() > 0) {
      this.onPageChange(this.currentPage() - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.onPageChange(this.currentPage() + 1);
    }
  }

  trackByPageIndex(index: number, item: number): number {
    return item;
  }

  // ── Navigate ──────────────────────────────────────────────────────────────
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

  // ── Dropdown ──────────────────────────────────────────────────────────────
  toggleDropdown(id: number, event: Event): void {
    event.stopPropagation();
    this.openDropdownId = this.openDropdownId === id ? null : id;
  }

  closeDropdown(): void {
    this.openDropdownId = null;
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  onDeleteProduct(id: number): void {
    this.openDropdownId = null;
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products.update(list => list.filter(p => p.id !== id));
      },
      error: (err) => {
        console.error('[PRODUCT] Lỗi xóa sản phẩm:', err);
        alert(err.error?.message || 'Xóa sản phẩm thất bại');
      }
    });
  }

  onToggleStatus(product: ProductAdminResponse): void {
    // this.openDropdownId = null;
    // this.productService.updateProductStatus(product.id, !product.active).subscribe({
    //   next: () => this.loadProducts(),
    //   error: (err) => console.error('[PRODUCT] Lỗi đổi trạng thái:', err)
    // });
  }

  // ── Panel ─────────────────────────────────────────────────────────────────
  openAddProduct(): void {
    this.isAddPanelOpen.set(true);
  }

  closePanel(): void {
    this.isAddPanelOpen.set(false);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  formatPrice(price: number | null | undefined): string {
    if (price == null) return '0đ';
    return price.toLocaleString('vi-VN') + 'đ';
  }

  getInitials(name: string): string {
    if (!name) return 'TN';
    const normalized = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
    const words = normalized.trim().split(/\s+/);
    return words.length >= 2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : words[0].slice(0, 2).toUpperCase();
  }

  protected readonly close = close;
}
