import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { apiClient } from "@/lib/api-client"

interface InventoryItem {
  id: string
  productId: string
  productName: string
  productImage?: string
  sku: string
  stock: number
  reserved: number
  available: number
  lowStockThreshold: number
  status: "in_stock" | "low_stock" | "out_of_stock"
  lastUpdated: Date
  category?: string
  price?: number
}

interface StockMovement {
  id: string
  productId: string
  productName: string
  type: "IN" | "OUT" | "RESERVED" | "UNRESERVED" | "ADJUSTMENT"
  quantity: number
  previousStock: number
  newStock: number
  reason: string
  referenceId?: string
  referenceType?: string
  userId?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

interface InventoryAlert {
  id: string
  productId: string
  productName: string
  type: "LOW_STOCK" | "OUT_OF_STOCK" | "OVERSTOCK" | "EXPIRING"
  message: string
  threshold?: number
  currentStock: number
  isResolved: boolean
  resolvedAt?: Date
  createdAt: Date
  updatedAt: Date
}


interface InventoryStats {
  totalProducts: number
  inStock: number
  lowStock: number
  outOfStock: number
  totalValue: number
}

interface Category {
  id: string
  name: string
  slug: string
}

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [alerts, setAlerts] = useState<InventoryAlert[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<InventoryStats>({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0
  })

  // Fetch inventory data
  const fetchInventory = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch with max pageSize (10000) - backend caps pageSize at 10000
      const inventoryRes = await apiClient.getInventory({ limit: 10000, page: 1 })

      // Response can be either the raw payload { total, items, ... } or wrapped in { data: {...} }
      const payload = (inventoryRes as any)?.data ?? (inventoryRes as any)?.data?.data ?? inventoryRes ?? {}

      let inventoryItems: unknown[] = []
      if (Array.isArray(payload)) {
        inventoryItems = payload
      } else if (Array.isArray((payload as any)?.items)) {
        inventoryItems = (payload as any).items
      } else if (Array.isArray((payload as any)?.data?.items)) {
        inventoryItems = (payload as any).data.items
      }

      const totalFromAPI: number | undefined =
        (payload as any)?.total ??
        (payload as any)?.data?.total ??
        (payload as any)?.data?.data?.total ??
        inventoryItems.length

      // Helper to map raw inventory item to our InventoryItem
      const mapInventoryItem = (item: unknown): InventoryItem => {
        const inventoryItem = item as Record<string, unknown>
        const product = inventoryItem.product as Record<string, unknown> || {}

        // Get category name from the category object or fallback to categoryId
        let categoryName = 'Chưa phân loại';
        if (product.category && typeof product.category === 'object') {
          const category = product.category as Category;
          if (category.name) {
            categoryName = category.name;
          }
        } else if (inventoryItem.category && typeof inventoryItem.category === 'object') {
          const category = inventoryItem.category as Category;
          if (category.name) {
            categoryName = category.name;
          }
        } else if (product.categoryId) {
          categoryName = product.categoryId as string;
        }

        const stock = (inventoryItem.stock || inventoryItem.stockQuantity || 0) as number
        const reserved = (inventoryItem.reserved || 0) as number
        const lowStockThreshold = (inventoryItem.lowStockThreshold || 5) as number
        const available = (inventoryItem.available !== undefined
          ? (inventoryItem.available as number)
          : Math.max(0, stock - reserved)) as number

        // Calculate status based on available stock levels
        let status: InventoryItem['status']
        if (stock <= 0 || available <= 0) {
          status = 'out_of_stock'
        } else if (available <= lowStockThreshold) {
          status = 'low_stock'
        } else {
          status = 'in_stock'
        }

        return {
          id: (inventoryItem.id || inventoryItem.productId) as string,
          productId: inventoryItem.productId as string,
          productName: (product.name || inventoryItem.productName || inventoryItem.name || 'Unknown Product') as string,
          productImage: (product.imageUrl || product.image || inventoryItem.productImage || inventoryItem.image) as string,
          sku: (product.sku || inventoryItem.sku || '') as string,
          stock,
          reserved,
          available,
          lowStockThreshold,
          status,
          lastUpdated: inventoryItem.lastUpdated ? new Date(inventoryItem.lastUpdated as string) : new Date(),
          category: categoryName,
          price: (product.priceCents ? Math.round((product.priceCents as number) / 100) : (inventoryItem.price || (inventoryItem.priceCents ? Math.round((inventoryItem.priceCents as number) / 100) : undefined))) as number | undefined,
        }
      }

      // Map first page
      const mappedFirstPage: InventoryItem[] = inventoryItems.map(mapInventoryItem)

      // If API total is larger than items received, fetch additional pages for accurate stats
      let allItems: InventoryItem[] = mappedFirstPage
      const totalProducts = totalFromAPI ?? mappedFirstPage.length
      const pageSize = 10000
      const totalPages = Math.ceil(totalProducts / pageSize)

      if (totalPages > 1) {
        const additionalItems: InventoryItem[] = []
        const maxPages = Math.min(totalPages, 10) // safeguard to avoid too many requests

        for (let page = 2; page <= maxPages; page++) {
          try {
            const pageRes = await apiClient.getInventory({ limit: pageSize, page })
            const pagePayload = (pageRes as any)?.data ?? (pageRes as any)?.data?.data ?? pageRes ?? {}
            let pageItems: unknown[] = []
            if (Array.isArray(pagePayload)) {
              pageItems = pagePayload
            } else if (Array.isArray((pagePayload as any)?.items)) {
              pageItems = (pagePayload as any).items
            } else if (Array.isArray((pagePayload as any)?.data?.items)) {
              pageItems = (pagePayload as any).data.items
            }
            if (pageItems.length === 0) break
            additionalItems.push(...pageItems.map(mapInventoryItem))
            if (mappedFirstPage.length + additionalItems.length >= totalProducts) break
          } catch (err) {
            console.warn(`Không thể tải trang tồn kho ${page}`, err)
            break
          }
        }

        allItems = [...mappedFirstPage, ...additionalItems]
      }

      setInventory(allItems)

      const inStockItems = allItems.filter(i => i.status === 'in_stock')
      const lowStockItems = allItems.filter(i => i.status === 'low_stock')
      const outOfStockItems = allItems.filter(i => i.status === 'out_of_stock')

      const totalValue = allItems.reduce((sum, i) => sum + (i.stock * (i.price || 0)), 0)

      const newStats: InventoryStats = {
        totalProducts,
        inStock: inStockItems.length,
        lowStock: lowStockItems.length,
        outOfStock: outOfStockItems.length,
        totalValue
      }
      
      // Debug log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Inventory Stats:', {
          totalFromAPI,
          itemsReceived: inventoryItems.length,
          totalProducts: newStats.totalProducts,
          inStock: newStats.inStock,
          lowStock: newStats.lowStock,
          outOfStock: newStats.outOfStock,
          totalValue: newStats.totalValue
        })
      }
      
      setStats(newStats)
    } catch (error) {
      toast.error('Không thể tải dữ liệu tồn kho')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch movements data
  const fetchMovements = useCallback(async () => {
    try {
      const response = await apiClient.getInventoryMovements({ limit: 50 })
      const movementsData = (response?.data as { items?: unknown[] })?.items || response?.data as unknown[] || []

      const mappedMovements: StockMovement[] = movementsData.map((item: unknown) => {
        const movement = item as Record<string, unknown>
        const product = movement.product as Record<string, unknown> || {}

        return {
          id: movement.id as string,
          productId: movement.productId as string,
          productName: (product.name || movement.productName || 'Unknown Product') as string,
          type: movement.type as StockMovement['type'],
          quantity: movement.quantity as number,
          previousStock: movement.previousStock as number,
          newStock: movement.newStock as number,
          reason: movement.reason as string,
          referenceId: movement.referenceId as string,
          referenceType: movement.referenceType as string,
          userId: movement.userId as string,
          notes: movement.notes as string,
          createdAt: new Date(movement.createdAt as string),
          updatedAt: new Date(movement.updatedAt as string)
        }
      })

      setMovements(mappedMovements)
    } catch (error) {
      toast.error('Không thể tải dữ liệu biến động kho')
    }
  }, [])

  // Fetch alerts data
  const fetchAlerts = useCallback(async () => {
    try {
      const response = await apiClient.getInventoryAlerts({ limit: 50 })
      const alertsData = (response?.data as { items?: unknown[] })?.items || response?.data as unknown[] || []

      const mappedAlerts: InventoryAlert[] = alertsData.map((item: unknown) => {
        const alert = item as Record<string, unknown>
        const product = alert.product as Record<string, unknown> || {}

        return {
          id: alert.id as string,
          productId: alert.productId as string,
          productName: (product.name || alert.productName || 'Unknown Product') as string,
          type: alert.type as InventoryAlert['type'],
          message: alert.message as string,
          threshold: alert.threshold as number,
          currentStock: alert.currentStock as number,
          isResolved: alert.isResolved as boolean,
          resolvedAt: alert.resolvedAt ? new Date(alert.resolvedAt as string) : undefined,
          createdAt: new Date(alert.createdAt as string),
          updatedAt: new Date(alert.updatedAt as string)
        }
      })

      setAlerts(mappedAlerts)
    } catch (error) {
      toast.error('Không thể tải dữ liệu cảnh báo')
    }
  }, [])

  // Update stock (real backend)
  const updateStock = useCallback(async (
    productId: string,
    type: "increase" | "decrease",
    quantity: number,
    reason: string
  ) => {
    try {
      // Use the inventory adjustment API
      const adjustment = type === 'increase' ? quantity : -quantity
      await apiClient.adjustInventory(productId, {
        stockDelta: adjustment
      })

      // Record movement locally (UI)
      const item = inventory.find(i => i.productId === productId)
      const newMovement: StockMovement = {
        id: `mov-${Date.now()}`,
        productId,
        productName: item?.productName || 'Sản phẩm',
        type: type === 'increase' ? 'IN' : 'OUT',
        quantity,
        previousStock: item?.stock || 0,
        newStock: type === 'increase' ? (item?.stock || 0) + quantity : (item?.stock || 0) - quantity,
        reason,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setMovements(prev => [newMovement, ...prev])

      // Refresh inventory to reflect backend changes
      await fetchInventory()
      toast.success('Đã cập nhật tồn kho thành công')
    } catch (_error) {
      throw new Error('Không thể cập nhật tồn kho')
    }
  }, [inventory, fetchInventory])

  // Edit product (SKU/name/stock)
  const editProduct = useCallback(async (productId: string, patch: Partial<{ name: string; sku: string; stockQuantity: number }>) => {
    await apiClient.updateProduct(productId, patch)
    await fetchInventory()
  }, [fetchInventory])

  // Delete product
  const deleteProduct = useCallback(async (productId: string) => {
    await apiClient.deleteProduct(productId)
    await fetchInventory()
  }, [fetchInventory])

  // Create movement (UI only for now)
  const createMovement = useCallback(async (movement: Omit<StockMovement, "id" | "createdAt">) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))

      const newMovement: StockMovement = {
        ...movement,
        id: `mov-${Date.now()}`,
        createdAt: new Date()
      }

      setMovements(prev => [newMovement, ...prev])
      toast.success("Đã tạo biến động kho")
    } catch {
      toast.error("Không thể tạo biến động kho")
    }
  }, [])

  // Export inventory
  const exportInventory = useCallback(async () => {
    try {
      toast.info('Đang xuất dữ liệu tồn kho...')
      
      // Export CSV client-side with all data
      const headers = ['ID', 'SKU', 'Tên sản phẩm', 'Danh mục', 'Tồn kho', 'Đã đặt', 'Khả dụng', 'Trạng thái', 'Giá', 'Cập nhật'].join(',')
      const lines = inventory.map(i => [
        i.productId,
        i.sku || '',
        `"${(i.productName || '').replace(/"/g, '""')}"`,
        `"${(i.category || '').replace(/"/g, '""')}"`,
        i.stock,
        i.reserved,
        i.available,
        i.status === 'in_stock' ? 'Còn hàng' : i.status === 'low_stock' ? 'Sắp hết' : 'Hết hàng',
        i.price || 0,
        format(i.lastUpdated, 'dd/MM/yyyy HH:mm', { locale: vi })
      ].join(','))
      
      // Add BOM for Excel UTF-8 support
      const csv = '\uFEFF' + [headers, ...lines].join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `inventory-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Đã xuất ${inventory.length} sản phẩm`)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Không thể xuất báo cáo')
    }
  }, [inventory])

  // Import inventory
  const importInventory = useCallback(async (file: File) => {
    try {
      const text = await file.text()
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0)
      if (lines.length <= 1) throw new Error('CSV trống')
      const header = lines[0].split(',').map(h => h.trim().toLowerCase())
      const idxSku = header.indexOf('sku')
      const idxId = header.indexOf('id')
      const idxStock = header.indexOf('stock') >= 0 ? header.indexOf('stock') : header.indexOf('stockquantity')
      if (idxStock < 0 || (idxSku < 0 && idxId < 0)) {
        throw new Error('CSV phải có cột sku hoặc id và cột stock/stockQuantity')
      }

      // Build product index by SKU and ID
      const prodRes = await apiClient.getProducts({ limit: 1000 })
      const items = (prodRes?.data as { items?: unknown[] })?.items || prodRes?.data as unknown[] || []
      const bySku = new Map<string, Record<string, unknown>>()
      const byId = new Map<string, Record<string, unknown>>()
      for (const p of items) {
        const product = p as Record<string, unknown>
        if (product.sku) bySku.set(String(product.sku).toLowerCase(), product)
        byId.set(product.id as string, product)
      }

      // Apply updates
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',')
        const sku = idxSku >= 0 ? cols[idxSku]?.trim() : ''
        const pid = idxId >= 0 ? cols[idxId]?.trim() : ''
        const stockStr = cols[idxStock]?.trim()
        const stockNum = Math.max(0, parseInt(stockStr || '0', 10) || 0)
        let product = pid ? byId.get(pid) : null
        if (!product && sku) product = bySku.get(sku.toLowerCase())
        if (!product) continue
        await apiClient.updateProduct(product.id as string, { stockQuantity: stockNum })
      }

      await fetchInventory()
      toast.success('Đã nhập dữ liệu tồn kho')
    } catch {
      toast.error('Không thể nhập dữ liệu')
    }
  }, [fetchInventory])

  // Refresh inventory
  const refreshInventory = useCallback(() => {
    fetchInventory()
    fetchMovements()
    fetchAlerts()
  }, [fetchInventory, fetchMovements, fetchAlerts])

  // Sync inventory with products
  const syncInventoryWithProducts = useCallback(async () => {
    try {
      toast.info('Đang đồng bộ dữ liệu tồn kho...')
      const response = await apiClient.syncInventory()
      const data = response?.data as { syncedProducts?: number; orphanedInventoriesCount?: number } || {}

      toast.success(`Đã đồng bộ ${data.syncedProducts || 0} sản phẩm mới`)

      // Refresh data after sync
      await fetchInventory()
      await fetchMovements()
    } catch (error) {
      toast.error('Không thể đồng bộ dữ liệu tồn kho')
    }
  }, [fetchInventory, fetchMovements])

  // Initial load
  useEffect(() => {
    fetchInventory()
    fetchMovements()
    fetchAlerts()
  }, [fetchInventory, fetchMovements, fetchAlerts])

  // Auto refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchInventory()
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [fetchInventory])

  return {
    inventory,
    movements,
    alerts,
    loading,
    stats,
    updateStock,
    editProduct,
    deleteProduct,
    createMovement,
    exportInventory,
    importInventory,
    refreshInventory,
    syncInventoryWithProducts
  }
}
