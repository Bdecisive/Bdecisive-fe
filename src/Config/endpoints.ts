import { API_URL } from ".";

export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        PROFILE: '/auth/profile',
        ACCOUNT_VERIFY: '/auth/verify',
        RESEND_VERIFICATION_CODE: '/auth/resend'

    },
    REGISTRATION: {
        VENDOR: '/vendors/create',
        INFLUENCER: '/influencers/create',
        FOLLOWER: '/followers/create',
    },
    VENDOR: {
        LIST: '/vendors/',
        APPROVE: (vendorId: string) => `/vendors/${vendorId}/approve`,
        REJECT: (vendorId: string) => `/vendors/${vendorId}/reject`,
    },
    CATEGORY: {
        LIST: '/categories/',
        GLOBAL_LIST: '/categories/global',
        CREATE: '/categories/create',
        APPROVE: (categoryId: string) => `/categories/${categoryId}/approve`,
        REJECT: (categoryId: string) => `/categories/${categoryId}/reject`,
    },
    PRODUCT: {
        CREATE: '/products/create',
        VENDOR_LIST: (userId: string) => `/products/${userId}/vendor`,
        UPDATE: (productId: string) => `/products/${productId}/update`,
        DELETE: (productId: string) => `/products/${productId}/delete`,
    }
} as const;

// Helper function to build full URL
export const buildUrl = (endpoint: string) => {
    const BASE_URL = API_URL || 'http://localhost:8080/api';
    return `${BASE_URL}${endpoint}`;
};