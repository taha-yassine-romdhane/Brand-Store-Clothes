export interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    image?: string;
    colors: string[];
    sizes: string[];
    categories: string[];
    priceRanges: string[];
    sort: string;
    color: string;
    size: string;
    category: string;
    salePrice?: number;
    isSale?: boolean;
    isNew?: boolean;
    isFeatured?: boolean;
    quantity?: number;
  }