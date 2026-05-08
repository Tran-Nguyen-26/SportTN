export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  brand: string;
  category: Category;
  image: string;        // ảnh chính (fallback)
  rating: number;
  reviews: number;
}

/**
 * Một biến thể cụ thể của sản phẩm (size + màu sắc).
 * Mỗi variant có giá, stock và ảnh riêng.
 */
export interface ProductVariant {
  id: number;
  productId: string;
  size: string;
  color: string;
  colorHex: string;
  image: string;
  originalPrice: number;
  salePrice: number;
  stock: number;
  sku: string;
}

export interface CartItem {
  id: number;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  priceSnapshot: number;
}

// export interface Cart {
//   id: number;
//   userId: number;
//   items: CartItem[];
//   totalPrice: number;
//   totalItems: number;
// }
