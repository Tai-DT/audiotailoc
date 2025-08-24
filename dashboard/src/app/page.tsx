'use client'

import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  ServerStackIcon,
  ShieldCheckIcon,
  UsersIcon,
  CubeIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { useDashboard } from '@/contexts/DashboardContext'
import MetricCard from '@/components/dashboard/MetricCard'
import PerformanceChart from '@/components/dashboard/PerformanceChart'
import SystemHealth from '@/components/dashboard/SystemHealth'
import RecentActivity from '@/components/dashboard/RecentActivity'

export default function Dashboard() {
  const { metrics, systemHealth, recentActivity } = useDashboard()

  const stats = [
    {
      name: 'Tổng người dùng',
      value: metrics.totalUsers || 0,
      change: '+12%',
      changeType: 'increase' as const,
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      name: 'Tổng sản phẩm',
      value: metrics.totalProducts || 0,
      change: '+8%',
      changeType: 'increase' as const,
      icon: CubeIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      name: 'Đơn hàng hôm nay',
      value: metrics.todayOrders || 0,
      change: '+24%',
      changeType: 'increase' as const,
      icon: ShoppingBagIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      name: 'Doanh thu hôm nay',
      value: `$${metrics.todayRevenue?.toLocaleString() || 0}`,
      change: '+18%',
      changeType: 'increase' as const,
      icon: TrendingUpIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      name: 'System Health',
      value: systemHealth.status === 'healthy' ? 'Tốt' : 'Cảnh báo',
      change: systemHealth.status === 'healthy' ? 'Healthy' : 'Issues',
      changeType: systemHealth.status === 'healthy' ? 'increase' : 'decrease',
      icon: systemHealth.status === 'healthy' ? ShieldCheckIcon : ExclamationTriangleIcon,
      color: systemHealth.status === 'healthy' ? 'text-green-600' : 'text-red-600',
      bgColor: systemHealth.status === 'healthy'
        ? 'bg-green-50 dark:bg-green-900/20'
        : 'bg-red-50 dark:bg-red-900/20',
    },
    {
      name: 'Active Connections',
      value: metrics.activeConnections || 0,
      change: 'Real-time',
      changeType: 'increase' as const,
      icon: ServerStackIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tổng quan hệ thống
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Giám sát và quản lý toàn bộ hệ thống Audio Tài Lộc
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <MetricCard
              name={stat.name}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              icon={stat.icon}
              color={stat.color}
              bgColor={stat.bgColor}
            />
          </motion.div>
        ))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Hiệu suất hệ thống
              </h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">CPU</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Memory</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
                </div>
              </div>
            </div>
            <PerformanceChart />
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <SystemHealth />
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <RecentActivity activities={recentActivity} />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
              <ChartBarIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Metrics</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
              <ServerStackIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Backup</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
              <ShieldCheckIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Security</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
              <UsersIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Users</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
              <CubeIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Products</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
              <ShoppingBagIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Orders</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
