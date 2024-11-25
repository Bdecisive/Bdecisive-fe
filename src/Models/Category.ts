export interface Category {
    id: string;
    name: string;
    vendorName: string;
    companyName: string;
    description: string;
    approved?: boolean;
    approvedDate?: string;
    createdAt?: string;
}

export type CreateCategoryData = Omit<Category, 'id' | 'vendorName' | 'companyName' | 'approved' | 'approvedDate' | 'createdAt'>;
