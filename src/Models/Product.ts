import { GlobalCategory } from "./Category";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: GlobalCategory;
    reviews?: Array<{
        id: string;
        content: string;
        rating: number;
    }>;
}

export interface SaveProductData {
    name: string;
    description: string;
    price: number;
    categoryId: number;
    userId?: number
}