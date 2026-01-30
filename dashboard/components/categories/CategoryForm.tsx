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
import { Info, Wand2 } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import type { Category, CreateCategoryData, UpdateCategoryData } from '@/types/category';

interface CategoryFormProps {
    category?: Category;
    onSubmit: (data: CreateCategoryData | UpdateCategoryData) => Promise<void>;
    onCancel: () => void;
    categories: Category[];
}

interface FormValues {
    name: string;
    slug: string;
    description: string;
}

export function CategoryForm({ category, onSubmit, onCancel, categories }: CategoryFormProps) {
    const [loading, setLoading] = useState(false);
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

    // Track controlled fields with refs and state (not react-hook-form)
    const [imageUrl, setImageUrl] = useState(category?.imageUrl || '');
    const [parentId, setParentId] = useState(category?.parentId || '');
    const [isActive, setIsActive] = useState(category?.isActive ?? true);
    const [metaTitle, setMetaTitle] = useState(category?.metaTitle || '');
    const [metaDescription, setMetaDescription] = useState(category?.metaDescription || '');
    const [metaKeywords, setMetaKeywords] = useState(category?.metaKeywords || '');

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            name: category?.name || '',
            slug: category?.slug || '',
            description: category?.description || '',
        },
    });

    // Watch all values for controlled components
    const watchedName = watch('name');
    const watchedSlug = watch('slug');
    const watchedDescription = watch('description');

    // Auto-generate slug from name (only if not manually edited)
    useEffect(() => {
        if (!category && watchedName && !slugManuallyEdited) {
            const generatedSlug = watchedName
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Remove Vietnamese diacritics
                .replace(/đ/g, 'd')
                .replace(/Đ/g, 'D')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setValue('slug', generatedSlug);
        }
    }, [watchedName, category, setValue, slugManuallyEdited]);

    const generateSEOData = () => {
        if (!watchedName) return;

        const generatedTitle = `${watchedName} - Audio Tài Lộc`;
        const generatedDesc = watchedDescription
            ? watchedDescription.substring(0, 160)
            : `Mua ${watchedName} chính hãng, giá tốt nhất tại Audio Tài Lộc. Bảo hành uy tín, hậu mãi chu đáo.`;

        // Simple keyword generation from name parts
        const keywords = watchedName
            .split(' ')
            .filter(w => w.length > 2)
            .join(', ');

        setMetaTitle(generatedTitle);
        setMetaDescription(generatedDesc);
        setMetaKeywords(keywords);

        // Also regenerate slug if empty
        if (!watchedSlug) {
            const generatedSlug = watchedName
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd')
                .replace(/Đ/g, 'D')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setValue('slug', generatedSlug);
        }
    };

    const handleFormSubmit = async (data: FormValues) => {
        try {
            setLoading(true);
            // Combine RHF data with state-managed values
            const submissionData: CreateCategoryData | UpdateCategoryData = {
                name: data.name,
                slug: data.slug,
                description: data.description || undefined,
                imageUrl: imageUrl || undefined,
                parentId: parentId === 'none' || parentId === '' ? undefined : parentId,
                isActive: isActive,
                metaTitle: metaTitle || undefined,
                metaDescription: metaDescription || undefined,
                metaKeywords: metaKeywords || undefined,
            };
            await onSubmit(submissionData);
        } finally {
            setLoading(false);
        }
    };

    // Filter out current category and its descendants from parent options
    const availableParents = categories.filter(
        (c) => c.id !== category?.id && c.parentId !== category?.id
    );

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
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
                <ImageUpload
                    label="Category Image"
                    value={imageUrl ? [{ url: imageUrl }] : []}
                    onChange={(images) => setImageUrl(images[0]?.url || '')}
                    onRemove={() => setImageUrl('')}
                    placeholder="Tải ảnh danh mục lên Cloud"
                    maxFiles={1}
                    showSEOFields={true}
                />
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Upload an image and add SEO metadata (Alt/Title) just like products.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="parentId">Parent Category</Label>
                <Select
                    value={parentId || 'none'}
                    onValueChange={(value) => setParentId(value === 'none' ? '' : value)}
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
                    checked={isActive}
                    onCheckedChange={setIsActive}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                    Active
                </Label>
            </div>

            <div className="border-t pt-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">SEO Optimization</h3>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateSEOData}
                        disabled={!watchedName}
                    >
                        <Wand2 className="mr-2 h-4 w-4" />
                        Auto Generate
                    </Button>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                        id="metaTitle"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        placeholder="SEO Title (defaults to category name)"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="metaKeywords">Meta Keywords</Label>
                    <Input
                        id="metaKeywords"
                        value={metaKeywords}
                        onChange={(e) => setMetaKeywords(e.target.value)}
                        placeholder="keyword1, keyword2, keyword3"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                        id="metaDescription"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        placeholder="SEO Description (limit to 160 chars)"
                        rows={3}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-background pb-2">
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
