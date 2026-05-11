import { Component, EventEmitter, Output } from '@angular/core';
import { ProductCardResponse } from '../../../../core/models/home-response/home-response';
import { Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product/product.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  @Output() searchStateChange = new EventEmitter<boolean>();

  isSearchFocus = false;
  isLoading     = false;
  searchQuery   = '';

  popularProducts: ProductCardResponse[] = [];
  searchResults:   ProductCardResponse[] = [];

  // ── Drawer state ──────────────────────────────
  drawerOpen    = false;
  drawerProduct: ProductCardResponse | null = null;

  private searchSubject = new Subject<string>();

  constructor(private router: Router, private productService: ProductService) {
    this.searchSubject.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(query => {
        this.isLoading = true;
        return this.productService.searchProducts(query);
      })
    ).subscribe({
      next: (res) => { this.searchResults = res.data?.content ?? []; this.isLoading = false; },
      error: ()   => { this.isLoading = false; }
    });
  }

  onFocus(): void {
    this.isSearchFocus = true;
    this.searchStateChange.emit(true);
    if (this.popularProducts.length === 0) {
      this.isLoading = true;
      this.productService.getPopularProducts().subscribe({
        next: (res) => { this.popularProducts = res.data; this.isLoading = false; },
        error: ()   => { this.isLoading = false; }
      });
    }
  }

  onBlur(): void {
    // Delay để drawer click không bị chặn
    setTimeout(() => {
      if (!this.drawerOpen) {
        this.isSearchFocus = false;
        this.searchStateChange.emit(false);
      }
    }, 200);
  }

  onInput(): void {
    if (this.searchQuery.trim()) {
      this.searchSubject.next(this.searchQuery.trim());
    } else {
      this.searchResults = [];
    }
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) return;
    this.isSearchFocus = false;
    this.searchStateChange.emit(false);
    this.router.navigate(['/search'], { queryParams: { q: this.searchQuery.trim() } });
  }

  clearSearch(): void {
    this.searchQuery   = '';
    this.searchResults = [];
  }

  // ── Drawer handlers ───────────────────────────
  openDrawer(product: ProductCardResponse): void {
    this.drawerProduct = product;
    this.drawerOpen    = true;
    this.isSearchFocus = false; // đóng dropdown khi mở drawer
  }

  closeDrawer(): void {
    this.drawerOpen    = false;
    this.drawerProduct = null;
  }

  onAddedToCart(item: any): void {
    console.log('Added to cart from search:', item);
  }
}
