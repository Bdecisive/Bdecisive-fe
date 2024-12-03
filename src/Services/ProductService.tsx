// services/product.service.ts
import { api } from './ApiService';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { SaveProductData, Product } from '../Models/Product';
import { buildUrl, ENDPOINTS } from '../Config/endpoints';
import { useSpinnerAction } from '../Utils/useSpinnerAction';

export const ProductService = {
  async getProductsByVendor(userId: number): Promise<Product[]> {
    const response = await api.get(ENDPOINTS.PRODUCT.VENDOR_LIST(userId));
    return response.data;
  },

  async createProduct(data: SaveProductData): Promise<Product> {
    const response = await api.post(buildUrl(ENDPOINTS.PRODUCT.CREATE), data);
    return response.data;
  },

  async updateProduct(productId: number, data: SaveProductData): Promise<Product> {
    const response = await api.put(buildUrl(ENDPOINTS.PRODUCT.UPDATE(productId)), data);
    return response.data;
  },

  async deleteProduct(productId: number): Promise<void> {
    await api.delete(buildUrl(ENDPOINTS.PRODUCT.DELETE(productId)));
  },

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const response = await api.get(ENDPOINTS.PRODUCT.CATEGORY_LIST(categoryId));
    return response.data;
  }
};

export const useProduct = () => {
  const withSpinner = useSpinnerAction();
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProductsByVendor = async (userId: number) => {
    await withSpinner(async () => {
      try {
        if (userId) {
            const response = await ProductService.getProductsByVendor(userId);
            setProducts(response);
        } else {
            setProducts([]);
        }
      } catch (error) {
        toast.error('Failed to fetch products');
        console.error('Error fetching products:', error);
        throw error;
      }
    });
  };

  const fetchProductsByCategory = async (categoryId: number) => {
    await withSpinner(async () => {
      try {
        if (categoryId) {
            const response = await ProductService.getProductsByCategory(categoryId);
            setProducts(response);
        } else {
            setProducts([]);
        }
      } catch (error) {
        toast.error('Failed to fetch products by category');
        console.error('Error fetching products by category:', error);
        throw error;
      }
    });
  };

  const createProduct = async (data: SaveProductData) => {
    await withSpinner(async () => {
      try {
        await ProductService.createProduct(data);
        toast.success('Product created successfully');
        if (data.userId) {
          await fetchProductsByVendor(data.userId); 
        }
      } catch (error) {
        toast.error('Failed to create product');
        console.error('Error creating product:', error);
        throw error;
      }
    });
  };

  const updateProduct = async (productId: number, data: SaveProductData) => {
    await withSpinner(async () => {
      try {
        await ProductService.updateProduct(productId, data);
        toast.success('Product updated successfully');
        if (data.userId) {
          await fetchProductsByVendor(data.userId); 
        }
      } catch (error) {
        toast.error('Failed to update product');
        console.error('Error updating product:', error);
        throw error;
      }
    });
  };

  const deleteProduct = async (productId: number, userId: number) => {
    await withSpinner(async () => {
      try {
        await ProductService.deleteProduct(productId);
        toast.success('Product deleted successfully');
        await fetchProductsByVendor(userId);
      } catch (error) {
        toast.error('Failed to delete product');
        console.error('Error deleting product:', error);
        throw error;
      }
    });
  };

  return {
    products,
    fetchProductsByVendor,
    fetchProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct
  };
};