export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  images: string[];
  coverImage: string;
  category: string;
  inStock: boolean;
  featured: boolean;
  bestSeller: boolean;
  forYou: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  productIds: string[];
}

export interface Banner {
  id: string;
  title: string;
  image: string;
  link?: string;
  active: boolean;
}
