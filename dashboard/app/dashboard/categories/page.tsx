'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Image as ImageIcon, Package, TrendingUp, Grid3x3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCategories } from '@/hooks/use-categories';
import type { Category, CreateCategoryData, UpdateCategoryData } from '@/types/category';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CategoryForm } from '@/components/categories/CategoryForm';

export default function CategoriesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const {
        categories,
        stats,
        loading,
        createCategory,
        updateCategory,
        deleteCategory,
    } = useCategories();

    const handleCreate = async (data: CreateCategoryData | UpdateCategoryData) => {
        try {
            await createCategory(data as CreateCategoryData);
            setIsCreateDialogOpen(false);
        } catch {
            // Error is handled by the hook
        }
    };

    const handleEdit = async (data: CreateCategoryData | UpdateCategoryData) => {
        if (!selectedCategory) return;

        try {
            await updateCategory(selectedCategory.id, data as UpdateCategoryData);
            setIsEditDialogOpen(false);
            setSelectedCategory(null);
        } catch {
            // Error is handled by the hook
        }
    };

    const handleDelete = async () => {
        if (!selectedCategory) return;

        try {
            await deleteCategory(selectedCategory.id);
            setIsDeleteDialogOpen(false);
            setSelectedCategory(null);
        } catch (error) {
            // Error is handled by the hook
        } finally {
            setIsDeleteDialogOpen(false);
            setSelectedCategory(null);
        }
    };

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Product Categories</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your product categories
                    </p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Categories</p>
                            <h3 className="text-2xl font-bold mt-2">{stats.totalCategories}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats.activeCategories} active, {stats.inactiveCategories} inactive
                            </p>
                        </div>
                        <Grid3x3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                            <h3 className="text-2xl font-bold mt-2">{stats.totalProducts}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                Across all categories
                            </p>
                        </div>
                        <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">With Products</p>
                            <h3 className="text-2xl font-bold mt-2">{stats.categoriesWithProducts}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats.categoriesWithoutProducts} empty categories
                            </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-muted-foreground" />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-24 text-center">Products</TableHead>
                            <TableHead className="w-24">Status</TableHead>
                            <TableHead className="w-32 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : filteredCategories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                    No categories found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCategories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        {category.imageUrl ? (
                                            <img
                                                src={category.imageUrl}
                                                alt={category.name}
                                                className="w-10 h-10 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {category.slug}
                                    </TableCell>
                                    <TableCell className="max-w-md truncate">
                                        {category.description || '-'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Package className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">
                                                {category._count?.products || 0}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${category.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {category.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedCategory(category);
                                                    setIsEditDialogOpen(true);
                                                }}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedCategory(category);
                                                    setIsDeleteDialogOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create Category</DialogTitle>
                        <DialogDescription>
                            Add a new product category with descriptive information
                        </DialogDescription>
                    </DialogHeader>
                    <CategoryForm
                        onSubmit={handleCreate}
                        onCancel={() => setIsCreateDialogOpen(false)}
                        categories={categories}
                    />
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>
                            Update category information
                        </DialogDescription>
                    </DialogHeader>
                    {selectedCategory && (
                        <CategoryForm
                            category={selectedCategory}
                            onSubmit={handleEdit}
                            onCancel={() => {
                                setIsEditDialogOpen(false);
                                setSelectedCategory(null);
                            }}
                            categories={categories}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the category &quot;{selectedCategory?.name}&quot;.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedCategory(null)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
