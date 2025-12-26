import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

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
    return useQuery({
        queryKey: ['my-payments'],
        queryFn: async (): Promise<PaymentRecord[]> => {
            const response = await apiClient.get('/payments/my-payments');
            return response.data;
        },
    });
}
