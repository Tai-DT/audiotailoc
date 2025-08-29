'use client';

import React, { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

interface HealthData {
  status: string;
  timestamp: string;
  uptime: number;
  requests: {
    total: number;
    averageResponseTime: number;
  };
  errors: {
    total: number;
  };
  database: {
    status: string;
  };
}

interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  categoryId: string;
  viewCount: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface AICapability {
  name: string;
  description: string;
  enabled: boolean;
  models: string[];
}

const DashboardPage: React.FC = () => {
  const [healthData, setHealthData] = useState<ApiResponse<HealthData> | null>(null);
  const [productsData, setProductsData] = useState<ApiResponse<{ items: Product[]; total: number }> | null>(null);
  const [categoriesData, setCategoriesData] = useState<ApiResponse<Category[]> | null>(null);
  const [aiCapabilities, setAiCapabilities] = useState<ApiResponse<{ capabilities: AICapability[] }> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const API_BASE_URL = 'http://localhost:3010/api/v1';

  const fetchData = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const [healthRes, productsRes, categoriesRes, aiRes] = await Promise.all([
        fetch(`${API_BASE_URL}/health`),
        fetch(`${API_BASE_URL}/catalog/products`),
        fetch(`${API_BASE_URL}/catalog/categories`),
        fetch(`${API_BASE_URL}/ai/capabilities`)
      ]);

      if (!healthRes.ok) throw new Error(`Health API failed: ${healthRes.status}`);
      if (!productsRes.ok) throw new Error(`Products API failed: ${productsRes.status}`);
      if (!categoriesRes.ok) throw new Error(`Categories API failed: ${categoriesRes.status}`);
      if (!aiRes.ok) throw new Error(`AI API failed: ${aiRes.status}`);

      const [health, products, categories, ai] = await Promise.all([
        healthRes.json(),
        productsRes.json(),
        categoriesRes.json(),
        aiRes.json()
      ]);

      setHealthData(health);
      setProductsData(products);
      setCategoriesData(categories);
      setAiCapabilities(ai);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu từ backend...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi kết nối backend</AlertTitle>
            <AlertDescription>
              {error}
              <br />
              <Button onClick={handleRefresh} className="mt-2" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Thử lại
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with refresh button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Audio Tài Lộc</h1>
              <p className="text-gray-600">Kết nối với backend NestJS - Dữ liệu thực</p>
            </div>
            <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Đang tải...' : 'Làm mới'}
            </Button>
          </div>
        </div>
      </div>

      {/* API Status Cards */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Health API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${healthData ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm">{healthData ? 'Connected' : 'Failed'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Products API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${productsData ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm">{productsData ? `${productsData.data?.total || 0} items` : 'Failed'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Categories API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${categoriesData ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm">{categoriesData ? `${categoriesData.data?.length || 0} items` : 'Failed'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">AI API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${aiCapabilities ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm">{aiCapabilities ? `${aiCapabilities.data?.capabilities?.length || 0} features` : 'Failed'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Component */}
        {healthData && productsData && categoriesData && aiCapabilities && (
          <Dashboard
            healthData={healthData}
            productsData={productsData}
            categoriesData={categoriesData}
            aiCapabilities={aiCapabilities}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;