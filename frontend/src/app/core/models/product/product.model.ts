import { Category } from "../category/category.model";

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
