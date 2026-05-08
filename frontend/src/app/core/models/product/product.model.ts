import { Category } from "../category/category.model";
import {ProductCardResponse} from "../home-response/home-response";
import {ImageResponse} from "../image";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  brand: string;
  category: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  brand: string;
  category: Category;
}

export interface VariantResponse {
  id: number;
  sku: string;
  color: string;
  size: string;
  originalPrice: number;
  salePrice: number;
  effectivePrice: number;
  stockQuantity: number;
  weightGram: number;
  mainImageUrl: string;
  variantImages?: ImageResponse[]; // Có thể null hoặc rỗng
}

export interface ProductPageResponse {
  productCardResponse: ProductCardResponse;
  productImageResponses: ImageResponse[];
  variantResponses: VariantResponse[];
}

//admin

export interface ProductAdminResponse {
  id: number;
  name: string;
  categoryName: string;
  brandName: string;
  minPrice: number;
  salePrice: number;
  totalStock: number;
  soldCount: number;
  rating: number;
  active: boolean;
  mainImageUrl: string;
}


// variant-update-request.model.ts
export interface VariantUpdateRequest {
  id?: number;
  sku: string;
  color: string;
  size: string;
  originalPrice: number;
  salePrice: number;
  stockQuantity: number;
  weightGram: number;
  mainImageUrl: string;
  imageUrls: string[];
}

export interface ProductUpdateRequest {
  name: string;
  description: string;
  categoryId: number;
  brandId: number;
  active: boolean;
  mainImageUrl: string;
  extraImageUrls: string[];
  variants: VariantUpdateRequest[];
}

export interface VariantDetail {
  id?: number;
  sku: string;
  color: string;
  size: string;
  originalPrice: number;
  salePrice: number;
  stockQuantity: number;
  weightGram: number;
  mainImageUrl: string;
  imageUrls: string[];
}

export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  categoryId: number;
  brandId: number;
  active: boolean;
  mainImageUrl: string;
  extraImageUrls: string[];
  variants: VariantDetail[];
}
