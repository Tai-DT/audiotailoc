'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Info } from 'lucide-react';
import type { Category, CreateCategoryData, UpdateCategoryData } from '@/types/category';

interface CategoryFormProps {
    category?: Category;
    onSubmit: (data: CreateCategoryData | UpdateCategoryData) => Promise<void>;
    onCancel: () => void;
    categories: Category[];
}

export function CategoryForm({ category, onSubmit, onCancel, categories }: CategoryFormProps) {
    const [loading, setLoading] = useState(false);
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: category?.name || '',
            slug: category?.slug || '',
            description: category?.description || '',
            imageUrl: category?.imageUrl || '',
            parentId: category?.parentId || '',
            isActive: category?.isActive ?? true,
        },
    });

    const name = watch('name');
    const slug = watch('slug');

    // Auto-generate slug from name (only if not manually edited)
    useEffect(() => {
        if (!category && name && !slugManuallyEdited) {
            const generatedSlug = name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Remove Vietnamese diacritics
                .replace(/đ/g, 'd')
                .replace(/Đ/g, 'D')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setValue('slug', generatedSlug);
        }
    }, [name, category, setValue, slugManuallyEdited]);

    const handleFormSubmit = async (data: CreateCategoryData | UpdateCategoryData) => {
        try {
            setLoading(true);
            await onSubmit(data);
        } finally {
            setLoading(false);
        }
    };

    // Filter out current category and its descendants from parent options
    const availableParents = categories.filter(
        (c) => c.id !== category?.id && c.parentId !== category?.id
    );

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="name"
                    {...register('name', { required: 'Name is required' })}
                    placeholder="Enter category name"
                />
                {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="slug">
                    Slug <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="slug"
                    {...register('slug', {
                        required: 'Slug is required',
                        pattern: {
                            value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                            message: 'Slug must be lowercase letters, numbers, and hyphens only'
                        }
                    })}
                    placeholder="category-slug"
                    onChange={(e) => {
                        setSlugManuallyEdited(true);
                        register('slug').onChange(e);
                    }}
                />
                {errors.slug && (
                    <p className="text-sm text-destructive">{errors.slug.message}</p>
                )}
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    URL-friendly identifier (auto-generated from name, or edit manually)
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Enter category description to help users understand this category"
                    rows={4}
                />
                <p className="text-sm text-muted-foreground">
                    Provide helpful information about this category for users
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                    id="imageUrl"
                    {...register('imageUrl', {
                        pattern: {
                            value: /^https?:\/\/.+/,
                            message: 'Must be a valid URL starting with http:// or https://'
                        }
                    })}
                    placeholder="https://example.com/image.jpg"
                    type="url"
                />
                {errors.imageUrl && (
                    <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
                )}
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    URL of the category image to display (optional)
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="parentId">Parent Category</Label>
                <Select
                    value={watch('parentId') || 'none'}
                    onValueChange={(value) => setValue('parentId', value === 'none' ? '' : value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select parent category (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">None (Top Level)</SelectItem>
                        {availableParents.map((parent) => (
                            <SelectItem key={parent.id} value={parent.id}>
                                {parent.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                    Optional: Select a parent category to create a subcategory
                </p>
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="isActive"
                    checked={watch('isActive')}
                    onCheckedChange={(checked) => setValue('isActive', checked)}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                    Active
                </Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : category ? 'Update' : 'Create'}
                </Button>
            </div>
        </form>
    );
}
