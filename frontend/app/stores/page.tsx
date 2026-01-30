'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    MapPin,
    Phone,
    Clock,
    Navigation,
    Search,
    Star,
    CheckCircle2
} from 'lucide-react';

interface Store {
    id: string;
    name: string;
    address: string;
    phone: string;
    openHours: string;
    mapUrl?: string;
    isMainStore?: boolean;
    services: string[];
}

export default function StoresPage() {
    const [stores, setStores] = useState<Store[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Store data (could be fetched from API in future)
        setStores([
            {
                id: '1',
                name: 'Audio Tài Lộc - Showroom Chính',
                address: '123 Đường Âm Thanh, Quận 1, TP. Hồ Chí Minh',
                phone: '0768 426 262',
                openHours: '8:00 - 21:00 (Thứ 2 - Chủ nhật)',
                mapUrl: 'https://maps.google.com/?q=10.7769,106.7009',
                isMainStore: true,
                services: ['Trưng bày & trải nghiệm', 'Tư vấn chuyên sâu', 'Bảo hành', 'Sửa chữa'],
            },
            {
                id: '2',
                name: 'Audio Tài Lộc - Chi nhánh Quận 7',
                address: '456 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
                phone: '0768 426 263',
                openHours: '9:00 - 20:00 (Thứ 2 - Thứ 7)',
                mapUrl: 'https://maps.google.com/?q=10.7410,106.7218',
                isMainStore: false,
                services: ['Trưng bày & trải nghiệm', 'Tư vấn', 'Bảo hành'],
            },
            {
                id: '3',
                name: 'Audio Tài Lộc - Kho & Xưởng kỹ thuật',
                address: '789 Đường Kỹ Thuật, Quận 12, TP. Hồ Chí Minh',
                phone: '0768 426 264',
                openHours: '8:00 - 17:00 (Thứ 2 - Thứ 6)',
                mapUrl: 'https://maps.google.com/?q=10.8700,106.6530',
                isMainStore: false,
                services: ['Sửa chữa chuyên sâu', 'Lắp đặt', 'Bảo trì'],
            },
        ]);
    }, []);

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-12">
            <div className="container max-w-5xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/30">
                        <MapPin className="w-3 h-3 mr-1" />
                        Hệ Thống Showroom
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
                        Địa Chỉ <span className="text-primary">Cửa Hàng</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Ghé thăm showroom để trải nghiệm trực tiếp các sản phẩm âm thanh cao cấp
                        và nhận tư vấn từ đội ngũ chuyên gia.
                    </p>
                </div>

                {/* Search */}
                <div className="max-w-md mx-auto mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm showroom..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-12 rounded-full"
                        />
                    </div>
                </div>

                {/* Stores List */}
                <div className="space-y-6">
                    {filteredStores.map((store) => (
                        <Card
                            key={store.id}
                            className={`overflow-hidden transition-all hover:shadow-lg ${store.isMainStore ? 'border-primary/50 bg-gradient-to-r from-primary/5 to-transparent' : ''
                                }`}
                        >
                            {store.isMainStore && (
                                <div className="bg-primary text-white text-center py-2 text-sm font-semibold flex items-center justify-center gap-2">
                                    <Star className="w-4 h-4" />
                                    Showroom Chính
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="flex items-start justify-between gap-4">
                                    <span>{store.name}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                            <p>{store.address}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-primary shrink-0" />
                                            <a href={`tel:${store.phone.replace(/\s/g, '')}`} className="font-semibold hover:text-primary">
                                                {store.phone}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-primary shrink-0" />
                                            <p>{store.openHours}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">Dịch vụ:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {store.services.map((service, i) => (
                                                <Badge key={i} variant="secondary" className="flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    {service}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t">
                                    <Button asChild className="flex-1">
                                        <a href={`tel:${store.phone.replace(/\s/g, '')}`}>
                                            <Phone className="w-4 h-4 mr-2" />
                                            Gọi ngay
                                        </a>
                                    </Button>
                                    {store.mapUrl && (
                                        <Button asChild variant="outline" className="flex-1">
                                            <a href={store.mapUrl} target="_blank" rel="noopener noreferrer">
                                                <Navigation className="w-4 h-4 mr-2" />
                                                Chỉ đường
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* CTA */}
                <Card className="mt-12 bg-primary/5 border-primary/20">
                    <CardContent className="py-8 text-center">
                        <h3 className="text-2xl font-bold mb-4">Không thể đến showroom?</h3>
                        <p className="text-muted-foreground mb-6">
                            Liên hệ để được tư vấn trực tuyến hoặc đặt lịch hẹn tại nhà
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button asChild size="lg">
                                <Link href="/contact">Liên hệ ngay</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <Link href="/service-booking">Đặt lịch kỹ thuật</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
