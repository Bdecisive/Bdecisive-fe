import { GlobalCategory } from "./Category";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: GlobalCategory;
    reviews?: Array<{
        id: string;
        content: string;
        rating: number;
        // Add other review fields as needed
    }>;
}

export interface SaveProductData {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    userId?: string
}