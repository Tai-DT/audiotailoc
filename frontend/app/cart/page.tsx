'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Check, ShieldCheck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/components/providers/cart-provider';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { BlurFade } from '@/components/ui/blur-fade';
import { formatCurrency } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shippingFee = totalPrice > 500000 ? 0 : 30000;
  const finalTotal = totalPrice + shippingFee;

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <BlurFade delay={0.1} inView>
          <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6 animate-in zoom-in-50 duration-500">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
        </BlurFade>
        <BlurFade delay={0.2} inView>
          <h1 className="text-2xl font-bold mb-3 text-center">Giỏ hàng của bạn đang trống</h1>
          <p className="text-muted-foreground mb-8 text-center max-w-md mx-auto">
            Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.
            Hãy khám phá các sản phẩm chất lượng của chúng tôi ngay hôm nay!
          </p>
          <div className="flex justify-center">
            <Link href="/products">
              <RainbowButton className="px-8">
                Tiếp tục mua sắm
              </RainbowButton>
            </Link>
          </div>
        </BlurFade>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-10 md:py-16">
        <BlurFade delay={0.1} inView>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Giỏ hàng</h1>
              <p className="text-muted-foreground mt-1">
                Bạn có <span className="font-medium text-foreground">{items.length} sản phẩm</span> trong giỏ hàng
              </p>
            </div>

            <Link href="/products">
              <Button variant="outline" size="sm" className="hidden md:flex">
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-8">
            <BlurFade delay={0.2} inView>
              <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
                {/* Header (Desktop only) */}
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b bg-muted/40 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <div className="col-span-6">Sản phẩm</div>
                  <div className="col-span-3 text-center">Số lượng</div>
                  <div className="col-span-3 text-right">Thành tiền</div>
                </div>

                {/* Items */}
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.id} className="group p-4 md:p-6 transition-colors hover:bg-muted/20 bg-card">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center">
                        {/* Product Info */}
                        <div className="col-span-12 md:col-span-6 flex gap-4">
                          <Link href={`/products/${item.id}`} className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border bg-background flex-shrink-0 group-hover:border-primary/50 transition-colors">
                            <Image
                              src={item.image || '/placeholder-product.jpg'}
                              alt={item.name}
                              fill
                              className="object-contain p-1"
                            />
                          </Link>
                          <div className="flex flex-col justify-between py-1">
                            <div>
                              <Link href={`/products/${item.id}`} className="font-semibold text-base line-clamp-2 hover:text-primary transition-colors">
                                {item.name}
                              </Link>
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.category || 'Sản phẩm'}
                              </p>
                            </div>
                            <div className="md:hidden mt-2 font-medium text-primary">
                              {formatCurrency(item.price)}
                            </div>
                          </div>
                        </div>

                        {/* Quantity & Actions (Mobile: combined, Desktop: separate columns) */}
                        <div className="col-span-6 md:col-span-3 flex items-center md:justify-center">
                          <div className="flex items-center border rounded-lg bg-background">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none rounded-l-lg hover:bg-muted"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <div className="w-10 text-center text-sm font-medium border-x h-8 flex items-center justify-center">
                              {item.quantity}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none rounded-r-lg hover:bg-muted"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full ml-3 md:hidden"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Total & Desktop Delete */}
                        <div className="col-span-6 md:col-span-3 flex items-center justify-end gap-4">
                          <div className="text-right">
                            <div className="font-bold text-primary text-lg">
                              {formatCurrency(item.price * item.quantity)}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {formatCurrency(item.price)} / sp
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full hidden md:flex transition-colors"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </BlurFade>

            {/* Additional Info / Coupon Input could go here */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <BlurFade delay={0.3} inView>
                <div className="bg-card p-4 rounded-lg border border-border/50 shadow-sm">
                  <div className="flex gap-3">
                    <div className="mt-1">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Chính sách bảo hành</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tất cả sản phẩm tại Audio Tại Lộc đều được bảo hành chính hãng từ 12-24 tháng. Hỗ trợ kỹ thuật trọn đời.
                      </p>
                    </div>
                  </div>
                </div>
              </BlurFade>
              <BlurFade delay={0.4} inView>
                <div className="bg-card p-4 rounded-lg border border-border/50 shadow-sm">
                  <div className="flex gap-3">
                    <div className="mt-1">
                      <RefreshCw className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Đổi trả dễ dàng</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Hỗ trợ đổi mới trong vòng 30 ngày nếu có lỗi từ nhà sản xuất. Thủ tục nhanh gọn.
                      </p>
                    </div>
                  </div>
                </div>
              </BlurFade>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <BlurFade delay={0.3} inView>
              <div className="sticky top-24 space-y-4">
                <Card className="p-6 md:p-8 shadow-sm border overflow-hidden relative bg-card">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/80" />

                  <h2 className="text-xl font-bold mb-6">Tổng đơn hàng</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span className="font-medium">{formatCurrency(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Phí vận chuyển</span>
                      <span className="font-medium">
                        {shippingFee === 0 ? (
                          <span className="text-success flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5" /> Miễn phí
                          </span>
                        ) : (
                          formatCurrency(shippingFee)
                        )}
                      </span>
                    </div>

                    {shippingFee === 0 && (
                      <div className="bg-primary/5 text-primary text-xs px-3 py-2 rounded-md flex items-start gap-2 border border-primary/10">
                        <Check className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                        <span>Đơn hàng của bạn được miễn phí vận chuyển</span>
                      </div>
                    )}

                    <Separator className="my-2" />

                    <div className="flex justify-between items-baseline">
                      <span className="text-base font-semibold">Tổng cộng</span>
                      <span className="text-2xl font-bold text-primary">{formatCurrency(finalTotal)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-right">(Đã bao gồm VAT nếu có)</p>
                  </div>

                  <div className="space-y-3">
                    <Link href="/checkout" className="block w-full">
                      <RainbowButton className="w-full justify-center font-bold text-base py-6 shadow-lg shadow-primary/20">
                        Tiến hành thanh toán <ArrowRight className="ml-2 h-4 w-4" />
                      </RainbowButton>
                    </Link>

                    <Link href="/products" className="block w-full md:hidden">
                      <Button variant="outline" className="w-full">
                        Tiếp tục mua sắm
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-8 pt-6 border-t space-y-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <ShieldCheck className="w-4 h-4 text-primary/70" />
                      <span>Bảo mật thanh toán 100%</span>
                    </div>

                  </div>
                </Card>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </div>
  );
}
