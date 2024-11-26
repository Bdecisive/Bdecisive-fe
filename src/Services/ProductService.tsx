// services/product.service.ts
import { api } from './ApiService';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { SaveProductData, Product } from '../Models/Product';
import { buildUrl, ENDPOINTS } from '../Config/endpoints';
import { useSpinnerAction } from '../Utils/useSpinnerAction';

export const ProductService = {
  async getProductsByVendor(userId: string): Promise<Product[]> {
    const response = await api.get(ENDPOINTS.PRODUCT.VENDOR_LIST(userId));
    return response.data;
  },

  async createProduct(data: SaveProductData): Promise<Product> {
    const response = await api.post(buildUrl(ENDPOINTS.PRODUCT.CREATE), data);
    return response.data;
  },

  async updateProduct(productId: string, data: SaveProductData): Promise<Product> {
    const response = await api.put(buildUrl(ENDPOINTS.PRODUCT.UPDATE(productId)), data);
    return response.data;
  },

  async deleteProduct(productId: string): Promise<void> {
    await api.delete(buildUrl(ENDPOINTS.PRODUCT.DELETE(productId)));
  }
};

export const useProduct = () => {
  const withSpinner = useSpinnerAction();
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProductsByVendor = async (userId: string) => {
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

  const createProduct = async (data: SaveProductData) => {
    await withSpinner(async () => {
      try {
        await ProductService.createProduct(data);
        toast.success('Product created successfully');
        await fetchProductsByVendor(data.userId || ''); 
      } catch (error) {
        toast.error('Failed to create product');
        console.error('Error creating product:', error);
        throw error;
      }
    });
  };

  const updateProduct = async (productId: string, data: SaveProductData) => {
    await withSpinner(async () => {
      try {
        await ProductService.updateProduct(productId, data);
        toast.success('Product updated successfully');
        await fetchProductsByVendor(data.userId || ''); 
      } catch (error) {
        toast.error('Failed to update product');
        console.error('Error updating product:', error);
        throw error;
      }
    });
  };

  const deleteProduct = async (productId: string, userId: string) => {
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
    createProduct,
    updateProduct,
    deleteProduct
  };
};