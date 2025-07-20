import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  _id?: string;
}

export interface Cart {
  _id?: string;
  user: string;
  items: CartItem[];
  totalAmount?: number;
}

export interface CartResponse {
  cart?: Cart;
  message?: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}