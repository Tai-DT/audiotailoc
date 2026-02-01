'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Building2, ArrowRight, Package } from 'lucide-react';
import { apiClient, handleApiResponse } from '@/lib/api';

interface Brand {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
    description?: string;
    country?: string;
    productCount?: number;
}

export default function BrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await apiClient.get('/catalog/brands');
                const data = handleApiResponse<Brand[]>(response);
                if (data) {
                    setBrands(data);
                    setFilteredBrands(data);
                }
            } catch {
                // Use sample brands if API not available
                const sampleBrands: Brand[] = [
                    { id: '1', name: 'JBL', slug: 'jbl', country: 'Mỹ', productCount: 25 },
                    { id: '2', name: 'Bose', slug: 'bose', country: 'Mỹ', productCount: 18 },
                    { id: '3', name: 'Harman Kardon', slug: 'harman-kardon', country: 'Mỹ', productCount: 12 },
                    { id: '4', name: 'Denon', slug: 'denon', country: 'Nhật Bản', productCount: 20 },
                    { id: '5', name: 'Yamaha', slug: 'yamaha', country: 'Nhật Bản', productCount: 30 },
                    { id: '6', name: 'Pioneer', slug: 'pioneer', country: 'Nhật Bản', productCount: 15 },
                    { id: '7', name: 'Marshall', slug: 'marshall', country: 'Anh', productCount: 10 },
                    { id: '8', name: 'Bang & Olufsen', slug: 'bang-olufsen', country: 'Đan Mạch', productCount: 8 },
                    { id: '9', name: 'Shure', slug: 'shure', country: 'Mỹ', productCount: 22 },
                    { id: '10', name: 'Sennheiser', slug: 'sennheiser', country: 'Đức', productCount: 16 },
                    { id: '11', name: 'Audio-Technica', slug: 'audio-technica', country: 'Nhật Bản', productCount: 14 },
                    { id: '12', name: 'Klipsch', slug: 'klipsch', country: 'Mỹ', productCount: 11 },
                ];
                setBrands(sampleBrands);
                setFilteredBrands(sampleBrands);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBrands();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = brands.filter(brand =>
                brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                brand.country?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredBrands(filtered);
        } else {
            setFilteredBrands(brands);
        }
    }, [searchQuery, brands]);

    // Group brands by country
    const brandsByCountry = filteredBrands.reduce((acc, brand) => {
        const country = brand.country || 'Khác';
        if (!acc[country]) acc[country] = [];
        acc[country].push(brand);
        return acc;
    }, {} as Record<string, Brand[]>);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-12">
            <div className="container max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/30">
                        <Building2 className="w-3 h-3 mr-1" />
                        Thương Hiệu
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
                        Thương Hiệu <span className="text-primary">Đối Tác</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Audio Tài Lộc phân phối chính hãng các thương hiệu âm thanh hàng đầu thế giới.
                        Cam kết 100% sản phẩm chính hãng, bảo hành toàn quốc.
                    </p>
                </div>

                {/* Search */}
                <div className="max-w-md mx-auto mb-12">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Tìm thương hiệu..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-12 rounded-full"
                        />
                    </div>
                </div>

                {/* Brands Grid by Country */}
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="aspect-square bg-card animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-12">
                        {Object.entries(brandsByCountry).map(([country, countryBrands]) => (
                            <section key={country}>
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="w-8 h-0.5 bg-primary" />
                                    {country}
                                    <Badge variant="secondary" className="ml-2">{countryBrands.length}</Badge>
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {countryBrands.map((brand) => (
                                        <Link key={brand.id} href={`/products?brand=${brand.slug}`}>
                                            <Card className="group hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
                                                <CardContent className="p-6 flex flex-col items-center justify-center aspect-square">
                                                    {brand.logoUrl ? (
                                                        <Image
                                                            src={brand.logoUrl}
                                                            alt={brand.name}
                                                            width={80}
                                                            height={80}
                                                            className="object-contain mb-4 group-hover:scale-110 transition-transform"
                                                        />
                                                    ) : (
                                                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                                            <span className="text-2xl font-black text-primary">
                                                                {brand.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <h3 className="font-bold text-center group-hover:text-primary transition-colors">
                                                        {brand.name}
                                                    </h3>
                                                    {brand.productCount && (
                                                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                            <Package className="w-3 h-3" />
                                                            {brand.productCount} sản phẩm
                                                        </p>
                                                    )}
                                                    <ArrowRight className="w-4 h-4 mt-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}

                {/* No Results */}
                {!isLoading && filteredBrands.length === 0 && (
                    <div className="text-center py-16">
                        <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-bold mb-2">Không tìm thấy thương hiệu</h3>
                        <p className="text-muted-foreground">
                            Thử tìm kiếm với từ khóa khác
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
