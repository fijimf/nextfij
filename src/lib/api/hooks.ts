import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiClient, ApiResponse, ApiError } from './client';

// Generic GET hook
export function useApiQuery<T>(
  key: string[],
  url: string,
  options?: Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, ApiError>({
    queryKey: key,
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<T>>(url);
      return response.data;
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
      const response = await apiClient.post<ApiResponse<T>>(url, data);
      return response.data;
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
      const response = await apiClient.put<ApiResponse<T>>(url, data);
      return response.data;
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
      const response = await apiClient.delete<ApiResponse<T>>(url);
      return response.data;
    },
    ...options,
  });
} 