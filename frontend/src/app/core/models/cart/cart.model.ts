export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface Product {
  id: string;
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
  id: string;
  productId: string;
  size: string;           // VD: "S", "M", "L", "XL", "40", "41", "42"
  color: string;          // VD: "Đen", "Trắng", "Đỏ"
  colorHex: string;       // VD: "#1a1a1a" — dùng để render dot màu
  image: string;          // ảnh riêng của variant
  originalPrice: number;  // giá gốc (để tính tiết kiệm)
  salePrice: number;      // giá bán thực tế
  stock: number;          // tồn kho của variant này
  sku: string;
}

export interface CartItem {
  id: string;             // cart-item id (khác product id)
  product: Product;
  variant: ProductVariant;
  quantity: number;
  priceSnapshot: number;  // = variant.salePrice lúc thêm vào giỏ
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}
