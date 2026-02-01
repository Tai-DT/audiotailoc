'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    ArrowLeftRight,
    Plus,
    X,
    Search,
    Sparkles
} from 'lucide-react';
import { apiClient, handleApiResponse } from '@/lib/api';

interface Product {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string;
    priceCents: number;
    specs: Record<string, string>;
    rating?: number;
    category?: string;
}

const specLabels: Record<string, string> = {
    power: 'Công suất',
    frequency: 'Tần số đáp ứng',
    impedance: 'Trở kháng',
    sensitivity: 'Độ nhạy',
    dimensions: 'Kích thước',
    weight: 'Trọng lượng',
    connectivity: 'Kết nối',
    warranty: 'Bảo hành',
};

export default function ComparePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [activeSlot, setActiveSlot] = useState<number | null>(null);

    const maxProducts = 4;

    const searchProducts = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await apiClient.get('/catalog/products', {
                params: { q: query, limit: 5 }
            });
            const data = handleApiResponse<{ items: Product[] }>(response);
            if (data?.items) {
                setSearchResults(data.items.filter((p: Product) => !products.find((ep: Product) => ep.id === p.id)));
            }
        } catch {
            // Sample data for demo
            setSearchResults([
                {
                    id: '1',
                    name: 'Loa JBL PartyBox 310',
                    slug: 'loa-jbl-partybox-310',
                    priceCents: 1290000000,
                    specs: {
                        power: '240W',
                        frequency: '45Hz - 20kHz',
                        connectivity: 'Bluetooth 5.1, AUX, USB',
                        warranty: '12 tháng',
                    },
                    rating: 4.8,
                    category: 'Loa',
                },
                {
                    id: '2',
                    name: 'Loa Bose S1 Pro+',
                    slug: 'loa-bose-s1-pro-plus',
                    priceCents: 1150000000,
                    specs: {
                        power: '480W Peak',
                        frequency: '48Hz - 20kHz',
                        connectivity: 'Bluetooth, AUX, XLR',
                        warranty: '24 tháng',
                    },
                    rating: 4.9,
                    category: 'Loa',
                },
            ]);
        } finally {
            setIsSearching(false);
        }
    };

    const addProduct = (product: Product, slotIndex: number) => {
        const newProducts = [...products];
        if (slotIndex < newProducts.length) {
            newProducts[slotIndex] = product;
        } else {
            newProducts.push(product);
        }
        setProducts(newProducts);
        setSearchQuery('');
        setSearchResults([]);
        setActiveSlot(null);
    };

    const removeProduct = (index: number) => {
        setProducts(products.filter((_, i) => i !== index));
    };

    // Get all unique spec keys from compared products
    const allSpecs = Array.from(
        new Set(products.flatMap(p => Object.keys(p.specs || {})))
    );

    const formatPrice = (cents: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cents);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-12">
            <div className="container max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/30">
                        <ArrowLeftRight className="w-3 h-3 mr-1" />
                        So Sánh Sản Phẩm
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
                        So Sánh <span className="text-primary">Sản Phẩm</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Chọn tối đa {maxProducts} sản phẩm để so sánh thông số kỹ thuật và tìm ra lựa chọn phù hợp nhất.
                    </p>
                </div>

                {/* Product Slots */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[...Array(maxProducts)].map((_, index) => {
                        const product = products[index];

                        return (
                            <Card
                                key={index}
                                className={`relative min-h-[200px] transition-all ${product ? 'bg-card' : 'bg-muted/30 border-dashed'
                                    } ${activeSlot === index ? 'ring-2 ring-primary' : ''}`}
                            >
                                {product ? (
                                    <CardContent className="p-4 text-center">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-1 right-1 md:top-2 md:right-2 h-5 w-5 md:h-6 md:w-6"
                                            onClick={() => removeProduct(index)}
                                        >
                                            <X className="w-3 h-3 md:w-4 md:h-4" />
                                        </Button>
                                        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 bg-muted rounded-lg flex items-center justify-center">
                                            {product.imageUrl ? (
                                                <Image
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-contain p-1 md:p-2"
                                                />
                                            ) : (
                                                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-primary font-bold">
                                            {formatPrice(product.priceCents)}
                                        </p>
                                    </CardContent>
                                ) : (
                                    <CardContent
                                        className="p-4 flex flex-col items-center justify-center h-full cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => setActiveSlot(index)}
                                    >
                                        <Plus className="w-8 h-8 text-muted-foreground mb-2" />
                                        <span className="text-sm text-muted-foreground">
                                            Thêm sản phẩm
                                        </span>
                                    </CardContent>
                                )}
                            </Card>
                        );
                    })}
                </div>

                {/* Search Box (when slot is active) */}
                {activeSlot !== null && (
                    <Card className="mb-8 bg-card/80 backdrop-blur">
                        <CardContent className="p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm sản phẩm..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        searchProducts(e.target.value);
                                    }}
                                    className="pl-10"
                                    autoFocus
                                />
                            </div>

                            {isSearching && (
                                <p className="text-sm text-muted-foreground mt-3">Đang tìm kiếm...</p>
                            )}

                            {searchResults.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {searchResults.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                            onClick={() => addProduct(product, activeSlot)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-background rounded flex items-center justify-center">
                                                    <Sparkles className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{product.name}</p>
                                                    <p className="text-sm text-primary">{formatPrice(product.priceCents)}</p>
                                                </div>
                                            </div>
                                            <Plus className="w-5 h-5 text-primary" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Button
                                variant="ghost"
                                size="sm"
                                className="mt-4"
                                onClick={() => {
                                    setActiveSlot(null);
                                    setSearchQuery('');
                                    setSearchResults([]);
                                }}
                            >
                                Hủy
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Comparison Table */}
                {products.length >= 2 && (
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-4 bg-muted/30 min-w-[150px]">
                                            Thông số
                                        </th>
                                        {products.map((product, i) => (
                                            <th key={i} className="text-center p-4 min-w-[200px]">
                                                <Link
                                                    href={`/products/${product.slug}`}
                                                    className="hover:text-primary transition-colors"
                                                >
                                                    {product.name}
                                                </Link>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Price Row */}
                                    <tr className="border-b">
                                        <td className="p-4 font-medium bg-muted/30">Giá</td>
                                        {products.map((product, i) => (
                                            <td key={i} className="p-4 text-center text-primary font-bold">
                                                {formatPrice(product.priceCents)}
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Rating Row */}
                                    <tr className="border-b">
                                        <td className="p-4 font-medium bg-muted/30">Đánh giá</td>
                                        {products.map((product, i) => (
                                            <td key={i} className="p-4 text-center">
                                                {product.rating ? `⭐ ${product.rating}/5` : '-'}
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Spec Rows */}
                                    {allSpecs.map((specKey) => (
                                        <tr key={specKey} className="border-b">
                                            <td className="p-4 font-medium bg-muted/30">
                                                {specLabels[specKey] || specKey}
                                            </td>
                                            {products.map((product, i) => (
                                                <td key={i} className="p-4 text-center">
                                                    {product.specs?.[specKey] || '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {/* Empty State */}
                {products.length < 2 && (
                    <Card className="bg-muted/30 border-dashed">
                        <CardContent className="py-16 text-center">
                            <ArrowLeftRight className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-bold mb-2">Chọn ít nhất 2 sản phẩm</h3>
                            <p className="text-muted-foreground mb-6">
                                Click vào ô trống phía trên để thêm sản phẩm muốn so sánh
                            </p>
                            <Button asChild variant="outline">
                                <Link href="/products">Xem sản phẩm</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
