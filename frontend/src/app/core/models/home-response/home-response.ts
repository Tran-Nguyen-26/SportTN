// home.model.ts
export interface BannerResponse {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  displayOrder: number;
}

export interface ProductCardResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
  mainImageUrl: string;
  brandName: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  originalPrice: number;
  salePrice: number;
  effectivePrice: number;
  discountPercent: number;
  isOnSale: boolean;
  isNew: boolean;
  isBestSeller: boolean;
}


export interface CategoryResponse {
  id: number;
  name: string;           // "Bơi lội"
  slug: string;           // "swimming"
  description: string;
  imageUrl: string;       // ảnh tròn
  linkUrl: string;        // /product?category=swimming
}

export interface CategorySectionResponse {
  categoryId: number;
  title: string;
  categorySlug: string;
  banners: BannerResponse[];
  subCategories: CategoryResponse[];
  products: ProductCardResponse[];
}

export interface HomeResponse {
  heroBanners: BannerResponse[];
  mostSearched: ProductCardResponse[];
  categories: CategoryResponse[];
  sportsPopular: CategoryResponse[];
  bestSellers: ProductCardResponse[];
  cheapQuality: ProductCardResponse[];
  categorySections: CategorySectionResponse[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
