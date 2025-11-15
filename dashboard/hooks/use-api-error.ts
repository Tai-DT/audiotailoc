import { useCallback } from 'react';
import { ApiError } from '@/lib/api-client';
import { toast } from 'sonner';

export function useApiError() {
  const handleError = useCallback((error: unknown) => {
    // Silent error handling - no console logging

    if (error instanceof Error) {
      const apiError = error as ApiError;
      
      // Handle specific status codes
      if (apiError.status === 401) {
        toast.error('Session Expired', {
          description: 'Your session has expired. Please login again.',
        });
        // Logout will be handled by the global handler
        return;
      }

      if (apiError.status === 403) {
        toast.error('Access Denied', {
          description: 'You do not have permission to perform this action.',
        });
        return;
      }

      if (apiError.status === 404) {
        toast.error('Not Found', {
          description: 'The requested resource was not found.',
        });
        return;
      }

      if (apiError.status === 429) {
        toast.error('Too Many Requests', {
          description: 'Please wait a moment before trying again.',
        });
        return;
      }

      if (apiError.status && apiError.status >= 500) {
        toast.error('Server Error', {
          description: 'Something went wrong. Please try again later.',
        });
        return;
      }

      // Generic error message
      toast.error('Error', {
        description: error.message || 'An unexpected error occurred',
      });
    } else {
      toast.error('Error', {
        description: 'An unexpected error occurred',
      });
    }
  }, []);

  return { handleError };
}
