export interface ProductImage {
  id: number;
  url: string;
  isMain: boolean;
  productId: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  colors: string[];
  sizes: string[];
  collaborateur?: string;
  images: ProductImage[];
  createdAt: Date;
  updatedAt: Date;
}