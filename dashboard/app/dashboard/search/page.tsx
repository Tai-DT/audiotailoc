"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search as SearchIcon,
  Package,
  Settings,
  Users,
  ShoppingCart,
  TrendingUp,
  Clock,
  Filter,
  X
} from "lucide-react"
import { useSearch } from "@/hooks/use-search"
import { format } from "date-fns"
import { vi } from "date-fns/locale/vi"

export default function SearchPage() {
  const {
    searchResults,
    searchHistory,
    popularSearches,
    loading,
    search,
    clearHistory,
    fetchHistory,
    fetchPopular
  } = useSearch()

  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filters, setFilters] = useState({
    type: "all",
    dateRange: "all",
    sortBy: "relevance"
  })

  useEffect(() => {
    fetchHistory()
    fetchPopular()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      await search(query, activeTab, filters)
    }
  }

  const handleQuickSearch = async (term: string) => {
    setQuery(term)
    await search(term, activeTab, filters)
  }

  const handleClearFilters = () => {
    setFilters({
      type: "all",
      dateRange: "all",
      sortBy: "relevance"
    })
  }

  const renderSearchResult = (result: any) => {
    const getTypeIcon = () => {
      switch (result.type) {
        case 'product': return <Package className="h-4 w-4" />
        case 'service': return <Settings className="h-4 w-4" />
        case 'user': return <Users className="h-4 w-4" />
        case 'order': return <ShoppingCart className="h-4 w-4" />
        default: return <SearchIcon className="h-4 w-4" />
      }
    }

    const getTypeBadge = () => {
      const types: { [key: string]: string } = {
        'product': 'Sản phẩm',
        'service': 'Dịch vụ',
        'user': 'Người dùng',
        'order': 'Đơn hàng'
      }
      return types[result.type] || result.type
    }

    return (
      <Card key={result.id} className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="mt-1">
                {getTypeIcon()}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg">{result.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {result.description}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary">{getTypeBadge()}</Badge>
                  {result.score && (
                    <span className="text-xs text-muted-foreground">
                      Độ phù hợp: {Math.round(result.score * 100)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            {result.price && (
              <div className="text-right">
                <p className="font-semibold">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(result.price)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tìm kiếm</h1>
            <p className="text-muted-foreground">
              Tìm kiếm sản phẩm, dịch vụ, đơn hàng và người dùng
            </p>
          </div>

          {/* Search Bar */}
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex space-x-2">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Nhập từ khóa tìm kiếm..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Đang tìm..." : "Tìm kiếm"}
                </Button>
              </form>

              {/* Quick Search */}
              {popularSearches.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Tìm kiếm phổ biến:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.slice(0, 8).map((term) => (
                      <Badge
                        key={term.id}
                        variant="outline"
                        className="cursor-pointer hover:bg-secondary"
                        onClick={() => handleQuickSearch(term.query)}
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {term.query}
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({term.count})
                        </span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Search Results */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">Tất cả</TabsTrigger>
                  <TabsTrigger value="products">Sản phẩm</TabsTrigger>
                  <TabsTrigger value="services">Dịch vụ</TabsTrigger>
                  <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
                  <TabsTrigger value="users">Người dùng</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {searchResults.all?.length > 0 ? (
                    searchResults.all.map(renderSearchResult)
                  ) : query ? (
                    <Card>
                      <CardContent className="pt-6 text-center text-muted-foreground">
                        Không tìm thấy kết quả nào cho "{query}"
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="pt-6 text-center text-muted-foreground">
                        Nhập từ khóa để bắt đầu tìm kiếm
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="products" className="space-y-4">
                  {searchResults.products?.map(renderSearchResult) || (
                    <Card>
                      <CardContent className="pt-6 text-center text-muted-foreground">
                        Không có sản phẩm nào
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="services" className="space-y-4">
                  {searchResults.services?.map(renderSearchResult) || (
                    <Card>
                      <CardContent className="pt-6 text-center text-muted-foreground">
                        Không có dịch vụ nào
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="orders" className="space-y-4">
                  {searchResults.orders?.map(renderSearchResult) || (
                    <Card>
                      <CardContent className="pt-6 text-center text-muted-foreground">
                        Không có đơn hàng nào
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                  {searchResults.users?.map(renderSearchResult) || (
                    <Card>
                      <CardContent className="pt-6 text-center text-muted-foreground">
                        Không có người dùng nào
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Bộ lọc
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Xóa
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Loại</label>
                    <select
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      value={filters.type}
                      onChange={(e) => setFilters({...filters, type: e.target.value})}
                    >
                      <option value="all">Tất cả</option>
                      <option value="product">Sản phẩm</option>
                      <option value="service">Dịch vụ</option>
                      <option value="order">Đơn hàng</option>
                      <option value="user">Người dùng</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Thời gian</label>
                    <select
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      value={filters.dateRange}
                      onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                    >
                      <option value="all">Tất cả</option>
                      <option value="today">Hôm nay</option>
                      <option value="week">Tuần này</option>
                      <option value="month">Tháng này</option>
                      <option value="year">Năm nay</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Sắp xếp</label>
                    <select
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      value={filters.sortBy}
                      onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                    >
                      <option value="relevance">Độ phù hợp</option>
                      <option value="newest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                      <option value="price_asc">Giá tăng dần</option>
                      <option value="price_desc">Giá giảm dần</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Search History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Lịch sử tìm kiếm
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                    >
                      Xóa
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {searchHistory.length > 0 ? (
                    <div className="space-y-2">
                      {searchHistory.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-sm cursor-pointer hover:text-primary"
                          onClick={() => handleQuickSearch(item.query)}
                        >
                          <span>{item.query}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(item.timestamp), 'HH:mm', { locale: vi })}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Chưa có lịch sử tìm kiếm
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
  )
}
