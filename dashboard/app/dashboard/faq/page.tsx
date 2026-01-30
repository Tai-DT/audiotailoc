"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Search, Edit, Trash2, Loader2, MessageCircleQuestion } from "lucide-react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface FAQ {
    id: string
    question: string
    answer: string
    category?: string
    displayOrder: number
    isActive: boolean
}

export default function FAQPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    // Form state
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        category: "GENERAL",
        displayOrder: 0,
        isActive: true
    })

    const fetchFaqs = async () => {
        try {
            setLoading(true)
            const response = await apiClient.get('/faq')
            const data: any = response.data

            let list: FAQ[] = []
            if (Array.isArray(data)) list = data
            else if (data.data && Array.isArray(data.data)) list = data.data
            else if (data.items && Array.isArray(data.items)) list = data.items

            setFaqs(list)
        } catch (error) {
            console.error('Failed to fetch FAQs:', error)
            toast.error('Không thể tải danh sách câu hỏi')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFaqs()
    }, [])

    const handleOpenCreate = () => {
        setEditingId(null)
        setFormData({
            question: "",
            answer: "",
            category: "GENERAL",
            displayOrder: faqs.length + 1,
            isActive: true
        })
        setIsOpen(true)
    }

    const handleOpenEdit = (item: FAQ) => {
        setEditingId(item.id)
        setFormData({
            question: item.question,
            answer: item.answer,
            category: item.category || "GENERAL",
            displayOrder: item.displayOrder || 0,
            isActive: item.isActive
        })
        setIsOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsSubmitting(true)
            if (editingId) {
                await apiClient.patch(`/faq/${editingId}`, formData)
                toast.success('Cập nhật thành công')
            } else {
                await apiClient.post('/faq', formData)
                toast.success('Thêm mới thành công')
            }
            setIsOpen(false)
            fetchFaqs()
        } catch (error) {
            toast.error(editingId ? 'Lỗi khi cập nhật' : 'Lỗi khi thêm mới')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa câu hỏi này?')) return

        try {
            setIsDeleting(id)
            await apiClient.delete(`/faq/${id}`)
            toast.success('Đã xóa')
            fetchFaqs()
        } catch (error) {
            toast.error('Không thể xóa')
        } finally {
            setIsDeleting(null)
        }
    }

    const filteredItems = faqs.filter(item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )

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
                    <h2 className="text-3xl font-bold tracking-tight">Quản lý FAQ</h2>
                    <p className="text-muted-foreground">
                        Câu hỏi thường gặp hiển thị trên trang Liên hệ
                    </p>
                </div>
                <Button onClick={handleOpenCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Thêm câu hỏi
                </Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Câu hỏi</Label>
                            <Input
                                value={formData.question}
                                onChange={e => setFormData({ ...formData, question: e.target.value })}
                                required
                                placeholder="VD: Thời gian bảo hành bao lâu?"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Câu trả lời</Label>
                            <Textarea
                                value={formData.answer}
                                onChange={e => setFormData({ ...formData, answer: e.target.value })}
                                required
                                rows={4}
                                placeholder="VD: Bảo hành chính hãng 12 tháng..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Thứ tự hiển thị</Label>
                                <Input
                                    type="number"
                                    value={formData.displayOrder}
                                    onChange={e => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Danh mục</Label>
                                <Input
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="GENERAL / WARRANTY / SHIP"
                                />
                            </div>
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
                    <div className="flex items-center justify-between">
                        <CardTitle>Danh sách câu hỏi ({filteredItems.length})</CardTitle>
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
                                <TableHead>Câu hỏi / Trả lời</TableHead>
                                <TableHead>Danh mục</TableHead>
                                <TableHead>Thứ tự</TableHead>
                                <TableHead className="text-right">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="max-w-md">
                                        <div className="font-medium flex items-center gap-2">
                                            <MessageCircleQuestion className="h-4 w-4 text-primary" />
                                            {item.question}
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 pl-6">
                                            {item.answer}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item.category}</Badge>
                                    </TableCell>
                                    <TableCell>{item.displayOrder}</TableCell>
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
                            {filteredItems.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        Chưa có dữ liệu
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
