import { ENDPOINTS } from "./endpoints";
import { Config } from "./types";

const ENV = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test'
  } as const;
  
  type ENV_TYPE = typeof ENV[keyof typeof ENV];
  
  const getCurrentEnv = (): ENV_TYPE => {
    const env = process.env.NODE_ENV as ENV_TYPE;
    if (!env || !Object.values(ENV).includes(env)) {
      return ENV.DEVELOPMENT; // Default to development
    }
    return env;
  };
  
  const configs = {
    [ENV.DEVELOPMENT]: {
      API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
      ENDPOINTS,
    },
    [ENV.PRODUCTION]: {
      API_URL: process.env.REACT_APP_API_URL || 'https://your-production-api.com/api',
      ENDPOINTS,
    },
    [ENV.TEST]: {
      API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
      ENDPOINTS,
    }
  } as const;
  
  const getConfig = (): Config => {
    const env = getCurrentEnv();
    const envConfig = configs[env];
    
    if (!envConfig) {
      throw new Error(`Configuration not found for environment: ${env}`);
    }
  
    console.log(`Current environment: ${env}`);
    return envConfig;
  };
  
  const config = getConfig();
  
  export const { API_URL } = config;
  export const getApiUrl = (endpoint: string): string => `${API_URL}${endpoint}`;
  export default config;