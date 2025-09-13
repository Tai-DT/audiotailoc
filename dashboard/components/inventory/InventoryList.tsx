"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type Product = {
  id: string;
  name: string;
  slug?: string;
  sku?: string | null;
  categoryId?: string | null;
  stockQuantity: number;
  priceCents?: number;
};

type OrderItem = { productId: string | null; quantity: number };

type Order = {
  id: string;
  status: string;
  items: OrderItem[];
};

type ProductsResponse = {
  items?: Product[];
  data?: { items?: Product[] };
};

type OrdersResponse = {
  items?: Order[];
  data?: { items?: Order[] };
};

export default function InventoryList() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [reservedByProduct, setReservedByProduct] = useState<Record<string, number>>({});

  const fetchProducts = useCallback(async () => {
    try {
      const res = await apiClient.getProducts({ limit: 100 });
      const raw: ProductsResponse = res as ProductsResponse;
      const items: Product[] = raw?.items || raw?.data?.items || [];
      const mapped: Product[] = items.map((p: Product) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        sku: p.sku ?? null,
        categoryId: p.categoryId ?? null,
        stockQuantity: p.stockQuantity ?? 0,
        priceCents: p.priceCents,
      }));
      setProducts(mapped);
    } catch (e) {
      console.error("InventoryList: failed to fetch products", e);
    }
  }, []);

  const fetchReserved = useCallback(async () => {
    try {
      // Sum quantities for PENDING and PROCESSING orders (first 100 results)
      const [p1, p2] = await Promise.all([
        apiClient.getOrders({ page: 1, limit: 100, status: "PENDING" }),
        apiClient.getOrders({ page: 1, limit: 100, status: "PROCESSING" }),
      ]);
      const r1: OrdersResponse = p1 as OrdersResponse;
      const r2: OrdersResponse = p2 as OrdersResponse;
      const orders: Order[] = [
        ...(r1?.items || r1?.data?.items || []),
        ...(r2?.items || r2?.data?.items || []),
      ];
      const map: Record<string, number> = {};
      for (const o of orders) {
        for (const it of (o.items || [])) {
          if (it.productId) {
            map[it.productId] = (map[it.productId] || 0) + (it.quantity || 0);
          }
        }
      }
      setReservedByProduct(map);
    } catch (e) {
      console.error("InventoryList: failed to fetch reserved quantities", e);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchReserved()]);
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [fetchProducts, fetchReserved]);

  const rows = useMemo(() => {
    return products.map((p) => {
      const reserved = reservedByProduct[p.id] || 0;
      const available = Math.max(0, (p.stockQuantity || 0) - reserved);
      let status: "in" | "low" | "out" = "in";
      if (p.stockQuantity <= 0 || available <= 0) status = "out";
      else if (available <= 5) status = "low";
      return { ...p, reserved, available, status };
    });
  }, [products, reservedByProduct]);

  const StatusBadge = ({ status }: { status: "in" | "low" | "out" }) => {
    if (status === "in") return <Badge variant="secondary">Còn hàng</Badge>;
    if (status === "low") return <Badge variant="outline">Sắp hết</Badge>;
    return <Badge variant="destructive">Hết hàng</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách tồn kho</CardTitle>
        <CardDescription>{products.length} sản phẩm</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-center">Tồn kho</TableHead>
                <TableHead className="text-center">Đã đặt</TableHead>
                <TableHead className="text-center">Khả dụng</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-4 w-10 mx-auto" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-4 w-10 mx-auto" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-4 w-10 mx-auto" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                  </TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Không có sản phẩm
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                          {/* Placeholder icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package h-5 w-5 text-gray-500"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M16.5 9.4 7.55 4.24"/><path d="M3.29 7L12 12l8.71-5"/><path d="M12 22V12"/></svg>
                        </div>
                        <div>
                          <div className="font-medium">{r.name}</div>
                          <div className="text-xs text-muted-foreground">{r.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{r.sku || '-'}</TableCell>
                    <TableCell className="text-center font-medium">{r.stockQuantity}</TableCell>
                    <TableCell className="text-center text-orange-600">{r.reserved}</TableCell>
                    <TableCell className="text-center font-semibold">{r.available}</TableCell>
                    <TableCell className="text-center"><StatusBadge status={r.status} /></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
