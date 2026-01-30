'use client';

import React from 'react';
import { usePolicy } from '@/lib/hooks/use-policies';
import { PremiumPolicyPage } from '@/components/shared/premium-policy-page';

export default function ShippingPolicyPage() {
 const { data: policy, isLoading, error } = usePolicy('shipping-policy');

 return (
 <PremiumPolicyPage
 data={policy}
 isLoading={isLoading}
 error={error}
 fallbackTitle="Chính sách vận chuyển"
 />
 );
}