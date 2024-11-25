import axios from 'axios';
import { Vendor } from '../Models/Vendor';
import { API_URL } from '../Config';
import { buildUrl, ENDPOINTS } from '../Config/endpoints';
import { toast } from 'react-toastify';
import { useSpinnerAction } from '../Utils/useSpinnerAction';
import { useState } from 'react';
import { api } from './ApiService';

export const VendorService = {
    async getVendors(): Promise<Vendor[]> {
        try {
            const response = await api.get(buildUrl(ENDPOINTS.VENDOR.LIST));
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async approveVendor(vendorId: string): Promise<void> {
        try {
            await api.patch(buildUrl(ENDPOINTS.VENDOR.APPROVE(vendorId)));
        } catch (error) {
            throw error;
        }
    },

    async rejectVendor(vendorId: string): Promise<void> {
        try {
            await api.patch(buildUrl(ENDPOINTS.VENDOR.REJECT(vendorId)));
        } catch (error) {
            throw error;
        }
    },
};

export const useVendor = () => {
    const withSpinner = useSpinnerAction();
    const [vendors, setVendors] = useState<Vendor[]>([]);

    const fetchVendors = async () => {
        await withSpinner(async () => {
            try {
                const response = await VendorService.getVendors();
                setVendors(response);
                return response;
            } catch (error) {
                toast.error('Failed to fetch vendors');
                console.error('Error fetching vendors:', error);
                throw error;
            }
        });
    };

    const approveVendor = async (vendorId: string) => {
        await withSpinner(async () => {
            try {
                await VendorService.approveVendor(vendorId);
                toast.success('Vendor has approved successfully');
                await fetchVendors();
            } catch (error) {
                toast.error('Failed to approve vendor');
                console.error('Error approving vendor:', error);
                throw error;
            }
        });
    };

    const rejectVendor = async (vendorId: string) => {
        await withSpinner(async () => {
            try {
                await VendorService.rejectVendor(vendorId);
                toast.success('Vendor has rejected successfully');
                await fetchVendors(); 
            } catch (error) {
                toast.error('Failed to delete vendor');
                console.error('Error deleting vendor:', error);
                throw error;
            }
        });
    };

    return {
        vendors,
        fetchVendors,
        approveVendor,
        rejectVendor
    };
};