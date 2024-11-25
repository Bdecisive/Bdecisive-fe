import { buildUrl, ENDPOINTS } from '../Config/endpoints';
import { toast } from 'react-toastify';
import { useSpinnerAction } from '../Utils/useSpinnerAction';
import { useState } from 'react';
import { api } from './ApiService';
import { Category, CreateCategoryData } from '../Models/Category';

export const CategoryService = {
    async getCategories(): Promise<Category[]> {
        try {
            const response = await api.get(buildUrl(ENDPOINTS.CATEGORY.LIST));
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async createCategory(data: CreateCategoryData): Promise<Category> {
        try {
            const response = await api.post(buildUrl(ENDPOINTS.CATEGORY.CREATE), data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async approveCategory(userId: string): Promise<void> {
        try {
            await api.patch(buildUrl(ENDPOINTS.CATEGORY.APPROVE(userId)));
        } catch (error) {
            throw error;
        }
    },

    async rejectCategory(userId: string): Promise<void> {
        try {
            await api.patch(buildUrl(ENDPOINTS.CATEGORY.REJECT(userId)));
        } catch (error) {
            throw error;
        }
    },
};

export const useCategory = () => {
    const withSpinner = useSpinnerAction();
    const [categories, setCategories] = useState<Category[]>([]);

    const fetchCategories = async () => {
        await withSpinner(async () => {
            try {
                const response = await CategoryService.getCategories();
                setCategories(response);
                return response;
            } catch (error) {
                toast.error('Failed to fetch vendors');
                console.error('Error fetching vendors:', error);
                throw error;
            }
        });
    };

    const createCategory = async (data: CreateCategoryData) => {
        await withSpinner(async () => {
            try {
                await CategoryService.createCategory(data);
                toast.success('Category created successfully');
                await fetchCategories(); // Refresh the list
            } catch (error) {
                toast.error('Failed to create category');
                console.error('Error creating category:', error);
                throw error;
            }
        });
    };

    const approveCategory = async (userId: string) => {
        await withSpinner(async () => {
            try {
                await CategoryService.approveCategory(userId);
                toast.success('Category has approved successfully');
                await fetchCategories();
            } catch (error) {
                toast.error('Failed to approve vendor');
                console.error('Error approving vendor:', error);
                throw error;
            }
        });
    };

    const rejectCategory = async (userId: string) => {
        await withSpinner(async () => {
            try {
                await CategoryService.rejectCategory(userId);
                toast.success('Category has rejected successfully');
                await fetchCategories();
            } catch (error) {
                toast.error('Failed to delete vendor');
                console.error('Error deleting vendor:', error);
                throw error;
            }
        });
    };

    return {
        categories,
        fetchCategories,
        createCategory,
        approveCategory,
        rejectCategory
    };
};