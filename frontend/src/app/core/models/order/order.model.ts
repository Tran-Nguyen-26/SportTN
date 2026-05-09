// import { Address } from '../address/address.model';
// import { CartItem } from '../cart/cart.model';
//
// export interface Order {
//   id: string;
//   userId: string;
//   items: CartItem[];
//   totalPrice: number;
//   status: OrderStatus;
//   deliveryAddress: Address;
//   paymentMethod: string;
//   createdAt?: string;
//   updatedAt?: string;
// }
//
// export interface CreateOrderRequest {
//   deliveryAddressId: string;
//   paymentMethod: string;
//   couponCode?: string;
// }
//
// export interface OrderResponse {
//   id: string;
//   userId: string;
//   items: CartItem[];
//   totalPrice: number;
//   status: OrderStatus;
//   deliveryAddress: Address;
//   paymentMethod: string;
// }
//
// export enum OrderStatus {
//   PENDING = 'PENDING',
//   CONFIRMED = 'CONFIRMED',
//   SHIPPED = 'SHIPPED',
//   DELIVERED = 'DELIVERED',
//   CANCELLED = 'CANCELLED',
//   RETURNED = 'RETURNED'
// }
