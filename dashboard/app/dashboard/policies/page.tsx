"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Edit, Trash2, Loader2, FileText, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface Policy {
    id: string
    slug: string
    title: string
    contentHtml: string
    summary?: string
    type: string
    isPublished: boolean
    viewCount: number
    createdAt: string
    updatedAt: string
}

const POLICY_TYPES = [
    { value: "SHIPPING", label: "Chính sách giao hàng" },
    { value: "WARRANTY", label: "Bảo hành & Đổi trả" },
    { value: "SUPPORT", label: "Hỗ trợ kỹ thuật" },
    { value: "terms", label: "Điều khoản sử dụng" },
    { value: "privacy", label: "Chính sách bảo mật" },
]

export default function PoliciesPage() {
    const [policies, setPolicies] = useState<Policy[]>([])
    const [loading, setLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    // Form state
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        slug: "",
        title: "",
        contentHtml: "",
        summary: "",
        type: "SHIPPING",
        isPublished: true
    })

    const fetchPolicies = async () => {
        try {
            setLoading(true)
            const response = await apiClient.get('/policies')
            const data: any = response.data

            let list: Policy[] = []
            if (Array.isArray(data)) list = data
            else if (data.data && Array.isArray(data.data)) list = data.data

            setPolicies(list)
        } catch (error) {
            console.error('Failed to fetch policies:', error)
            toast.error('Không thể tải danh sách chính sách')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPolicies()
    }, [])

    const handleOpenCreate = () => {
        setEditingId(null)
        setFormData({
            slug: "",
            title: "",
            contentHtml: "",
            summary: "",
            type: "SHIPPING",
            isPublished: true
        })
        setIsOpen(true)
    }

    const handleOpenEdit = (item: Policy) => {
        setEditingId(item.id)
        setFormData({
            slug: item.slug,
            title: item.title,
            contentHtml: item.contentHtml,
            summary: item.summary || "",
            type: item.type,
            isPublished: item.isPublished
        })
        setIsOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsSubmitting(true)
            if (editingId) {
                await apiClient.patch(`/policies/${editingId}`, formData)
                toast.success('Cập nhật thành công')
            } else {
                await apiClient.post('/policies', formData)
                toast.success('Thêm mới thành công')
            }
            setIsOpen(false)
            fetchPolicies()
        } catch (error) {
            toast.error(editingId ? 'Lỗi khi cập nhật' : 'Lỗi khi thêm mới')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa chính sách này?')) return

        try {
            setIsDeleting(id)
            await apiClient.delete(`/policies/${id}`)
            toast.success('Đã xóa')
            fetchPolicies()
        } catch (error) {
            toast.error('Không thể xóa')
        } finally {
            setIsDeleting(null)
        }
    }

    const getTypeLabel = (type: string) => {
        return POLICY_TYPES.find(t => t.value === type)?.label || type
    }

    if (loading) {
        return (
            <div className="p-4 md:p-8 pt-6 space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quản lý Chính sách</h2>
                    <p className="text-muted-foreground">
                        Chính sách giao hàng, bảo hành, hỗ trợ kỹ thuật...
                    </p>
                </div>
                <Button onClick={handleOpenCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Thêm chính sách
                </Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Sửa chính sách' : 'Thêm chính sách mới'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tiêu đề</Label>
                                <Input
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    placeholder="VD: Chính sách giao hàng"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Slug (URL)</Label>
                                <Input
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    required
                                    placeholder="VD: chinh-sach-giao-hang"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Loại chính sách</Label>
                                <Select value={formData.type} onValueChange={val => setFormData({ ...formData, type: val })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {POLICY_TYPES.map(t => (
                                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 flex items-center gap-2 pt-7">
                                <Switch
                                    checked={formData.isPublished}
                                    onCheckedChange={checked => setFormData({ ...formData, isPublished: checked })}
                                />
                                <Label>Công khai</Label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Mô tả ngắn</Label>
                            <Textarea
                                value={formData.summary}
                                onChange={e => setFormData({ ...formData, summary: e.target.value })}
                                rows={2}
                                placeholder="Tóm tắt nội dung chính sách..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Nội dung (HTML)</Label>
                            <Textarea
                                value={formData.contentHtml}
                                onChange={e => setFormData({ ...formData, contentHtml: e.target.value })}
                                required
                                rows={12}
                                placeholder="<p>Nội dung chính sách...</p>"
                            />
                            <p className="text-xs text-muted-foreground">Hỗ trợ HTML. Sử dụng thẻ &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;...</p>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Hủy</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Lưu
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách chính sách ({policies.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tiêu đề</TableHead>
                                <TableHead>Loại</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Lượt xem</TableHead>
                                <TableHead className="text-right">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {policies.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">{item.title}</p>
                                                <p className="text-xs text-muted-foreground">/{item.slug}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{getTypeLabel(item.type)}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {item.isPublished ? (
                                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                                                <Eye className="h-3 w-3 mr-1" /> Công khai
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">
                                                <EyeOff className="h-3 w-3 mr-1" /> Ẩn
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{item.viewCount}</TableCell>
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
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {policies.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Chưa có chính sách nào. Nhấn "Thêm chính sách" để tạo mới.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
