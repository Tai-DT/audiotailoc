'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Minus, X, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  inventory?: {
    stock: number;
  };
  stockQuantity?: number;
};

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  availableStock: number;
};

export function OrderForm() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products?limit=100');
        if (!response.ok) throw new Error('Failed to fetch products');

        interface ProductsApiResponse {
          products: Array<{
            id: string;
            name: string;
            price: number;
            stockQuantity?: number;
            inventory?: {
              stock: number;
            };
          }>;
        }

        const data: ProductsApiResponse = await response.json();
        // Map API response to component state
        const mappedProducts: Product[] = data.products.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          stock: p.inventory?.stock ?? p.stockQuantity ?? 0,
          inventory: p.inventory,
          stockQuantity: p.stockQuantity
        }));
        
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách sản phẩm',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToOrder = (product: Product) => {
    setOrderItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      
      return [
        ...prevItems,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          availableStock: product.stock
        }
      ];
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setOrderItems(prevItems => 
      prevItems.map(item => {
        if (item.productId === productId) {
          return { 
            ...item, 
            quantity: Math.min(newQuantity, item.availableStock) 
          };
        }
        return item;
      })
    );
  };

  const removeItem = (productId: string) => {
    setOrderItems(prevItems => 
      prevItems.filter(item => item.productId !== productId)
    );
  };

  const calculateTotal = () => {
    return orderItems.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }
      
      toast({
        title: 'Thành công',
        description: 'Đơn hàng đã được tạo thành công',
      });
      
      // Reset form
      setOrderItems([]);
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể tạo đơn hàng',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Product Selection */}
      <div className="md:col-span-2 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <p>Đang tải sản phẩm...</p>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <Card 
                key={product.id} 
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => addToOrder(product)}
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(product.price)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Còn: {product.stock}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>Không tìm thấy sản phẩm nào.</p>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            {orderItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Chưa có sản phẩm nào
              </p>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  {orderItems.map(item => (
                    <div key={item.productId} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(item.price)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.productId, item.quantity - 1);
                          }}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <Input
                          type="number"
                          min={1}
                          max={item.availableStock}
                          value={item.quantity}
                          onChange={(e) => 
                            updateQuantity(item.productId, parseInt(e.target.value) || 1)
                          }
                          className="w-16 text-center"
                        />
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.productId, item.quantity + 1);
                          }}
                          disabled={item.quantity >= item.availableStock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeItem(item.productId);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Tổng cộng:</span>
                    <span>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(calculateTotal())}
                    </span>
                  </div>
                  
                  <Button 
                    className="w-full mt-4"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={orderItems.length === 0}
                  >
                    Xác nhận đơn hàng
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
