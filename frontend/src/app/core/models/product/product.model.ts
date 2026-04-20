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
  variantImages?: ImageResponse[]; // Có thể null hoặc rỗng
}

export interface ProductPageResponse {
  productCardResponse: ProductCardResponse;
  productImageResponses: ImageResponse[];
  variantResponses: VariantResponse[];
}
