export interface InventoryItem {
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

export interface StockMovement {
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

export interface InventoryAlert {
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

export interface InventoryStats {
  totalProducts: number
  inStock: number
  lowStock: number
  outOfStock: number
  totalValue: number
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface InventoryResponse {
  items: any[]
  meta?: {
    totalItems: number
    itemCount: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
  }
}