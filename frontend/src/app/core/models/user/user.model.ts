import { Address } from "../address/address.model";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatar?: string;
}

export interface UserProfile {
  user: User;
  addresses: Address[];
  totalOrders: number;
  totalSpent: number;
}
