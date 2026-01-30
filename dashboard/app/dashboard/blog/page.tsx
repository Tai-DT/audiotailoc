"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Search, Edit, Trash2, Loader2, FileText, FolderTree } from "lucide-react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
// --- Types ---
interface BlogCategory {
    id: string
    name: string
    slug: string
    description?: string
    articleCount?: number
}

interface BlogArticle {
    id: string
    title: string
    slug: string
    excerpt?: string
    content: string
    coverImage?: string
    categoryId?: string
    category?: BlogCategory
    authorId?: string
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
    isPublished: boolean // specific backend field might vary, mapping to status usually
    viewCount: number
    createdAt: string
    updatedAt: string
}

export default function BlogPage() {
    const [activeTab, setActiveTab] = useState("articles")

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quản lý Blog</h2>
                    <p className="text-muted-foreground">
                        Quản lý bài viết và danh mục tin tức
                    </p>
                </div>
            </div>

            <Tabs defaultValue="articles" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="articles" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Bài viết
                    </TabsTrigger>
                    <TabsTrigger value="categories" className="flex items-center gap-2">
                        <FolderTree className="h-4 w-4" />
                        Danh mục
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="articles" className="space-y-4">
                    <ArticlesManager />
                </TabsContent>

                <TabsContent value="categories" className="space-y-4">
                    <CategoriesManager />
                </TabsContent>
            </Tabs>
        </div>
    )
}

// --- Sub-Components ---

function ArticlesManager() {
    const [articles, setArticles] = useState<BlogArticle[]>([])
    const [categories, setCategories] = useState<BlogCategory[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        categoryId: "",
        coverImage: "",
        status: "PUBLISHED"
    })

    // Fetch Data
    const fetchData = async () => {
        try {
            setLoading(true)
            const [articlesRes, categoriesRes] = await Promise.all([
                apiClient.get('/blog/articles'),
                apiClient.get('/blog/categories')
            ])

            const articlesData: any = articlesRes.data
            const categoriesData: any = categoriesRes.data

            setArticles(Array.isArray(articlesData) ? articlesData : articlesData.data || articlesData.items || [])
            setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.data || [])
        } catch (error) {
            console.error("Failed to fetch blog data", error)
            toast.error("Không thể tải dữ liệu blog")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // Hanlders
    const handleOpenCreate = () => {
        setEditingId(null)
        setFormData({
            title: "",
            slug: "",
            excerpt: "",
            content: "",
            categoryId: "",
            coverImage: "",
            status: "PUBLISHED"
        })
        setIsOpen(true)
    }

    const handleOpenEdit = (article: BlogArticle) => {
        setEditingId(article.id)
        setFormData({
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt || "",
            content: article.content,
            categoryId: article.categoryId || "",
            coverImage: article.coverImage || "",
            status: article.status
        })
        setIsOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return
        try {
            await apiClient.delete(`/blog/articles/${id}`)
            toast.success("Đã xóa bài viết")
            fetchData()
        } catch (error) {
            toast.error("Không thể xóa bài viết")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            if (editingId) {
                await apiClient.patch(`/blog/articles/${editingId}`, formData)
                toast.success("Cập nhật thành công")
            } else {
                await apiClient.post('/blog/articles', formData)
                toast.success("Thêm mới thành công")
            }
            setIsOpen(false)
            fetchData()
        } catch (error) {
            console.error(error)
            toast.error("Có lỗi xảy ra")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Filter
    const filteredArticles = articles.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) return <div className="p-4"><Skeleton className="h-64 w-full" /></div>

    return (
        <>
            <div className="flex justify-between mb-4">
                <Input
                    placeholder="Tìm bài viết..."
                    className="max-w-xs"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <Button onClick={handleOpenCreate}><Plus className="mr-2 h-4 w-4" /> Viết bài mới</Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Sửa bài viết" : "Thêm bài viết mới"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tiêu đề</Label>
                                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Slug (URL, tùy chọn)</Label>
                                <Input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="tu-dong-tao-neu-de-trong" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Danh mục</Label>
                                <Select value={formData.categoryId} onValueChange={val => setFormData({ ...formData, categoryId: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Trạng thái</Label>
                                <Select value={formData.status} onValueChange={val => setFormData({ ...formData, status: val })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DRAFT">Nháp</SelectItem>
                                        <SelectItem value="PUBLISHED">Công khai</SelectItem>
                                        <SelectItem value="ARCHIVED">Lưu trữ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Ảnh bìa (URL)</Label>
                            <Input value={formData.coverImage} onChange={e => setFormData({ ...formData, coverImage: e.target.value })} placeholder="https://..." />
                        </div>

                        <div className="space-y-2">
                            <Label>Mô tả ngắn</Label>
                            <Textarea value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} rows={2} />
                        </div>

                        <div className="space-y-2">
                            <Label>Nội dung (HTML hoặc Text)</Label>
                            <Textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} rows={10} required />
                            <p className="text-xs text-muted-foreground">Hỗ trợ định dạng HTML cơ bản.</p>
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
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Bài viết</TableHead>
                                <TableHead>Danh mục</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Lượt xem</TableHead>
                                <TableHead className="text-right">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredArticles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Chưa có bài viết nào</TableCell>
                                </TableRow>
                            ) : (
                                filteredArticles.map(article => (
                                    <TableRow key={article.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {article.coverImage && (
                                                    <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                                                        <img src={article.coverImage} alt={article.title} className="object-cover" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium line-clamp-1">{article.title}</p>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">{article.slug}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {article.category?.name || <span className="text-muted-foreground italic">Không</span>}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={article.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                                                {article.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{article.viewCount}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(article)}><Edit className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(article.id)}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    )
}

function CategoriesManager() {
    const [categories, setCategories] = useState<BlogCategory[]>([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({ name: "", description: "" })

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const res = await apiClient.get('/blog/categories')
            const data: any = res.data
            setCategories(Array.isArray(data) ? data : data.data || [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchCategories() }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await apiClient.post('/blog/categories', formData) // Simplified create only for now
            toast.success("Thêm danh mục thành công")
            setIsOpen(false)
            fetchCategories()
            setFormData({ name: "", description: "" })
        } catch (error) {
            toast.error("Lỗi khi thêm danh mục")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Xóa danh mục này?")) return
        try {
            await apiClient.delete(`/blog/categories/${id}`)
            toast.success("Đã xóa")
            fetchCategories()
        } catch (e) { toast.error("Không thể xóa") }
    }

    if (loading) return <Skeleton className="h-40 w-full" />

    return (
        <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 h-fit">
                <CardHeader>
                    <CardTitle>Thêm danh mục</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Tên danh mục</Label>
                            <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Mô tả</Label>
                            <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Thêm mới
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="md:col-span-2">
                <CardHeader><CardTitle>Danh sách danh mục</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tên</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead className="text-right">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map(cat => (
                                <TableRow key={cat.id}>
                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{cat.slug}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(cat.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {categories.length === 0 && <TableRow><TableCell colSpan={3} className="text-center">Trống</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
