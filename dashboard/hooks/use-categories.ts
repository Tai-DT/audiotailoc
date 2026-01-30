'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/components/ui/use-toast';
import type { Category, CreateCategoryData, UpdateCategoryData } from '@/types/category';

export interface CategoryStats {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  totalProducts: number;
  categoriesWithProducts: number;
  categoriesWithoutProducts: number;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<CategoryStats>({
    totalCategories: 0,
    activeCategories: 0,
    inactiveCategories: 0,
    totalProducts: 0,
    categoriesWithProducts: 0,
    categoriesWithoutProducts: 0,
  });
  const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.getCategories();

      // Handle different response formats
      // The API client returns ApiResponse<unknown>, so we need to cast it
      const responseData = response as unknown as { data: Category[] } | Category[];

      let categoriesData: Category[] = [];

      if (Array.isArray(responseData)) {
        categoriesData = responseData;
      } else if (responseData && Array.isArray(responseData.data)) {
        categoriesData = responseData.data;
      }

      setCategories(categoriesData);

      // Calculate stats
      const totalCategories = categoriesData.length;
      const activeCategories = categoriesData.filter((cat) => cat.isActive).length;
      const inactiveCategories = totalCategories - activeCategories;
      const totalProducts = categoriesData.reduce((sum, cat) => sum + (cat._count?.products || 0), 0);
      const categoriesWithProducts = categoriesData.filter((cat) => (cat._count?.products || 0) > 0).length;
      const categoriesWithoutProducts = totalCategories - categoriesWithProducts;

      setStats({
        totalCategories,
        activeCategories,
        inactiveCategories,
        totalProducts,
        categoriesWithProducts,
        categoriesWithoutProducts,
      });
    } catch {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách danh mục',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = useCallback(
    async (data: CreateCategoryData) => {
      try {
        const response = await apiClient.createCategory(data);

        toast({
          title: 'Thành công',
          description: 'Đã tạo danh mục mới',
        });

        await fetchCategories();
        return response;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Không thể tạo danh mục';
        toast({
          title: 'Lỗi',
          description: message,
          variant: 'destructive',
        });
        throw error;
      }
    },
    [fetchCategories, toast]
  );

  const updateCategory = useCallback(
    async (id: string, data: UpdateCategoryData) => {
      try {
        const response = await apiClient.updateCategory(id, data);

        toast({
          title: 'Thành công',
          description: 'Đã cập nhật danh mục',
        });

        await fetchCategories();
        return response;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Không thể cập nhật danh mục';
        toast({
          title: 'Lỗi',
          description: message,
          variant: 'destructive',
        });
        throw error;
      }
    },
    [fetchCategories, toast]
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      try {
        type DeleteCategoryResponse = {
          data?: { deleted?: boolean; message?: string };
          deleted?: boolean;
          message?: string;
        };

        const response = await apiClient.deleteCategory(id) as DeleteCategoryResponse;

        // Check if deletion was prevented due to associated products/subcategories
        if (response.data?.deleted === false || response.deleted === false) {
          toast({
            title: 'Không thể xóa',
            description: response.data?.message || response?.message || 'Danh mục không thể xóa',
            variant: 'destructive',
          });
          return response;
        }

        toast({
          title: 'Thành công',
          description: 'Đã xóa danh mục',
        });

        await fetchCategories();
        return response;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Không thể xóa danh mục';
        toast({
          title: 'Lỗi',
          description: message,
          variant: 'destructive',
        });
        throw error;
      }
    },
    [fetchCategories, toast]
  );

  const getCategoryById = useCallback(
    (id: string): Category | undefined => {
      return categories.find((cat) => cat.id === id);
    },
    [categories]
  );

  const getCategoryBySlug = useCallback(
    (slug: string): Category | undefined => {
      return categories.find((cat) => cat.slug === slug);
    },
    [categories]
  );

  const getChildCategories = useCallback(
    (parentId: string | null): Category[] => {
      return categories.filter((cat) => cat.parentId === parentId);
    },
    [categories]
  );

  const getParentCategory = useCallback(
    (category: Category): Category | undefined => {
      if (!category.parentId) return undefined;
      return categories.find((cat) => cat.id === category.parentId);
    },
    [categories]
  );

  const getCategoryTree = useCallback((): Category[] => {
    // Get all root categories (categories without parent)
    const rootCategories = categories.filter((cat) => !cat.parentId);

    // Recursively build tree structure
    const buildTree = (parentId: string | null): Category[] => {
      const children = categories.filter((cat) => cat.parentId === parentId);
      return children.map((child) => ({
        ...child,
        children: buildTree(child.id),
      }));
    };

    return rootCategories.map((root) => ({
      ...root,
      children: buildTree(root.id),
    }));
  }, [categories]);

  const toggleCategoryStatus = useCallback(
    async (id: string) => {
      const category = getCategoryById(id);
      if (!category) return;

      return updateCategory(id, { isActive: !category.isActive });
    },
    [getCategoryById, updateCategory]
  );

  return {
    categories,
    stats,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategoryBySlug,
    getChildCategories,
    getParentCategory,
    getCategoryTree,
    toggleCategoryStatus,
    refreshCategories: fetchCategories,
  };
}
