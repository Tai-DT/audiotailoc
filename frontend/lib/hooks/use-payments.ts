import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { authStorage } from '@/lib/auth-storage';

export interface PaymentRecord {
    id: string;
    orderId: string;
    orderNo: string;
    description: string;
    amount: number;
    provider: string;
    status: 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED';
    transactionId?: string;
    createdAt: string;
    updatedAt: string;
}

export function useMyPayments() {
    const token = typeof window !== 'undefined' ? authStorage.getAccessToken() : null;
    const user = typeof window !== 'undefined' ? authStorage.getUser() : null;
    const enabled = Boolean(token && token.trim().length > 0 && token !== 'null' && user);

    return useQuery({
        queryKey: ['my-payments'],
        queryFn: async (): Promise<PaymentRecord[]> => {
            const response = await apiClient.get('/payments/my-payments');
            return response.data;
        },
        enabled,
    });
}
