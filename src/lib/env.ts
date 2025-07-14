import { logger } from './logger';

interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_API_URL: string;
}

function validateEnv(): EnvConfig {
  const requiredEnvVars = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  };

  // Check for missing required environment variables
  const missing = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    const error = `Missing required environment variables: ${missing.join(', ')}`;
    logger.error(error);
    throw new Error(error);
  }

  // Validate NODE_ENV
  const validNodeEnvs = ['development', 'production', 'test'];
  if (!validNodeEnvs.includes(requiredEnvVars.NODE_ENV!)) {
    const error = `Invalid NODE_ENV: ${requiredEnvVars.NODE_ENV}. Must be one of: ${validNodeEnvs.join(', ')}`;
    logger.error(error);
    throw new Error(error);
  }

  // Validate API URL format
  try {
    new URL(requiredEnvVars.NEXT_PUBLIC_API_URL!);
  } catch {
    const error = `Invalid NEXT_PUBLIC_API_URL format: ${requiredEnvVars.NEXT_PUBLIC_API_URL}`;
    logger.error(error);
    throw new Error(error);
  }

  logger.info('Environment validation successful');
  logger.debug('Environment config:', {
    NODE_ENV: requiredEnvVars.NODE_ENV,
    NEXT_PUBLIC_API_URL: requiredEnvVars.NEXT_PUBLIC_API_URL,
  });

  return {
    NODE_ENV: requiredEnvVars.NODE_ENV as 'development' | 'production' | 'test',
    NEXT_PUBLIC_API_URL: requiredEnvVars.NEXT_PUBLIC_API_URL!,
  };
}

export const env = validateEnv();

// Utility functions
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';