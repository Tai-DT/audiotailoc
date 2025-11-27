import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import {
  InventoryItem,
  StockMovement,
  InventoryAlert,
  InventoryStats,
  Category
} from "@/types/inventory"

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
      // Use the dedicated inventory API
      const inventoryRes = await apiClient.getInventory({ limit: 200 })
      const inventoryData = inventoryRes.data as unknown
      let inventoryItems: any[] = []

      if (inventoryData && typeof inventoryData === 'object' && 'items' in inventoryData && Array.isArray((inventoryData as any).items)) {
        inventoryItems = (inventoryData as any).items
      } else if (Array.isArray(inventoryData)) {
        inventoryItems = inventoryData
      }

      // Map to InventoryItem format
      const mapped: InventoryItem[] = inventoryItems.map((item: any) => {
        const product = item.product || {}

        // Get category name from the category object or fallback to categoryId
        let categoryName = 'Chưa phân loại';
        if (product.category && typeof product.category === 'object') {
          const category = product.category as Category;
          if (category.name) {
            categoryName = category.name;
          }
        } else if (item.category && typeof item.category === 'object') {
          const category = item.category as Category;
          if (category.name) {
            categoryName = category.name;
          }
        } else if (product.categoryId) {
          categoryName = typeof product.categoryId === 'string' ? product.categoryId : 'Chưa phân loại';
        }

        const stock = (item.inventory?.stock ?? item.stock ?? item.stockQuantity ?? 0) as number
        const lowStockThreshold = (item.inventory?.lowStockThreshold ?? item.lowStockThreshold ?? 5) as number
        const reserved = (item.inventory?.reserved ?? item.reserved ?? 0) as number
        const available = (item.inventory?.available ?? item.available ?? (stock - reserved)) as number

        // Calculate status based on stock levels
        let status: InventoryItem['status'] = 'in_stock'
        if (available <= 0) {
          status = 'out_of_stock'
        } else if (available <= lowStockThreshold) {
          status = 'low_stock'
        }

        return {
          id: (item.id || item.productId) as string,
          productId: item.productId as string,
          productName: (product.name || item.productName || item.name || 'Unknown Product') as string,
          productImage: (product.imageUrl || product.image || item.productImage || item.image) as string,
          sku: (product.sku || item.sku || '') as string,
          stock,
          reserved,
          available,
          lowStockThreshold,
          status,
          lastUpdated: item.lastUpdated ? new Date(item.lastUpdated as string) : new Date(),
          category: categoryName,
          price: (product.priceCents ? Math.round((product.priceCents as number) / 100) : (item.price || (item.priceCents ? Math.round((item.priceCents as number) / 100) : undefined))) as number | undefined,
        }
      })

      setInventory(mapped)

      // Compute stats
      const newStats: InventoryStats = {
        totalProducts: mapped.length,
        inStock: mapped.filter(i => i.status === 'in_stock').length,
        lowStock: mapped.filter(i => i.status === 'low_stock').length,
        outOfStock: mapped.filter(i => i.status === 'out_of_stock').length,
        totalValue: mapped.reduce((sum, i) => sum + (i.stock * (i.price || 0)), 0)
      }
      setStats(newStats)
    } catch (error) {
      console.error('Error fetching inventory:', error)
      toast.error('Không thể tải dữ liệu tồn kho')
      setInventory([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch movements data
  const fetchMovements = useCallback(async () => {
    try {
      const response = await apiClient.getInventoryMovements({ limit: 50 })
      const movementsDataRaw = response.data as unknown
      let movementsData: any[] = []

      if (movementsDataRaw && typeof movementsDataRaw === 'object' && 'items' in movementsDataRaw && Array.isArray((movementsDataRaw as any).items)) {
        movementsData = (movementsDataRaw as any).items
      } else if (Array.isArray(movementsDataRaw)) {
        movementsData = movementsDataRaw
      }

      const mappedMovements: StockMovement[] = movementsData.map((item: any) => {
        const product = item.product || {}

        return {
          id: item.id as string,
          productId: item.productId as string,
          productName: (product.name || item.productName || 'Unknown Product') as string,
          type: item.type as StockMovement['type'],
          quantity: item.quantity as number,
          previousStock: item.previousStock as number,
          newStock: item.newStock as number,
          reason: item.reason as string,
          referenceId: item.referenceId as string,
          referenceType: item.referenceType as string,
          userId: item.userId as string,
          notes: item.notes as string,
          createdAt: new Date(item.createdAt as string),
          updatedAt: new Date(item.updatedAt as string)
        }
      })

      setMovements(mappedMovements)
    } catch (error) {
      console.error('Error fetching movements:', error)
      toast.error('Không thể tải dữ liệu biến động kho')
      setMovements([])
    }
  }, [])

  // Fetch alerts data
  const fetchAlerts = useCallback(async () => {
    try {
      const response = await apiClient.getInventoryAlerts({ limit: 50 })
      const alertsDataRaw = response.data as unknown
      let alertsData: any[] = []

      if (alertsDataRaw && typeof alertsDataRaw === 'object' && 'items' in alertsDataRaw && Array.isArray((alertsDataRaw as any).items)) {
        alertsData = (alertsDataRaw as any).items
      } else if (Array.isArray(alertsDataRaw)) {
        alertsData = alertsDataRaw
      }

      const mappedAlerts: InventoryAlert[] = alertsData.map((item: any) => {
        const product = item.product || {}

        return {
          id: item.id as string,
          productId: item.productId as string,
          productName: (product.name || item.productName || 'Unknown Product') as string,
          type: item.type as InventoryAlert['type'],
          message: item.message as string,
          threshold: item.threshold as number,
          currentStock: item.currentStock as number,
          isResolved: item.isResolved as boolean,
          resolvedAt: item.resolvedAt ? new Date(item.resolvedAt as string) : undefined,
          createdAt: new Date(item.createdAt as string),
          updatedAt: new Date(item.updatedAt as string)
        }
      })

      setAlerts(mappedAlerts)
    } catch (error) {
      console.error('Error fetching alerts:', error)
      toast.error('Không thể tải dữ liệu cảnh báo')
      setAlerts([])
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
    } catch {
      throw new Error('Không thể cập nhật tồn kho')
    }
  }, [inventory, fetchInventory])

  // Edit product (SKU/name/stock)
  const editProduct = useCallback(async (productId: string, patch: Partial<{ name: string; sku: string; stockQuantity: number }>) => {
    // Separate stock update from product details update
    const { stockQuantity, ...productPatch } = patch
    
    // Update product details if any
    if (Object.keys(productPatch).length > 0) {
      await apiClient.updateProduct(productId, productPatch)
    }

    // Update stock if provided
    if (stockQuantity !== undefined) {
      // We need to get current stock first to calculate delta
      // Or we could implement a setStock method in API, but adjustInventory uses delta
      // For now, let's fetch the product to get current stock
      try {
        const productRes = await apiClient.getProduct(productId)
        const product = productRes.data as any
        const currentStock = product.inventory?.stock ?? product.stockQuantity ?? 0
        const delta = stockQuantity - currentStock
        
        if (delta !== 0) {
          await apiClient.adjustInventory(productId, {
            stockDelta: delta,
            reason: 'Quick Edit Adjustment',
            referenceType: 'MANUAL_ADJUSTMENT'
          })
        }
      } catch (error) {
        console.error('Error updating stock in editProduct:', error)
        toast.error('Lỗi cập nhật tồn kho')
      }
    }

    await fetchInventory()
  }, [fetchInventory])

  // Delete product
  const deleteProduct = useCallback(async (productId: string) => {
    await apiClient.deleteProduct(productId)
    await fetchInventory()
  }, [fetchInventory])

  // Create movement
  const createMovement = useCallback(async (movement: Omit<StockMovement, "id" | "createdAt" | "updatedAt" | "productName" | "previousStock" | "newStock">) => {
    try {
      await apiClient.createInventoryMovement({
        productId: movement.productId,
        type: movement.type,
        quantity: movement.quantity,
        reason: movement.reason,
        notes: movement.notes,
        referenceId: movement.referenceId,
        referenceType: movement.referenceType,
        userId: movement.userId
      })

      await fetchMovements()
      await fetchInventory()

      toast.success("Đã tạo biến động kho")
    } catch (error) {
      console.error('Error creating movement:', error)
      toast.error("Không thể tạo biến động kho")
    }
  }, [fetchMovements, fetchInventory])

  // Export inventory
  const exportInventory = useCallback(async () => {
    try {
      // Export CSV client-side
      const headers = ['id', 'sku', 'productName', 'stock', 'reserved', 'available'].join(',')
      const lines = inventory.map(i => [i.productId, i.sku, `"${(i.productName || '').replace(/"/g, '""')}"`, i.stock, i.reserved, i.available].join(','))
      const csv = [headers, ...lines].join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `inventory-${Date.now()}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Đã xuất báo cáo tồn kho')
    } catch {
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
        
        // Calculate delta for adjustment
        const currentStock = (product.inventory as any)?.stock ?? (product.stockQuantity as number) ?? 0
        const delta = stockNum - currentStock
        
        if (delta !== 0) {
          await apiClient.adjustInventory(product.id as string, {
            stockDelta: delta,
            reason: 'CSV Import Adjustment',
            referenceType: 'IMPORT'
          })
        }
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
    refreshInventory
  }
}
