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
        APPROVE: '/vendors/approve',
        REJECT: '/vendors/reject',
    }
} as const;