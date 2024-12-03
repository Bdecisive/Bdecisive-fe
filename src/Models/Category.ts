export interface Category {
    id: number;
    name: string;
    vendorName: string;
    companyName: string;
    description: string;
    approved?: boolean;
    approvedDate?: string;
    createdAt?: string;
}

export type CreateCategoryData = Omit<Category, 'id' | 'vendorName' | 'companyName' | 'approved' | 'approvedDate' | 'createdAt'>;

export interface GlobalCategory {
    id: number;
    name: string;
}
