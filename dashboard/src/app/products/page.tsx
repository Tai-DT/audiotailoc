'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useApi'
import {
  CubeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  StarIcon,
  CurrencyDollarIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline'

// Real API hooks
const { data: productsData, isLoading: productsLoading, error: productsError } = useProducts({
  page: 1,
  limit: 100,
  search: searchTerm,
  category: categoryFilter === 'all' ? undefined : categoryFilter,
  status: statusFilter === 'all' ? undefined : statusFilter,
})

const createProductMutation = useCreateProduct()
const updateProductMutation = useUpdateProduct()
const deleteProductMutation = useDeleteProduct()

// Extract products from API response
const products = productsData?.data || []
const productStats = {
  totalProducts: productsData?.meta?.total || 0,
  activeProducts: products.filter(p => p.status === 'active').length,
  outOfStockProducts: products.filter(p => p.stock === 0).length,
  lowStockProducts: products.filter(p => p.stock > 0 && p.stock < 10).length,
  totalCategories: categories.length,
}

const categories = [
  'Electronics',
  'Gaming',
  'Wearables',
  'Home & Garden',
  'Books',
  'Fashion',
  'Sports',
  'Automotive',
  'Health',
  'Beauty',
  'Food',
  'Other',
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  // API hooks are defined above

  // Client-side filtering for additional filtering beyond API
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const getStatusBadge = (status: string, stock: number) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
          <ArchiveBoxIcon className="h-3 w-3 mr-1" />
          Hết hàng
        </span>
      )
    }

    if (stock < 10) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
          <ArchiveBoxIcon className="h-3 w-3 mr-1" />
          Sắp hết
        </span>
      )
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
        <ArchiveBoxIcon className="h-3 w-3 mr-1" />
        Còn hàng
      </span>
    )
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
          {rating}
        </span>
      </div>
    )
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
          Quản lý sản phẩm
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Quản lý danh mục sản phẩm, tồn kho và thông tin sản phẩm
        </p>
      </div>

      {/* Product Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {productStats.totalProducts.toLocaleString()}
              </p>
            </div>
            <CubeIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sản phẩm hoạt động</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {productStats.activeProducts}
              </p>
            </div>
            <ArchiveBoxIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hết hàng</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {productStats.outOfStockProducts}
              </p>
            </div>
            <ArchiveBoxIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sắp hết hàng</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {productStats.lowStockProducts}
              </p>
            </div>
            <ArchiveBoxIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Danh mục</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {productStats.totalCategories}
              </p>
            </div>
            <CubeIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Còn hàng</option>
              <option value="out_of_stock">Hết hàng</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Danh sách sản phẩm
            </h2>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
              <PlusIcon className="h-4 w-4 mr-2" />
              Thêm sản phẩm
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Đánh giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <CubeIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {product.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatCurrency(product.price)}
                    </div>
                    {product.originalPrice > product.price && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                        {formatCurrency(product.originalPrice)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {product.stock} sản phẩm
                      </span>
                      <div className="mt-1">
                        {getStatusBadge(product.status, product.stock)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      {renderStars(product.rating)}
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {product.reviews} đánh giá
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Không tìm thấy sản phẩm
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Không có sản phẩm nào phù hợp với tiêu chí tìm kiếm.
            </p>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 bg-opacity-75" onClick={() => setSelectedProduct(null)}></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-16 w-16">
                    <div className="h-16 w-16 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                      <CubeIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {selectedProduct.id}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Danh mục</label>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Trạng thái</label>
                    <div className="mt-1">
                      {getStatusBadge(selectedProduct.status, selectedProduct.stock)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Giá hiện tại</label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                      {formatCurrency(selectedProduct.price)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Giá gốc</label>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                      {formatCurrency(selectedProduct.originalPrice)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Tồn kho</label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                      {selectedProduct.stock} sản phẩm
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Đánh giá</label>
                    <div className="mt-1">
                      {renderStars(selectedProduct.rating)}
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedProduct.reviews} đánh giá
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Thống kê</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {selectedProduct.reviews}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Đánh giá</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {Math.round((selectedProduct.price / selectedProduct.originalPrice) * 100)}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Giảm giá</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {selectedProduct.rating}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Điểm đánh giá</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedProduct(null)}
                >
                  Đóng
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedProduct(null)}
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
