"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Search, Edit, Trash2, Loader2, Star, Quote } from "lucide-react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Testimonial {
    id: string
    name: string
    position?: string
    company?: string
    content: string
    rating: number
    avatarUrl?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    // Form state
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        position: "",
        company: "",
        content: "",
        rating: 5,
        avatarUrl: "",
        isActive: true
    })

    const fetchTestimonials = async () => {
        try {
            setLoading(true)
            const response = await apiClient.get('/testimonials')
            const data: any = response.data

            let list: Testimonial[] = []
            if (Array.isArray(data)) list = data
            else if (data.data && Array.isArray(data.data)) list = data.data
            else if (data.items && Array.isArray(data.items)) list = data.items

            setTestimonials(list)
        } catch (error) {
            console.error('Failed to fetch testimonials:', error)
            toast.error('Không thể tải danh sách đánh giá')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTestimonials()
    }, [])

    const handleOpenCreate = () => {
        setEditingId(null)
        setFormData({
            name: "",
            position: "",
            company: "",
            content: "",
            rating: 5,
            avatarUrl: "",
            isActive: true
        })
        setIsOpen(true)
    }

    const handleOpenEdit = (item: Testimonial) => {
        setEditingId(item.id)
        setFormData({
            name: item.name,
            position: item.position || "",
            company: item.company || "",
            content: item.content,
            rating: item.rating,
            avatarUrl: item.avatarUrl || "",
            isActive: item.isActive
        })
        setIsOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsSubmitting(true)
            if (editingId) {
                await apiClient.patch(`/testimonials/${editingId}`, formData)
                toast.success('Cập nhật đánh giá thành công')
            } else {
                await apiClient.post('/testimonials', formData)
                toast.success('Thêm đánh giá thành công')
            }
            setIsOpen(false)
            fetchTestimonials()
        } catch (error) {
            toast.error(editingId ? 'Không thể cập nhật' : 'Không thể thêm mới')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return

        try {
            setIsDeleting(id)
            await apiClient.delete(`/testimonials/${id}`)
            toast.success('Đã xóa đánh giá')
            fetchTestimonials()
        } catch (error) {
            toast.error('Không thể xóa đánh giá')
        } finally {
            setIsDeleting(null)
        }
    }

    const filteredItems = testimonials.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quản lý Đánh giá</h2>
                    <p className="text-muted-foreground">
                        Quản lý đánh giá hiển thị trên trang chủ
                    </p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleOpenCreate}>
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm đánh giá
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Sửa đánh giá' : 'Thêm đánh giá mới'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Tên khách hàng</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="position">Chức vụ</Label>
                                    <Input
                                        id="position"
                                        value={formData.position}
                                        onChange={e => setFormData({ ...formData, position: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company">Công ty</Label>
                                    <Input
                                        id="company"
                                        value={formData.company}
                                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rating">Đánh giá (Sao)</Label>
                                    <Input
                                        id="rating"
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={formData.rating}
                                        onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="avatarUrl">Avatar URL</Label>
                                <Input
                                    id="avatarUrl"
                                    value={formData.avatarUrl}
                                    onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Nội dung</Label>
                                <Textarea
                                    id="content"
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    required
                                    rows={4}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Hủy</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Lưu
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Danh sách đánh giá</CardTitle>
                            <CardDescription>
                                {filteredItems.length} đánh giá trong hệ thống
                            </CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Khách hàng</TableHead>
                                <TableHead>Thông tin</TableHead>
                                <TableHead className="w-[40%]">Nội dung</TableHead>
                                <TableHead>Đánh giá</TableHead>
                                <TableHead className="text-right">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={item.avatarUrl} />
                                                <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{item.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <p>{item.position || 'N/A'}</p>
                                            <p className="text-muted-foreground">{item.company}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="line-clamp-2 text-sm text-muted-foreground flex items-start gap-2">
                                            <Quote className="h-3 w-3 flex-shrink-0 opacity-50" />
                                            {item.content}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                                            <span>{item.rating}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(item)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(item.id)}
                                                disabled={isDeleting === item.id}
                                            >
                                                {isDeleting === item.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                )}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
