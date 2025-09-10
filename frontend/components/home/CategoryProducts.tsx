"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api-client";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductItem {
  id: string;
  slug: string;
  name: string;
  priceCents?: number;
  price?: number;
  images?: string[];
  imageUrl?: string | null;
  category?: { id: string; name: string; slug: string };
}

type ProductsMap = Record<string, ProductItem[]>; // key: categoryId

type LoadingMap = Record<string, boolean>;

function formatPriceVND(value: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

export default function CategoryProducts() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<ProductsMap>({});
  const [loadingMap, setLoadingMap] = useState<LoadingMap>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        // 1) Fetch categories
        const catRes = await api.categories.getAll();
        const catList: Category[] = Array.isArray(catRes.data) ? catRes.data : (catRes.data?.items || []);
        if (!mounted) return;
        setCategories(catList);

        // 2) Fetch 4 products for each category in parallel
        const results = await Promise.all(
          catList.map(async (cat) => {
            try {
              setLoadingMap((m) => ({ ...m, [cat.id]: true }));
              const prodRes = await api.products.getAll({ page: 1, pageSize: 4, category: cat.id, sortBy: "createdAt", sortOrder: "desc" });
              const items = Array.isArray(prodRes.data)
                ? prodRes.data
                : prodRes.data?.items || [];
              return { catId: cat.id, items } as { catId: string; items: ProductItem[] };
            } catch {
              return { catId: cat.id, items: [] } as { catId: string; items: ProductItem[] };
            } finally {
              setLoadingMap((m) => ({ ...m, [cat.id]: false }));
            }
          })
        );
        if (!mounted) return;
        const map: ProductsMap = {};
        for (const r of results) map[r.catId] = r.items;
        setProductsByCategory(map);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Không thể tải danh mục và sản phẩm");
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return null; // Hide section if no categories
  }

  return (
    <div className="space-y-12">
      {categories.map((cat) => {
        const items = productsByCategory[cat.id] || [];
        const isLoading = loadingMap[cat.id];
        return (
          <section key={cat.id} className="py-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{cat.name}</h3>
              <Link href={`/products?categoryId=${encodeURIComponent(cat.id)}`}>
                <Button variant="outline">Xem thêm</Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="w-full aspect-square bg-gray-100 animate-pulse" />
                    <CardContent className="p-4">
                      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((p) => {
                  const img = (p.images && p.images[0]) || p.imageUrl || "/images/placeholder-product.jpg";
                  const priceRaw = typeof p.price === "number" ? p.price : (typeof (p as any).priceCents === "number" ? (p as any).priceCents / 100 : 0);
                  const priceText = priceRaw > 0 ? formatPriceVND(priceRaw) : "Liên hệ";
                  return (
                    <Link key={p.id} href={`/products/${p.slug}`}>
                      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                        <div className="relative aspect-square bg-gray-100">
                          <Image src={img} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                          {p.category?.name && (
                            <Badge className="absolute top-2 left-2 bg-blue-600 text-white">{p.category.name}</Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{p.name}</h4>
                          <div className="text-primary-600 font-bold">{priceText}</div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-500">Chưa có sản phẩm trong danh mục này</div>
            )}
          </section>
        );
      })}
    </div>
  );
}
