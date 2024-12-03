import { Category, GlobalCategory } from "./Category";
import { Product } from "./Product";

export interface Review {
    id: number;
    product: Product;
    category: GlobalCategory;
    name: string;
    rating: number;
    details: string;
    createdAt: string;
    likedByUser: boolean;
    likeCount?: number;
    comments?: Comment[];
}

export interface CreateReviewData {
    categoryId: number;
    productId: number;
    rating: number;
    details: string;
}

export interface ReviewResponse {
    id: string;
    product: Product;
    category: GlobalCategory;
    rating: number;
    details: string;
    createdAt: string;
}

export interface Comment {
    id: number;
    content: string;
    userName: string;
    createdAt: string;
}