'use client';

import React from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { DashboardOverview } from '@/components/admin/dashboard-overview';
import { SalesAnalytics } from '@/components/admin/sales-analytics';
import { CustomerAnalytics } from '@/components/admin/customer-analytics';
import { InventoryAnalytics } from '@/components/admin/inventory-analytics';
import { RecentOrders } from '@/components/admin/recent-orders';
import { SystemStatus } from '@/components/admin/system-status';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Tổng quan về hoạt động kinh doanh và hệ thống
          </p>
        </div>

        {/* Dashboard Overview */}
        <DashboardOverview />

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesAnalytics />
          <CustomerAnalytics />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InventoryAnalytics />
          <SystemStatus />
        </div>

        {/* Recent Orders */}
        <RecentOrders />
      </div>
    </AdminLayout>
  );
}


