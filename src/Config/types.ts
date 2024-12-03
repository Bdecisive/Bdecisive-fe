import { ENDPOINTS } from "./endpoints";

// config/types.ts
export interface ApiEndpoints {
    AUTH: {
      LOGIN: string;
      REGISTER: string;
      LOGOUT: string;
      PROFILE: string;
    };
    // Add other endpoint groups
  }
  
  export interface Config {
    API_URL: string;
    ENDPOINTS: typeof ENDPOINTS;
    // Add other config types
  }