'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface Promotion {
 id: string;
 code: string;
 name: string;
 type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING' | 'BUY_X_GET_Y';
 value: number;
 maxDiscount?: number;
}

interface ProductPromotionBadgeProps {
 productId: string;
 categoryId?: string;
 price: number; // in cents
}

export function ProductPromotionBadge({ productId, categoryId }: ProductPromotionBadgeProps) {
 const [promotions, setPromotions] = useState<Promotion[]>([]);
 const [loading, setLoading] = useState(false);

 useEffect(() => {
 const fetchPromotions = async () => {
 if (!productId) return;

 setLoading(true);
 try {
 const params = categoryId ? `?categoryId=${categoryId}` : '';
 const response = await apiClient.get(`/promotions/product/${productId}${params}`);

 const promotionsData = response?.data?.data || response?.data || [];

 // Filter active promotions only
 const activePromotions = Array.isArray(promotionsData)
 ? promotionsData.filter((p: Promotion) => p)
 : [];

 setPromotions(activePromotions);
 } catch (error) {
 console.error('Failed to fetch promotions:', error);
 setPromotions([]);
 } finally {
 setLoading(false);
 }
 };

 fetchPromotions();
 }, [productId, categoryId]);

 if (loading || promotions.length === 0) {
 return null;
 }

 // Show only the best promotion (highest discount value)
 const bestPromotion = promotions[0];

 const formatDiscount = () => {
 switch (bestPromotion.type) {
 case 'PERCENTAGE':
 if (bestPromotion.maxDiscount) {
 const maxDiscountFormatted = bestPromotion.maxDiscount.toLocaleString('vi-VN');
 return `-${bestPromotion.value}% (Max ${maxDiscountFormatted}₫)`;
 }
 return `-${bestPromotion.value}%`;

 case 'FIXED_AMOUNT':
 const discountAmount = bestPromotion.value.toLocaleString('vi-VN');
 return `-${discountAmount}₫`;

 case 'FREE_SHIPPING':
 return 'Miễn phí ship';

 case 'BUY_X_GET_Y':
 return `Mua ${bestPromotion.value} tặng 1`;

 default:
 return '';
 }
 };

    return (
    <Badge
        variant="default"
        className="text-[10px] sm:text-xs bg-yellow-400 text-red-600 dark:text-red-500 shadow-sm flex items-center gap-1 font-black"
    >
        <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        {formatDiscount()}
    </Badge>
    );
}
