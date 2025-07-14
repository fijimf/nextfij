import { z } from 'zod';
import { validateData, validateDataSafely, validateApiResponse, ValidationError } from '../validator';

const testSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
});

const validData = {
  name: 'John Doe',
  age: 25,
  email: 'john@example.com',
};

const invalidData = {
  name: 123,
  age: 'twenty-five',
  email: 'invalid-email',
};

describe('validator', () => {
  beforeEach(() => {
    // Suppress console.error for validation tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('validateData', () => {
    it('should validate correct data successfully', () => {
      const result = validateData(testSchema, validData);
      expect(result).toEqual(validData);
    });

    it('should throw ValidationError for invalid data', () => {
      expect(() => validateData(testSchema, invalidData)).toThrow(ValidationError);
    });

    it('should include validation issues in error', () => {
      try {
        validateData(testSchema, invalidData);
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).issues).toBeDefined();
        expect((error as ValidationError).issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe('validateDataSafely', () => {
    it('should return success result for valid data', () => {
      const result = validateDataSafely(testSchema, validData);
      expect(result).toEqual({
        success: true,
        data: validData,
      });
    });

    it('should return error result for invalid data', () => {
      const result = validateDataSafely(testSchema, invalidData);
      expect(result).toEqual({
        success: false,
        error: expect.any(ValidationError),
      });
    });
  });

  describe('validateApiResponse', () => {
    it('should validate API response successfully', () => {
      const result = validateApiResponse(testSchema, validData, '/api/test');
      expect(result).toEqual(validData);
    });

    it('should throw ValidationError for invalid API response', () => {
      expect(() => validateApiResponse(testSchema, invalidData, '/api/test')).toThrow(ValidationError);
    });

    it('should include endpoint in error message', () => {
      try {
        validateApiResponse(testSchema, invalidData, '/api/test');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).message).toContain('/api/test');
      }
    });
  });
});