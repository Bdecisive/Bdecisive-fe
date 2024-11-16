export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        PROFILE: '/auth/profile'
    },
    REGISTRATION: {
        VENDOR: '/vendors/create',
        INFLUENCER: '/influencers/create',
        FOLLOWER: '/followers/create'
    },
} as const;