import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiClient, ApiError } from './client';
import { validateApiResponse } from '@/lib/validation/validator';
import { z } from 'zod';

// Generic GET hook with validation
export function useApiQuery<T>(
  key: string[],
  url: string,
  schema?: z.ZodSchema<T>,
  options?: Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, ApiError>({
    queryKey: key,
    queryFn: async () => {
      const response = await apiClient.get<{data: T}>(url);
      if (schema) {
        return validateApiResponse(schema, response.data.data, url);
      }
      return response.data.data;
    },
    ...options,
  });
}

// Generic POST hook
export function useApiMutation<T, V = unknown>(
  url: string,
  options?: Omit<UseMutationOptions<T, ApiError, V>, 'mutationFn'>
) {
  return useMutation<T, ApiError, V>({
    mutationFn: async (data) => {
      const response = await apiClient.post<{data: T}>(url, data);
      return response.data.data;
    },
    ...options,
  });
}

// Generic PUT hook
export function useApiPut<T, V = unknown>(
  url: string,
  options?: Omit<UseMutationOptions<T, ApiError, V>, 'mutationFn'>
) {
  return useMutation<T, ApiError, V>({
    mutationFn: async (data) => {
      const response = await apiClient.put<{data: T}>(url, data);
      return response.data.data;
    },
    ...options,
  });
}

// Generic DELETE hook
export function useApiDelete<T>(
  url: string,
  options?: Omit<UseMutationOptions<T, ApiError, void>, 'mutationFn'>
) {
  return useMutation<T, ApiError, void>({
    mutationFn: async () => {
      const response = await apiClient.delete<{data: T}>(url);
      return response.data.data;
    },
    ...options,
  });
} 