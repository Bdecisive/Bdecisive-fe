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
        APPROVE: (vendorId: number) => `/vendors/${vendorId}/approve`,
        REJECT: (vendorId: number) => `/vendors/${vendorId}/reject`,
    },
    CATEGORY: {
        LIST: '/categories/',
        GLOBAL_LIST: '/categories/global',
        CREATE: '/categories/create',
        APPROVE: (categoryId: number) => `/categories/${categoryId}/approve`,
        REJECT: (categoryId: number) => `/categories/${categoryId}/reject`,
    },
    PRODUCT: {
        CREATE: '/products/create',
        VENDOR_LIST: (userId: number) => `/products/vendor/${userId}`,
        CATEGORY_LIST: (categoryId: number) => `/products/category/${categoryId}`,
        UPDATE: (productId: number) => `/products/${productId}/update`,
        DELETE: (productId: number) => `/products/${productId}/delete`,
    },
    REVIEW: {
        LIST: '/reviews/',
        CREATE: '/reviews/create',
        PRODUCT_LIST: (productId: number) => `/reviews/product/${productId}`,
        CATEGORY_LIST: (categoryId: number) => `/reviews/category/${categoryId}`,
        USER_LIST: (userId: number) => `/reviews/user/${userId}`,
        UPDATE: (reviewId: number) => `/reviews/${reviewId}/update`,
        DELETE: (reviewId: number) => `/reviews/${reviewId}/delete`,
        GET_REVIEW: (reviewId: number) => `/reviews/${reviewId}`,
        LIKE: (reviewId: number) => `/reviews/${reviewId}/like`,
        UNLIKE: (reviewId: number) => `/reviews/${reviewId}/unlike`,
    },
    PROFILE: {
        GET: "/users/profile",
        UPDATE: "/users/profile/update",
    }
} as const;

// Helper function to build full URL
export const buildUrl = (endpoint: string) => {
    const BASE_URL = API_URL || 'http://localhost:8080/api';
    return `${BASE_URL}${endpoint}`;
};