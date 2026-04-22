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

//admin

export interface ProductAdminResponse {
  id: number;
  name: string;
  categoryName: string;   // Đổi từ category -> categoryName
  brandName: string;      // Đổi từ brand -> brandName
  minPrice: number;       // Đổi từ price -> minPrice
  salePrice: number;
  totalStock: number;     // Đổi từ stock -> totalStock
  soldCount: number;      // Đổi từ sold -> soldCount
  rating: number;
  active: boolean;        // Chú ý: BE đang để kiểu gì thì FE để kiểu đó (thường là boolean)
  mainImageUrl: string;   // Đổi từ image -> mainImageUrl
}


// variant-update-request.model.ts
export interface VariantUpdateRequest {
  id?: number; // Có id nếu là variant cũ, không có nếu là cái mới thêm ở FE
  sku: string;
  color: string;
  size: string;
  originalPrice: number;
  salePrice: number;
  stockQuantity: number;
  weightGram: number;
  imageUrls: string[]; // Danh sách URL ảnh cho variant
}

// product-update-request.model.ts
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
  imageUrls: string[];
}

export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  brandId: number;
  active: boolean;
  mainImageUrl: string;
  extraImageUrls: string[];
  variants: VariantDetail[];
}
