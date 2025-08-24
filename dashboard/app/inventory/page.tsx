"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Package, AlertTriangle, Search, Plus, Edit, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  stockQuantity: number;
  availableQuantity: number;
  minStockLevel: number;
  sellingPrice: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      // Mock data for now
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Loa Bluetooth JBL GO 2',
          sku: 'JBL-GO2-BLK',
          stockQuantity: 45,
          availableQuantity: 40,
          minStockLevel: 10,
          sellingPrice: 1200000,
          status: 'in_stock'
        },
        {
          id: '2',
          name: 'Tai nghe Sony WH-1000XM4',
          sku: 'SONY-WH1000XM4',
          stockQuantity: 8,
          availableQuantity: 6,
          minStockLevel: 10,
          sellingPrice: 3800000,
          status: 'low_stock'
        }
      ];
      setProducts(mockProducts);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: Product['status']) => {
    const config = {
      in_stock: { color: 'bg-green-100 text-green-800', label: 'Còn hàng' },
      low_stock: { color: 'bg-yellow-100 text-yellow-800', label: 'Sắp hết' },
      out_of_stock: { color: 'bg-red-100 text-red-800', label: 'Hết hàng' }
    };
    const { color, label } = config[status];
    return <Badge className={color}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý kho</h1>
          <p className="text-gray-600">Theo dõi và quản lý tồn kho sản phẩm</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm sản phẩm hoặc SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
          <CardDescription>
            Quản lý tồn kho từng sản phẩm
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2">Đang tải...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold">{product.name}</h3>
                        {getStatusBadge(product.status)}
                      </div>
                      <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Tồn kho</p>
                      <p className="font-semibold">{product.stockQuantity}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Có thể bán</p>
                      <p className="font-semibold">{product.availableQuantity}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Ngưỡng tối thiểu</p>
                      <p className="font-semibold">{product.minStockLevel}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Giá bán</p>
                      <p className="font-semibold">
                        {(product.sellingPrice / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}