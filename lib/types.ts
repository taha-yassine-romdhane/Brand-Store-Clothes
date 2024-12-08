export interface ProductImage {
  id: number;
  url: string;
  isMain: boolean;
  productId: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  description?: string;
  colors: string[];
  sizes: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
  images: ProductImage[];
}