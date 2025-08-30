'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useOrders, useUpdateOrderStatus } from '@/src/hooks/useApi'
import {
  ShoppingBagIcon,
  EyeIcon,
  PencilSquareIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
} from '@heroicons/react/24/outline'

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  // Real API hooks
  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useOrders({
    page: 1,
    limit: 50,
    search: searchTerm,
    status: statusFilter === 'all' ? undefined : statusFilter,
    paymentStatus: undefined,
    dateFrom: undefined,
    dateTo: undefined,
  })

  const updateOrderStatusMutation = useUpdateOrderStatus()

  // Extract orders from API response
  const orders = ordersData?.data || []
  const orderStats = {
    totalOrders: ordersData?.meta?.total || 0,
    pendingOrders: orders.filter((o: any) => o.status === 'pending').length,
    processingOrders: orders.filter((o: any) => o.status === 'processing').length,
    shippedOrders: orders.filter((o: any) => o.status === 'shipped').length,
    deliveredOrders: orders.filter((o: any) => o.status === 'delivered').length,
    cancelledOrders: orders.filter((o: any) => o.status === 'cancelled').length,
    totalRevenue: orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0),
    todayRevenue: orders
      .filter((o: any) => {
        const orderDate = new Date(o.createdAt)
        const today = new Date()
        return orderDate.toDateString() === today.toDateString()
      })
      .reduce((sum: number, order: any) => sum + (order.total || 0), 0),
  }

  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch = order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
        icon: ClockIcon,
        text: 'Chờ xử lý'
      },
      processing: {
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
        icon: PencilSquareIcon,
        text: 'Đang xử lý'
      },
      shipped: {
        color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
        icon: TruckIcon,
        text: 'Đã giao hàng'
      },
      delivered: {
        color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
        icon: CheckCircleIcon,
        text: 'Hoàn thành'
      },
      cancelled: {
        color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
        icon: XCircleIcon,
        text: 'Đã hủy'
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </span>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      completed: {
        color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
        text: 'Đã thanh toán'
      },
      pending: {
        color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
        text: 'Chờ thanh toán'
      },
      refunded: {
        color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
        text: 'Đã hoàn tiền'
      },
      failed: {
        color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
        text: 'Thanh toán thất bại'
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    )
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'VNPAY':
        return '💳'
      case 'MOMO':
        return '📱'
      case 'PAYOS':
        return '💰'
      case 'BANK_TRANSFER':
        return '🏦'
      default:
        return '💳'
    }
  }

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
          Quản lý đơn hàng
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Quản lý đơn hàng, trạng thái thanh toán và giao hàng
        </p>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {orderStats.totalOrders.toLocaleString()}
              </p>
            </div>
            <ShoppingBagIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Doanh thu hôm nay</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(orderStats.todayRevenue)}
              </p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Chờ xử lý</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {orderStats.pendingOrders}
              </p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(orderStats.totalRevenue)}
              </p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ShoppingBagIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng (ID, khách hàng, email)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipped">Đã giao hàng</option>
              <option value="delivered">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Danh sách đơn hàng
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {filteredOrders.length} đơn hàng
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thanh toán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.id}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.items} sản phẩm
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.customer}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {order.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(order.total)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{getPaymentMethodIcon(order.paymentMethod)}</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {order.paymentMethod}
                      </span>
                      <div className="ml-2">
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Không tìm thấy đơn hàng
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Không có đơn hàng nào phù hợp với tiêu chí tìm kiếm.
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 bg-opacity-75" onClick={() => setSelectedOrder(null)}></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Chi tiết đơn hàng {selectedOrder.id}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Đặt vào {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Thông tin khách hàng
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Họ tên</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedOrder.customer}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Email</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedOrder.email}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Số điện thoại</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedOrder.phone}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Địa chỉ giao hàng</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedOrder.shippingAddress}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Thông tin đơn hàng
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Mã đơn hàng</label>
                        <p className="text-sm font-mono text-gray-900 dark:text-white">{selectedOrder.id}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Tổng tiền</label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(selectedOrder.total)}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Phương thức thanh toán</label>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{getPaymentMethodIcon(selectedOrder.paymentMethod)}</span>
                          <span className="text-sm text-gray-900 dark:text-white">{selectedOrder.paymentMethod}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Trạng thái thanh toán</label>
                        <div className="mt-1">
                          {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Số lượng sản phẩm</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedOrder.items} sản phẩm</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items (Mock data for demonstration) */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Sản phẩm trong đơn hàng
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                      <div className="grid grid-cols-4 gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                        <span>Sản phẩm</span>
                        <span>Số lượng</span>
                        <span>Đơn giá</span>
                        <span>Thành tiền</span>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-600">
                      <div className="px-4 py-3">
                        <div className="grid grid-cols-4 gap-4 items-center text-sm">
                          <span className="text-gray-900 dark:text-white">Wireless Headphones Pro</span>
                          <span className="text-gray-600 dark:text-gray-400">2</span>
                          <span className="text-gray-600 dark:text-gray-400">150,000 VND</span>
                          <span className="font-medium text-gray-900 dark:text-white">300,000 VND</span>
                        </div>
                      </div>
                      <div className="px-4 py-3">
                        <div className="grid grid-cols-4 gap-4 items-center text-sm">
                          <span className="text-gray-900 dark:text-white">Bluetooth Speaker</span>
                          <span className="text-gray-600 dark:text-gray-400">1</span>
                          <span className="text-gray-600 dark:text-gray-400">150,000 VND</span>
                          <span className="font-medium text-gray-900 dark:text-white">150,000 VND</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  Đóng
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  Cập nhật trạng thái
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
