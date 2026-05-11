import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { ProductService } from '../../../../core/services/product/product.service';
import { CategoryService } from '../../../../core/services/category/category.service';
import {
  BrandOption,
  BrandService
} from '../../../../core/services/brand/brand.service';

import {
  ProductCardResponse
} from '../../../../core/models/home-response/home-response';

import {
  CategoryOption
} from '../../../../feature-admin/pages/banners/banners.component';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  private filterChange$ = new Subject<void>();

  currentSlug = '';

  categories: CategoryOption[] = [];

  brands: BrandOption[] = [];

  // =========================
  // SELECTED FILTERS
  // =========================

  selectedCategory = '';
  selectedBrands = new Set<BrandOption>();
  selectedSort = 'popularity';
  selectedMin = 0;
  selectedMax = 5000000;
  minPrice = 0;
  maxPrice = 5000000;

  // =========================
  // PRODUCTS
  // =========================

  products: ProductCardResponse[] = [];
  totalFilteredProducts = 0;
  currentPage = 0;
  pageSize = 12;
  isLoading = false;
  isLoadingMore = false;
  hasMore = false;

  // =========================
  // DRAWER
  // =========================

  drawerOpen = false;

  drawerProduct: ProductCardResponse | null = null;

  // =========================
  // CATEGORY HEADER
  // =========================

  categoryName = '';

  categoryDesc = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService
  ) {}

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {
    this.loadBrands();
    // debounce filter
    this.filterChange$
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadProducts(true);
      });

    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const slug = params.get('slug') ?? '';
        this.currentSlug = slug;
        this.resetFilters();
        this.loadCategories();
        this.loadProducts(true);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =========================
  // LOAD CATEGORIES
  // =========================

  loadCategories(): void {
    if (!this.currentSlug) {
      this.categories = [];
      return;
    }

    this.categoryService
      .getCategoryOptionByParentSlug(this.currentSlug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.categories = res.data ?? [];
        },
        error: (err) => {
          console.error('[loadCategories] Error:', err);
          this.categories = [];
        }
      });
  }

  // =========================
  // LOAD BRANDS
  // =========================

  loadBrands(): void {
    this.brandService
      .getBrandOption()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.brands = res.data ?? [];
        },
        error: (err) => {
          console.error('[loadBrands] Error:', err);
          this.brands = [];
        }
      });
  }

  // =========================
  // LOAD PRODUCTS
  // =========================

  loadProducts(reset = false): void {
    if (reset) {
      this.currentPage = 0;
      this.products = [];
    }
    this.isLoading = reset;
    this.isLoadingMore = !reset;
    const params: any = {
      page: this.currentPage,
      size: this.pageSize,
      sort: this.sortParam,
      minPrice: this.selectedMin,
      maxPrice: this.selectedMax,
    };

    if (this.currentSlug) {
      params['categorySlug'] = this.currentSlug;
    }

    if (this.selectedCategory) {
      params['subCategory'] = this.selectedCategory;
    }

    if (this.selectedBrands.size) {
      params['brands'] = [...this.selectedBrands]
        .map(b => b.id)
        .join(',');
    }
    console.log(params);

    this.productService
      .getProductsByFilter(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const page = res.data;
          if (reset) {
            this.products = page.content;
          } else {
            this.products = [
              ...this.products,
              ...page.content
            ];
          }
          this.totalFilteredProducts = page.totalElements;
          this.hasMore = !page.last;
          this.isLoading = false;
          this.isLoadingMore = false;
        },
        error: (err) => {
          console.error('[loadProducts] Error:', err);
          this.isLoading = false;
          this.isLoadingMore = false;
        }
      });
  }

  // =========================
  // FILTER ACTIONS
  // =========================

  onSelectCategory(slug: string): void {
    this.selectedCategory =
      this.selectedCategory === slug ? '' : slug;
    this.filterChange$.next();
  }

  toggleBrand(brand: BrandOption): void {
    const existed = [...this.selectedBrands]
      .find(b => b.id === brand.id);
    if (existed) {
      this.selectedBrands.delete(existed);
    } else {
      this.selectedBrands.add(brand);
    }
    this.filterChange$.next();
  }
  isBrandSelected(id: number): boolean {
    return [...this.selectedBrands]
      .some(b => b.id === id);
  }

  onPriceChange(): void {
    if (this.selectedMin > this.selectedMax) {
      this.selectedMin = this.selectedMax;
    }
    this.filterChange$.next();
  }

  onSortChange(): void {
    this.filterChange$.next();
  }

  clearAllFilters(): void {
    this.resetFilters();
    this.loadProducts(true);
  }

  hasActiveFilters(): boolean {
    return !!(
      this.selectedCategory ||
      this.selectedBrands.size > 0 ||
      this.selectedMin !== this.minPrice ||
      this.selectedMax !== this.maxPrice
    );
  }

  private resetFilters(): void {
    this.selectedCategory = '';
    this.selectedBrands.clear();
    this.selectedMin = this.minPrice;
    this.selectedMax = this.maxPrice;
    this.selectedSort = 'popularity';
  }

  // =========================
  // PAGINATION
  // =========================

  onLoadMore(): void {

    this.currentPage++;

    this.loadProducts(false);
  }

  onBackToTop(): void {

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // =========================
  // DRAWER
  // =========================

  openDrawer(product: ProductCardResponse): void {
    this.drawerProduct = product;
    this.drawerOpen = true;
  }

  closeDrawer(): void {
    this.drawerOpen = false;
    this.drawerProduct = null;
  }

  onAddedToCart(item: any): void {
    console.log('Added to cart:', item);
  }

  // =========================
  // GETTERS
  // =========================

  get sortParam(): string {
    switch (this.selectedSort) {

      case 'priceAsc':
        return 'effectivePrice,asc';

      case 'priceDesc':
        return 'effectivePrice,desc';

      case 'newest':
        return 'createdAt,desc';

      case 'popularity':
      default:
        return 'soldCount,desc';
    }
  }

  get pageTitle(): string {

    if (this.currentSlug) {

      return this.categories.find(
        c => c.slug === this.currentSlug
      )?.name ?? this.currentSlug;
    }

    return 'Tất cả sản phẩm';
  }

  applyFilters(): void {

    this.currentPage = 0;

    this.filterChange$.next();
  }
}
