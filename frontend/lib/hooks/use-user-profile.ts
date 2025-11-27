import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { toast } from 'react-hot-toast';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'USER' | 'ADMIN' | 'MANAGER' | 'DISABLED';
  createdAt: string;
  updatedAt?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Get current user profile
export function useUserProfile() {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await apiClient.get<UserProfile>('/users/profile');
      return response.data;
    },
    retry: 1,
    staleTime: 60000, // 1 minute
  });
}

// Update user profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      // Get current user to get their ID
      const profileData = queryClient.getQueryData<UserProfile>(['userProfile']);
      if (!profileData?.id) {
        throw new Error('User not found');
      }

      const response = await apiClient.put(`/users/${profileData.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch profile
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } } | undefined;
      const message = err?.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    },
  });
}

// Change password
export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const response = await apiClient.put('/auth/change-password', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } } | undefined;
      const message = err?.response?.data?.message || 'Failed to change password';
      toast.error(message);
    },
  });
}

// Export user data (GDPR compliance)
export function useExportUserData() {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.get('/users/export-data', {
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `user-data-${new Date().toISOString()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return response.data;
    },
    onSuccess: () => {
      toast.success('User data exported successfully!');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } } | undefined;
      const message = err?.response?.data?.message || 'Failed to export user data';
      toast.error(message);
    },
  });
}

// Delete user account
export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (password: string) => {
      // Get current user to get their ID
      const profileData = queryClient.getQueryData<UserProfile>(['userProfile']);
      if (!profileData?.id) {
        throw new Error('User not found');
      }

      const response = await apiClient.delete(`/users/${profileData.id}`, {
        data: { password }, // Send password for confirmation
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Account deleted successfully');

      // Clear all queries and redirect to home
      queryClient.clear();

      // Clear auth storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } } | undefined;
      const message = err?.response?.data?.message || 'Failed to delete account';
      toast.error(message);
    },
  });
}

// Get user bookings history
export function useUserBookings() {
  return useQuery({
    queryKey: ['userBookings'],
    queryFn: async () => {
      const response = await apiClient.get('/booking/my-bookings');
      return response.data;
    },
    retry: 1,
  });
}

// Get user payments history
export function useUserPayments() {
  return useQuery({
    queryKey: ['userPayments'],
    queryFn: async () => {
      const response = await apiClient.get('/payments/my-payments');
      return response.data;
    },
    retry: 1,
  });
}
