"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NumberStepper } from "@/components/ui/number-stepper"
import { Textarea } from "@/components/ui/textarea"
import { GoongMapAddressPicker } from "@/components/ui/goong-map-address-picker"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  MoreHorizontal,
  Eye,
  Edit,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Trash2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  totalAmount: number
  status: string
  shippingAddress?: string
  shippingCoordinates?: string
  notes?: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

interface OrderItem {
  id: string
  productName: string
  productSlug?: string
  productId?: string
  quantity: number
  price: number
  total: number
}

interface OrdersResponse {
  items: Order[]
  total: number
  page: number
  pageSize: number
}

export default function OrdersPage() {
  const { token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)
  const [pageSize] = useState(10)

  // Modal states
  const [viewOrderDialog, setViewOrderDialog] = useState(false)
  const [editOrderDialog, setEditOrderDialog] = useState(false)
  const [updateStatusDialog, setUpdateStatusDialog] = useState(false)
  const [createOrderDialog, setCreateOrderDialog] = useState(false)
  const [deleteOrderDialog, setDeleteOrderDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  // Create order form states - enhanced for multiple products and coordinates
  const [createOrderForm, setCreateOrderForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    shippingCoordinates: null as { lat: number; lng: number } | null,
    notes: '',
    items: [{ productId: '', quantity: 1 }] // Array of items
  })

  // Edit order form states
  const [editOrderForm, setEditOrderForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    shippingCoordinates: null as { lat: number; lng: number } | null,
    notes: '',
    items: [{ productId: '', quantity: 1 }] // Array of items
  })

  // Add product to order
  const addProductToOrder = () => {
    setCreateOrderForm(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 1 }]
    }))
  }

  // Remove product from order
  const removeProductFromOrder = (index: number) => {
    setCreateOrderForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  // Update product in order
  const updateProductInOrder = (index: number, field: string, value: string | number) => {
    setCreateOrderForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)

      // Ensure we have a valid token
      if (!token) {
        console.warn('No auth token available, skipping orders fetch')
        setLoading(false)
        return
      }

      const response = await apiClient.getOrders({
        page: currentPage,
        limit: pageSize,
        status: statusFilter && statusFilter !== 'ALL' ? statusFilter : undefined
      })
      const data = response.data as OrdersResponse
      setOrders(data.items)
      setTotalOrders(data.total)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      // Show user-friendly error message
      if (error instanceof Error) {
        // You can add a toast notification here if you have a toast system
        console.error('Error message:', error.message)
      }
      // Reset state on error
      setOrders([])
      setTotalOrders(0)
    } finally {
      setLoading(false)
    }
  }, [token, currentPage, pageSize, statusFilter])

  // Product interface
  interface Product {
    id: string
    name: string
    slug: string
    priceCents: number
    stockQuantity: number
  }

  const [products, setProducts] = useState<Product[]>([])

  // Fetch products for the create order form
  const fetchProducts = useCallback(async () => {
    try {
      const response = await apiClient.getProducts()
      // Backend returns raw object, not wrapped in { data }
      const raw = response as unknown as Record<string, unknown>
      const items = raw?.items || ((raw as Record<string, unknown>)?.data as Record<string, unknown>)?.items
      if (items && Array.isArray(items)) {
        setProducts(items.map((product: Record<string, unknown>) => ({
          id: product.id as string,
          name: product.name as string,
          slug: product.slug as string,
          priceCents: product.priceCents as number,
          stockQuantity: (product.stockQuantity as number) ?? 0
        })))
      } else {
        // Fallback to hardcoded products
        setProducts([
          { id: 'loa-tai-loc-classic', name: 'Loa Tài Lộc Classic', slug: 'loa-tai-loc-classic', priceCents: 15000000, stockQuantity: 10 },
          { id: 'tai-nghe-tai-loc-pro', name: 'Tai nghe Tài Lộc Pro', slug: 'tai-nghe-tai-loc-pro', priceCents: 25000000, stockQuantity: 5 },
          { id: 'soundbar-tai-loc-5-1', name: 'Soundbar Tài Lộc 5.1', slug: 'soundbar-tai-loc-5-1', priceCents: 35000000, stockQuantity: 8 }
        ])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      // Fallback to hardcoded products
    }
  }, [])

  useEffect(() => {
    if (token) {
      apiClient.setToken(token)
      fetchOrders()
      fetchProducts()
    }
  }, [token, currentPage, statusFilter, fetchOrders, fetchProducts])

  // Ensure products used in an order are present in `products` state (fetch missing by slug or id)
  const ensureProductsForOrder = useCallback(async (order: Order) => {
    const neededKeys = new Set<string>();
    for (const it of order.items || []) {
      const slug = it.productSlug;
      const id = it.productId;
      if (slug) neededKeys.add(`slug:${slug}`);
      if (id) neededKeys.add(`id:${id}`);
    }

    const toFetch: Array<{ type: 'slug' | 'id'; value: string }> = [];
    const hasBySlug = (slug: string) => products.some(p => p.slug === slug);
    const hasById = (id: string) => products.some(p => p.id === id);

    for (const key of neededKeys) {
      const [type, value] = key.split(':');
      if (type === 'slug') {
        if (!hasBySlug(value)) toFetch.push({ type: 'slug', value });
      } else if (type === 'id') {
        if (!hasById(value)) toFetch.push({ type: 'id', value });
      }
    }

    if (toFetch.length === 0) return;

    const fetched: Product[] = [];
    for (const req of toFetch) {
      try {
        if (req.type === 'id') {
          const resp = await apiClient.get(`/catalog/products/${req.value}`);
          const pd = resp.data as Record<string, unknown>;
          if (pd?.id) {
            fetched.push({
              id: pd.id as string,
              name: pd.name as string,
              slug: pd.slug as string,
              priceCents: pd.priceCents as number,
              stockQuantity: (pd.stockQuantity as number) ?? 0
            });
          }
        } else {
          const resp = await apiClient.get(`/catalog/products/slug/${req.value}`);
          const pd = resp.data as Record<string, unknown>;
          if (pd?.id) {
            fetched.push({
              id: pd.id as string,
              name: pd.name as string,
              slug: pd.slug as string,
              priceCents: pd.priceCents as number,
              stockQuantity: (pd.stockQuantity as number) ?? 0
            });
          }
        }
      } catch (e) {
        console.error('Failed to fetch missing product', req, e);
      }
    }

    if (fetched.length > 0) {
      setProducts(prev => {
        const map = new Map<string, Product>();
        for (const p of prev) map.set(p.id, p);
        for (const p of fetched) map.set(p.id, p);
        return Array.from(map.values());
      });
    }
  }, [products]);

  // Modal handlers
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setViewOrderDialog(true)
  }

  const handleEditOrder = async (order: Order) => {
    // Ensure we have latest products and also fetch any missing ones referenced by the order
    await fetchProducts()
    await ensureProductsForOrder(order)
    setSelectedOrder(order)
    // Populate edit form with current order data
    setEditOrderForm({
      customerName: order.customerName || '',
      customerEmail: order.customerEmail || '',
      customerPhone: '', // Will be populated from API if available
      shippingAddress: order.shippingAddress || '',
      shippingCoordinates: null, // Will be parsed from order data if available
      notes: '',
      items: order.items.map(item => {
        const slug = item.productSlug;
        const id = item.productId;
        // Prefer resolving slug to actual id; fallback to given id; else empty
        const resolvedId = slug ? (products.find(p => p.slug === slug)?.id || '') : (id || '');
        return {
          productId: resolvedId,
          quantity: item.quantity
        };
      })
    })
    setEditOrderDialog(true)
  }

  const handleSubmitEditOrder = async () => {
    if (!selectedOrder) return

    try {
      await apiClient.updateOrder(selectedOrder.id, {
        customerName: editOrderForm.customerName,
        customerEmail: editOrderForm.customerEmail,
        customerPhone: editOrderForm.customerPhone,
        shippingAddress: editOrderForm.shippingAddress,
        shippingCoordinates: editOrderForm.shippingCoordinates || undefined,
        notes: editOrderForm.notes,
        items: editOrderForm.items.filter(item => item.productId && item.quantity > 0)
      })

      // Refresh orders list
      fetchOrders()
      // Refresh products to keep names and stock in sync
      fetchProducts()
      setEditOrderDialog(false)
      setSelectedOrder(null)
    } catch (error) {
      console.error('Failed to update order:', error)
    }
  }

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order)
    const allowed = getAllowedNextStatuses(order.status)
    setSelectedStatus(allowed[0] ?? '')
    setUpdateStatusDialog(true)
  }

  const handleDeleteOrder = (order: Order) => {
    setSelectedOrder(order)
    setDeleteOrderDialog(true)
  }

  const confirmDeleteOrder = async () => {
    if (!selectedOrder) return

    try {
      await apiClient.deleteOrder(selectedOrder.id)
      setDeleteOrderDialog(false)
      setSelectedOrder(null)
      fetchOrders() // Refresh the list
    } catch (error) {
      console.error('Failed to delete order:', error)
      toast.error('Không thể xóa đơn hàng')
    }
  }

  const confirmUpdateStatus = async (newStatus: string) => {
    if (!selectedOrder) return

    try {
      await apiClient.updateOrderStatus(selectedOrder.id, newStatus)
      setUpdateStatusDialog(false)
      setSelectedOrder(null)
      fetchOrders() // Refresh the list
      // Also refresh products so stockQuantity reflects cancellations immediately
      fetchProducts()
    } catch (error) {
      console.error('Failed to update order status:', error)
      toast.error('Không thể cập nhật trạng thái đơn hàng')
    }
  }

  const handleCreateOrder = async () => {
    try {
      // Validate form
      if (!createOrderForm.customerName || !createOrderForm.customerEmail) {
        alert('Vui lòng điền đầy đủ thông tin khách hàng')
        return
      }

      // Require shipping address (text-only input)
      if (!createOrderForm.shippingAddress.trim()) {
        alert('Vui lòng nhập địa chỉ giao hàng')
        return
      }

      // Validate items
      const validItems = createOrderForm.items.filter(item => item.productId && item.quantity > 0)
      if (validItems.length === 0) {
        alert('Vui lòng chọn ít nhất một sản phẩm')
        return
      }

      const orderData = {
        items: validItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress: createOrderForm.shippingAddress,
        shippingCoordinates: createOrderForm.shippingCoordinates,
        customerName: createOrderForm.customerName,
        customerEmail: createOrderForm.customerEmail,
        customerPhone: createOrderForm.customerPhone,
        notes: createOrderForm.notes
      }

      await apiClient.createOrder(orderData)
      setCreateOrderDialog(false)
      setCreateOrderForm({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        shippingAddress: '',
        shippingCoordinates: null,
        notes: '',
        items: [{ productId: '', quantity: 1 }]
      })
      fetchOrders() // Refresh orders list
      fetchProducts() // Refresh products to update stockQuantity in UI
    } catch (error) {
      console.error('Failed to create order:', error)
      toast.error('Không thể tạo đơn hàng')
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'default'
      case 'PENDING':
        return 'secondary'
      case 'PROCESSING':
        return 'outline'
      case 'CANCELLED':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-3 h-3" />
      case 'PENDING':
        return <Clock className="w-3 h-3" />
      case 'PROCESSING':
        return <Truck className="w-3 h-3" />
      case 'CANCELLED':
        return <XCircle className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  // Only allow valid transitions, aligned with backend service
  // Backend allowedTransitions: PENDING -> [PROCESSING, CANCELLED, COMPLETED], PROCESSING -> [COMPLETED, CANCELLED]
  const getAllowedNextStatuses = (current: string | undefined): string[] => {
    if (!current) return []
    const transitions: Record<string, string[]> = {
      PENDING: ['CONFIRMED', 'PROCESSING', 'CANCELLED'],
      CONFIRMED: ['PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'],
      PROCESSING: ['SHIPPED', 'COMPLETED', 'CANCELLED'],
      SHIPPED: ['COMPLETED', 'RETURNED', 'CANCELLED'],
      COMPLETED: ['RETURNED'],
      CANCELLED: [],
      RETURNED: [],
    }
    return transitions[current.toUpperCase()] || []
  }

  const formatCurrency = (amount: number | undefined | null) => {
    const val = Number(amount || 0);
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(val / 100)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid Date'
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  const totalPages = Math.ceil(totalOrders / pageSize)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h2>
          <p className="text-muted-foreground">
            Quản lý tất cả đơn hàng trong hệ thống
          </p>
        </div>
        <Button onClick={() => setCreateOrderDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo đơn hàng
        </Button>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng số đơn hàng</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders}</div>
          <p className="text-xs text-muted-foreground">
            Đang hoạt động
          </p>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
          <CardDescription>
            Tìm kiếm và quản lý đơn hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-2 mb-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã đơn hàng hoặc tên khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            <div className="md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả</SelectItem>
                  <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                  <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
                  <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                  <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Mã đơn hàng</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead className="hidden md:table-cell">Khách hàng</TableHead>
                  <TableHead className="whitespace-nowrap">Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="hidden md:table-cell whitespace-nowrap">Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Không tìm thấy đơn hàng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {order.items && order.items.length > 0 ? (
                            <div className="space-y-1">
                              {order.items.slice(0, 2).map((item) => (
                                <div key={item.id} className="text-sm truncate">
                                  <span className="font-medium truncate inline-block max-w-[180px] align-bottom">{item.productName}</span>
                                  <span className="text-muted-foreground ml-1">
                                    (x{item.quantity})
                                  </span>
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <div className="text-xs text-muted-foreground">
                                  +{order.items.length - 2} sản phẩm khác
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">Không có sản phẩm</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(order.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">
                            {order.status === 'COMPLETED' ? 'Hoàn thành' :
                              order.status === 'PENDING' ? 'Chờ xử lý' :
                                order.status === 'PROCESSING' ? 'Đang xử lý' :
                                  order.status === 'CANCELLED' ? 'Đã hủy' : order.status}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell whitespace-nowrap">{formatDate(order.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order)}>
                              <Truck className="mr-2 h-4 w-4" />
                              Cập nhật trạng thái
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteOrder(order)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Hiển thị {orders.length} trong tổng số {totalOrders} đơn hàng
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>
                <span className="text-sm">
                  Trang {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {/* View Order Dialog */}
      <Dialog open={viewOrderDialog} onOpenChange={setViewOrderDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết của đơn hàng
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Mã đơn hàng</label>
                  <p className="text-sm text-muted-foreground">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Trạng thái</label>
                  <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-1">
                      {selectedOrder.status === 'COMPLETED' ? 'Hoàn thành' :
                        selectedOrder.status === 'PENDING' ? 'Chờ xử lý' :
                          selectedOrder.status === 'PROCESSING' ? 'Đang xử lý' :
                            selectedOrder.status === 'CANCELLED' ? 'Đã hủy' : selectedOrder.status}
                    </span>
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Khách hàng</label>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Tổng tiền</label>
                  <p className="text-sm text-muted-foreground">{formatCurrency(selectedOrder.totalAmount)}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Ngày tạo</label>
                <p className="text-sm text-muted-foreground">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="space-y-4">
                  <label className="text-sm font-medium">Chi tiết sản phẩm</label>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted/50 px-4 py-2 border-b">
                      <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
                        <div className="col-span-6">Sản phẩm</div>
                        <div className="col-span-2 text-center">Số lượng</div>
                        <div className="col-span-2 text-right">Đơn giá</div>
                        <div className="col-span-2 text-right">Thành tiền</div>
                      </div>
                    </div>
                    <div className="divide-y">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="px-4 py-3">
                          <div className="grid grid-cols-12 gap-4 items-center text-sm">
                            <div className="col-span-6">
                              <p className="font-medium text-foreground">{item.productName}</p>
                            </div>
                            <div className="col-span-2 text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-medium">
                                {item.quantity}
                              </span>
                            </div>
                            <div className="col-span-2 text-right text-muted-foreground">
                              {formatCurrency(item.price)}
                            </div>
                            <div className="col-span-2 text-right font-medium">
                              {formatCurrency(item.total || (item.price * item.quantity))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-muted/30 px-4 py-3 border-t">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">Tổng cộng:</span>
                        <span className="font-bold text-lg">{formatCurrency(selectedOrder.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={updateStatusDialog} onOpenChange={(open) => {
        setUpdateStatusDialog(open)
        if (!open) {
          setSelectedStatus('')
          setSelectedOrder(null)
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
            <DialogDescription>
              Chọn trạng thái mới cho đơn hàng {selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Trạng thái hiện tại</label>
                <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>
                  {getStatusIcon(selectedOrder.status)}
                  <span className="ml-1">
                    {selectedOrder.status === 'COMPLETED' ? 'Hoàn thành' :
                      selectedOrder.status === 'PENDING' ? 'Chờ xử lý' :
                        selectedOrder.status === 'PROCESSING' ? 'Đang xử lý' :
                          selectedOrder.status === 'CANCELLED' ? 'Đã hủy' : selectedOrder.status}
                  </span>
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium">Chọn trạng thái mới</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAllowedNextStatuses(selectedOrder.status).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s === 'PENDING' ? 'Chờ xử lý' : s === 'PROCESSING' ? 'Đang xử lý' : s === 'COMPLETED' ? 'Hoàn thành' : s === 'CANCELLED' ? 'Đã hủy' : s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setUpdateStatusDialog(false)}>Hủy</Button>
                <Button
                  onClick={() => {
                    const allowed = getAllowedNextStatuses(selectedOrder.status)
                    if (!selectedStatus || !allowed.includes(selectedStatus)) return
                    confirmUpdateStatus(selectedStatus)
                  }}
                  disabled={!selectedStatus || !getAllowedNextStatuses(selectedOrder.status).includes(selectedStatus)}
                >
                  Cập nhật
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Order Dialog */}
      <AlertDialog open={deleteOrderDialog} onOpenChange={setDeleteOrderDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa đơn hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đơn hàng {selectedOrder?.orderNumber}? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteOrder} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Order Dialog */}
      <Dialog open={createOrderDialog} onOpenChange={(open) => {
        setCreateOrderDialog(open)
        if (!open) {
          setCreateOrderForm({
            customerName: '',
            customerEmail: '',
            customerPhone: '',
            shippingAddress: '',
            shippingCoordinates: null,
            notes: '',
            items: [{ productId: '', quantity: 1 }]
          })
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo đơn hàng mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin để tạo đơn hàng mới
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tên khách hàng</label>
                <Input
                  value={createOrderForm.customerName}
                  onChange={(e) => setCreateOrderForm(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="Nhập tên khách hàng"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={createOrderForm.customerEmail}
                  onChange={(e) => setCreateOrderForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                  placeholder="Nhập email"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Số điện thoại</label>
                <Input
                  value={createOrderForm.customerPhone}
                  onChange={(e) => setCreateOrderForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Địa chỉ giao hàng</label>
                <GoongMapAddressPicker
                  value={createOrderForm.shippingAddress}
                  onChange={(address, coordinates) => setCreateOrderForm(prev => ({ ...prev, shippingAddress: address || '', shippingCoordinates: coordinates || null }))}
                  placeholder="Nhập địa chỉ giao hàng (số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                  className="focus-visible:ring-primary/50"
                />
              </div>

              {/* Products Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Sản phẩm</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addProductToOrder}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm sản phẩm
                  </Button>
                </div>

                <div className="space-y-3">
                  {createOrderForm.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-1">
                        <Select
                          value={item.productId}
                          onValueChange={(value) => updateProductInOrder(index, 'productId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn sản phẩm" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                <div className="flex items-center gap-2">
                                  <span className="truncate max-w-[200px]">{product.name}</span>
                                  {product.stockQuantity > 0 && (
                                    <span className="text-xs text-muted-foreground">
                                      (Còn {product.stockQuantity})
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => {
                              const newQuantity = Math.max(1, item.quantity - 1);
                              updateProductInOrder(index, 'quantity', newQuantity);
                            }}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Giảm số lượng</span>
                          </Button>
                          <Input
                            type="number"
                            min={1}
                            max={products.find(p => p.id === item.productId)?.stockQuantity || 999}
                            value={item.quantity}
                            onChange={(e) => {
                              const stock = products.find(p => p.id === item.productId)?.stockQuantity || 999;
                              let newQuantity = parseInt(e.target.value) || 1;
                              if (newQuantity < 1) newQuantity = 1;
                              if (newQuantity > stock) newQuantity = stock;
                              updateProductInOrder(index, 'quantity', newQuantity);
                            }}
                            className="w-16 h-8 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => {
                              const stock = products.find(p => p.id === item.productId)?.stockQuantity || 999;
                              const newQuantity = Math.min(stock, item.quantity + 1);
                              updateProductInOrder(index, 'quantity', newQuantity);
                            }}
                            disabled={item.quantity >= (products.find(p => p.id === item.productId)?.stockQuantity || 999)}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Tăng số lượng</span>
                          </Button>
                        </div>
                        {item.productId && (
                          <div className="text-xs text-muted-foreground mt-1 pr-1">
                            Tồn kho: {products.find(p => p.id === item.productId)?.stockQuantity ?? 'N/A'}
                          </div>
                        )}
                      </div>

                      {createOrderForm.items.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeProductFromOrder(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Ghi chú</label>
              <Input
                value={createOrderForm.notes}
                onChange={(e) => setCreateOrderForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Nhập ghi chú (tùy chọn)"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateOrderDialog(false)}>Hủy</Button>
              <Button onClick={handleCreateOrder}>Tạo đơn hàng</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={editOrderDialog} onOpenChange={setEditOrderDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa đơn hàng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin đơn hàng #{selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Customer Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tên khách hàng</label>
                <Input
                  value={editOrderForm.customerName}
                  onChange={(e) => setEditOrderForm(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="Nhập tên khách hàng"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={editOrderForm.customerEmail}
                  onChange={(e) => setEditOrderForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                  placeholder="Nhập email khách hàng"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Số điện thoại</label>
                <Input
                  value={editOrderForm.customerPhone}
                  onChange={(e) => setEditOrderForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Địa chỉ giao hàng</label>
                <GoongMapAddressPicker
                  value={editOrderForm.shippingAddress}
                  onChange={(address, coordinates) => setEditOrderForm(prev => ({ ...prev, shippingAddress: address || '', shippingCoordinates: coordinates || null }))}
                  placeholder="Nhập địa chỉ giao hàng"
                  className="focus-visible:ring-primary/50"
                />
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sản phẩm trong đơn hàng</label>
              <div className="space-y-2">
                {editOrderForm.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <Select
                      value={item.productId}
                      onValueChange={(value) => {
                        const newItems = [...editOrderForm.items]
                        newItems[index].productId = value
                        setEditOrderForm(prev => ({ ...prev, items: newItems }))
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Chọn sản phẩm" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <NumberStepper
                      value={item.quantity}
                      min={1}
                      onChange={(v) => {
                        const newItems = [...editOrderForm.items]
                        newItems[index].quantity = v
                        setEditOrderForm(prev => ({ ...prev, items: newItems }))
                      }}
                      ariaLabel={`Số lượng sản phẩm chỉnh sửa ${index + 1}`}
                    />
                    {editOrderForm.items.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newItems = editOrderForm.items.filter((_, i) => i !== index)
                          setEditOrderForm(prev => ({ ...prev, items: newItems }))
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditOrderForm(prev => ({
                      ...prev,
                      items: [...prev.items, { productId: '', quantity: 1 }]
                    }))
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm sản phẩm
                </Button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Ghi chú</label>
              <Textarea
                value={editOrderForm.notes}
                onChange={(e) => setEditOrderForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Nhập ghi chú cho đơn hàng"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOrderDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmitEditOrder}>
              Cập nhật đơn hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
