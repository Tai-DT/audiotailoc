'use client';

import React from 'react';
import { usePolicy } from '@/lib/hooks/use-policies';
import { PremiumPolicyPage } from '@/components/shared/premium-policy-page';

export default function TermsPage() {
 const { data: policy, isLoading, error } = usePolicy('terms');

 return (
 <PremiumPolicyPage
 data={policy}
 isLoading={isLoading}
 error={error}
 fallbackTitle="Điều khoản sử dụng"
 />
 );
}
