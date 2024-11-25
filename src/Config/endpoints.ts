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
        CREATE: '/categories/create',
        APPROVE: (categoryId: string) => `/categories/${categoryId}/approve`,
        REJECT: (categoryId: string) => `/categories/${categoryId}/reject`,
    }
} as const;

// Helper function to build full URL
export const buildUrl = (endpoint: string) => {
    const BASE_URL = API_URL || 'http://localhost:8080/api';
    return `${BASE_URL}${endpoint}`;
};