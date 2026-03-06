/**
 * Environment Configuration
 * 
 * Supports multiple environments: production, staging, and development
 * Update the ENVIRONMENT variable to switch between them.
 */

export type Environment = 'production' | 'staging' | 'development';

// Active environment - change this to switch environments
const ENVIRONMENT: Environment = 'production'; // production | staging | development

const environments = {
  production: {
    BACKEND_BASE_URL: 'https://api.partners.wealthcret.com',
    API_TIMEOUT: 30000, // 30 seconds
    ENABLE_LOGGING: false,
    CACHE_ENABLED: true,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    FEATURE_FLAGS: {
      enableOfflineMode: false,
      enableAnalytics: true,
      enableCrashReporting: true,
      enablePerformanceMonitoring: true,
    },
  },
  staging: {
    BACKEND_BASE_URL: 'https://api-staging.partners.wealthcret.com',
    API_TIMEOUT: 30000,
    ENABLE_LOGGING: true,
    CACHE_ENABLED: true,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    FEATURE_FLAGS: {
      enableOfflineMode: true,
      enableAnalytics: true,
      enableCrashReporting: true,
      enablePerformanceMonitoring: true,
    },
  },
  development: {
    BACKEND_BASE_URL: 'http://localhost:8282', // Change to your local IP if needed
    API_TIMEOUT: 60000,
    ENABLE_LOGGING: true,
    CACHE_ENABLED: false,
    RETRY_ATTEMPTS: 1,
    RETRY_DELAY: 500,
    FEATURE_FLAGS: {
      enableOfflineMode: true,
      enableAnalytics: false,
      enableCrashReporting: false,
      enablePerformanceMonitoring: false,
    },
  },
};

// Get current environment config
const currentConfig = environments[ENVIRONMENT];

export const {
  BACKEND_BASE_URL,
  API_TIMEOUT,
  ENABLE_LOGGING,
  CACHE_ENABLED,
  RETRY_ATTEMPTS,
  RETRY_DELAY,
  FEATURE_FLAGS,
} = currentConfig;

export const ENV = ENVIRONMENT;

// Debug helper to show current config
export const getEnvironmentInfo = () => ({
  environment: ENVIRONMENT,
  baseUrl: BACKEND_BASE_URL,
  logging: ENABLE_LOGGING,
  caching: CACHE_ENABLED,
  features: FEATURE_FLAGS,
});
