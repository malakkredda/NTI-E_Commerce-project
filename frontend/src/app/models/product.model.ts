export interface Product {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  category: 'makeup' | 'accessories';
  quantity: number;
}

export interface ProductResponse {
  products?: Product[];
  product?: Product;
  message?: string;
}