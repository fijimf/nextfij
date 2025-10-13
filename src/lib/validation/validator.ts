import { z } from 'zod';
import { logger } from '@/lib/logger';

export class ValidationError extends Error {
  constructor(message: string, public issues: z.ZodIssue[]) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Validation error:', error.issues);
      throw new ValidationError('Data validation failed', error.issues);
    }
    throw error;
  }
}

export function validateDataSafely<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: ValidationError } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Validation error:', error.issues);
      return { success: false, error: new ValidationError('Data validation failed', error.issues) };
    }
    return { success: false, error: error as ValidationError };
  }
}

// Helper function to validate API responses
export function validateApiResponse<T>(schema: z.ZodSchema<T>, response: unknown, endpoint: string): T {
  try {
    logger.debug(`Validating response from ${endpoint}`);
    return schema.parse(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Enhanced logging for debugging
      console.error(`API response validation failed for ${endpoint}:`, JSON.stringify(error.issues, null, 2));
      logger.error(`API response validation failed for ${endpoint}:`, error.issues);
      throw new ValidationError(`Invalid response format from ${endpoint}`, error.issues);
    }
    throw error;
  }
}