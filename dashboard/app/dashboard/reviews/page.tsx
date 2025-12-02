"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Star,
  MessageSquare,
  ThumbsUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react"
import { useReviews } from "@/hooks/use-reviews"
import { format } from "date-fns"
import { vi } from "date-fns/locale/vi"

export default function ReviewsPage() {
  const {
    reviews,
    stats,
    fetchReviews,
    approveReview,
    rejectReview,
    respondToReview
  } = useReviews()

  const [activeTab, setActiveTab] = useState("pending")
  const [filterRating, setFilterRating] = useState("all")

  useEffect(() => {
    fetchReviews(activeTab)
  }, [activeTab, fetchReviews])

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          ({rating.toFixed(1)})
        </span>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Đã duyệt</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Từ chối</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Chờ duyệt</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredReviews = reviews.filter(review => {
    if (filterRating === "all") return true
    return review.rating === parseInt(filterRating)
  })

  return (
    <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Quản lý Đánh giá</h1>
              <p className="text-muted-foreground">
                Xem xét và quản lý đánh giá từ khách hàng
              </p>
            </div>
            <Button onClick={() => fetchReviews(activeTab)} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng đánh giá</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalReviews || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tất cả đánh giá
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Điểm trung bình</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.averageRating?.toFixed(1) || '0.0'}
                </div>
                {renderStars(stats?.averageRating || 0)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats?.pendingReviews || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Cần xem xét
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats?.approvedReviews || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Hiển thị công khai
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Phản hồi</CardTitle>
                <ThumbsUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.responseRate ? `${stats.responseRate}%` : '0%'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tỷ lệ phản hồi
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Reviews List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Danh sách đánh giá</CardTitle>
                <div className="flex items-center space-x-2">
                  <select
                    className="px-3 py-1 border rounded-md text-sm"
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                  >
                    <option value="all">Tất cả sao</option>
                    <option value="5">5 sao</option>
                    <option value="4">4 sao</option>
                    <option value="3">3 sao</option>
                    <option value="2">2 sao</option>
                    <option value="1">1 sao</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>
                  <TabsTrigger value="approved">Đã duyệt</TabsTrigger>
                  <TabsTrigger value="rejected">Từ chối</TabsTrigger>
                  <TabsTrigger value="all">Tất cả</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                  {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-semibold">{review.userName}</h4>
                                    {renderStars(review.rating)}
                                    {getStatusBadge(review.status)}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {review.productName || review.serviceName} • {format(new Date(review.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                                  </p>
                                  <p className="mt-2">{review.comment}</p>
                                  
                                  {review.response && (
                                    <div className="mt-3 p-3 bg-secondary rounded-md">
                                      <p className="text-sm font-medium mb-1">Phản hồi từ cửa hàng:</p>
                                      <p className="text-sm">{review.response}</p>
                                    </div>
                                  )}
                                  
                                  {review.images && review.images.length > 0 && (
                                    <div className="flex gap-2 mt-3">
                                      {review.images.map((img, idx) => (
                                        <Image
                                          key={idx}
                                          src={img}
                                          alt={`Review ${idx + 1}`}
                                          width={64}
                                          height={64}
                                          className="object-cover rounded-md"
                                        />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {review.status === 'pending' && (
                              <div className="flex items-center space-x-2 pt-3 border-t">
                                <Button
                                  size="sm"
                                  onClick={() => approveReview(review.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Duyệt
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => rejectReview(review.id)}
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Từ chối
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const response = prompt("Nhập phản hồi của bạn:")
                                    if (response) {
                                      respondToReview(review.id, response)
                                    }
                                  }}
                                >
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  Phản hồi
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="pt-6 text-center text-muted-foreground">
                        Không có đánh giá nào
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
  )
}
