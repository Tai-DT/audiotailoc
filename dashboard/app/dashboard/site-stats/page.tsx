"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Search, Edit, Trash2, Loader2, BarChart3 } from "lucide-react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface SiteStat {
    id: string
    key: string
    value: string
    label: string
    description?: string
    icon?: string
    priority: number
    isActive: boolean
}

export default function SiteStatsPage() {
    const [stats, setStats] = useState<SiteStat[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    // Form state
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        key: "",
        value: "",
        label: "",
        description: "",
        icon: "users",
        priority: 0,
        isActive: true
    })

    // Predefined icons list (can be expanded)
    const icons = ["users", "check-circle", "clock", "award", "map-pin", "phone", "calendar", "star"]

    const fetchStats = async () => {
        try {
            setLoading(true)
            const response = await apiClient.get('/homepage-stats')
            const data: any = response.data

            let list: SiteStat[] = []
            if (Array.isArray(data)) list = data
            else if (data.data && Array.isArray(data.data)) list = data.data

            setStats(list)
        } catch (error) {
            console.error('Failed to fetch stats:', error)
            toast.error('Không thể tải thống kê')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    const handleOpenCreate = () => {
        setEditingId(null)
        setFormData({
            key: "",
            value: "",
            label: "",
            description: "",
            icon: "users",
            priority: 0,
            isActive: true
        })
        setIsOpen(true)
    }

    const handleOpenEdit = (item: SiteStat) => {
        setEditingId(item.id)
        setFormData({
            key: item.key,
            value: item.value,
            label: item.label,
            description: item.description || "",
            icon: item.icon || "users",
            priority: item.priority || 0,
            isActive: item.isActive
        })
        setIsOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsSubmitting(true)
            if (editingId) {
                // Backend endpoint might differ for update, assuming standard REST
                // The stats controller usually exposes PATCH /homepage-stats/:id
                await apiClient.patch(`/homepage-stats/${editingId}`, formData)
                toast.success('Cập nhật thống kê thành công')
            } else {
                await apiClient.post('/homepage-stats', formData)
                toast.success('Thêm thống kê thành công')
            }
            setIsOpen(false)
            fetchStats()
        } catch (error) {
            toast.error(editingId ? 'Không thể cập nhật' : 'Không thể thêm mới')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa thống kê này?')) return

        try {
            setIsDeleting(id)
            await apiClient.delete(`/homepage-stats/${id}`)
            toast.success('Đã xóa thống kê')
            fetchStats()
        } catch (error) {
            toast.error('Không thể xóa thống kê')
        } finally {
            setIsDeleting(null)
        }
    }

    const filteredItems = stats.filter(item =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.key.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h2 className="text-3xl font-bold tracking-tight">Quản lý Thống kê</h2>
                    <p className="text-muted-foreground">
                        Các con số ấn tượng hiển thị trên trang chủ
                    </p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleOpenCreate}>
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm thống kê
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Sửa thống kê' : 'Thêm thống kê mới'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="key">Mã (Key)</Label>
                                <Input
                                    id="key"
                                    value={formData.key}
                                    onChange={e => setFormData({ ...formData, key: e.target.value })}
                                    placeholder="e.g., total_clients"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="value">Giá trị</Label>
                                    <Input
                                        id="value"
                                        value={formData.value}
                                        onChange={e => setFormData({ ...formData, value: e.target.value })}
                                        placeholder="e.g., 1000+"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="label">Nhãn hiển thị</Label>
                                    <Input
                                        id="label"
                                        value={formData.label}
                                        onChange={e => setFormData({ ...formData, label: e.target.value })}
                                        placeholder="Khách hàng hài lòng"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="icon">Icon</Label>
                                    <Select
                                        value={formData.icon}
                                        onValueChange={val => setFormData({ ...formData, icon: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {icons.map(icon => (
                                                <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="priority">Thứ tự ưu tiên</Label>
                                    <Input
                                        id="priority"
                                        type="number"
                                        value={formData.priority}
                                        onChange={e => setFormData({ ...formData, priority: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Mô tả (Optional)</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
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
                            <CardTitle>Danh sách thống kê</CardTitle>
                            <CardDescription>
                                Hiển thị {filteredItems.length} chỉ số
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã</TableHead>
                                <TableHead>Giá trị</TableHead>
                                <TableHead>Nhãn</TableHead>
                                <TableHead>Icon</TableHead>
                                <TableHead>Ưu tiên</TableHead>
                                <TableHead className="text-right">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-mono text-xs">{item.key}</TableCell>
                                    <TableCell className="font-bold text-lg">{item.value}</TableCell>
                                    <TableCell>{item.label}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {/* Ideally render dynamic icon here, keeping it simple for now */}
                                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">{item.icon}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.priority}</TableCell>
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
