'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTable } from '@/components/ui/data-table';
import { useProducts, Product } from '@/lib/hooks/use-products';
import { parseImages } from '@/lib/utils';
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
 MoreHorizontal,
 ArrowUpDown,
 Eye,
 Edit,
 Trash2,
 Star,
 Package,
} from 'lucide-react';

interface ProductListProps {
 onViewProduct?: (product: Product) => void;
 onEditProduct?: (product: Product) => void;
 onDeleteProduct?: (product: Product) => void;
}

export function ProductList({  onViewProduct,  onEditProduct,  onDeleteProduct }: ProductListProps) {
 const { data: productsData, isLoading } = useProducts();

 const formatPrice = (price: number) => {
 return new Intl.NumberFormat('vi-VN', {
 style: 'currency',
 currency: 'VND',
 }).format(price);
 };

 const columns: ColumnDef<Product>[] = [
 {
 accessorKey: 'image',
 header: '',
 cell: ({ row }) => {
 const product = row.original;
 const images = parseImages(product.images, product.imageUrl);
 return (
 <Avatar className="h-10 w-10">
 <AvatarImage src={images.length > 0 ? images[0] : '/placeholder-product.svg'} alt={product.name} />
 <AvatarFallback>
 <Package className="h-4 w-4" />
 </AvatarFallback>
 </Avatar>
 );
 },
 },
 {
 accessorKey: 'name',
 header: ({ column }) => {
 return (
 <Button
 variant="ghost"
 onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
 className="h-auto p-0 font-semibold"
 >
 Tên sản phẩm
 <ArrowUpDown className="ml-2 h-4 w-4" />
 </Button>
 );
 },
 cell: ({ row }) => {
 const product = row.original;
 return (
 <div className="space-y-1">
 <div className="font-medium">{product.name}</div>
 <div className="text-sm text-muted-foreground line-clamp-1">
 {product.description}
 </div>
 </div>
 );
 },
 },
 {
 accessorKey: 'categoryId',
 header: 'Danh mục',
 cell: ({ row }) => {
 const categoryId = row.original.categoryId;
 return (
 <Badge variant="outline" className="font-normal">
 {categoryId || 'Chưa phân loại'}
 </Badge>
 );
 },
 },
 {
 accessorKey: 'priceCents',
 header: ({ column }) => {
 return (
 <Button
 variant="ghost"
 onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
 className="h-auto p-0 font-semibold"
 >
 Giá
 <ArrowUpDown className="ml-2 h-4 w-4" />
 </Button>
 );
 },
 cell: ({ row }) => {
 const priceCents = row.getValue('priceCents') as number;
 return <div className="font-medium">{formatPrice(priceCents)}</div>;
 },
 },
 {
 accessorKey: 'stockQuantity',
 header: 'Tồn kho',
 cell: ({ row }) => {
 const stockQuantity = row.getValue('stockQuantity') as number;
 const isLowStock = stockQuantity < 10;
  return (
 <div className="flex items-center space-x-2">
 <span className={isLowStock ? 'text-destructive font-medium' : ''}>
 {stockQuantity}
 </span>
 {isLowStock && (
 <Badge variant="destructive" className="text-xs">
 Sắp hết
 </Badge>
 )}
 </div>
 );
 },
 },
 {
 accessorKey: 'isActive',
 header: 'Trạng thái',
 cell: ({ row }) => {
 const isActive = row.getValue('isActive') as boolean;
 return (
 <Badge variant={isActive ? 'default' : 'secondary'}>
 {isActive ? 'Hoạt động' : 'Tạm dừng'}
 </Badge>
 );
 },
 },
 {
 accessorKey: 'createdAt',
 header: ({ column }) => {
 return (
 <Button
 variant="ghost"
 onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
 className="h-auto p-0 font-semibold"
 >
 Ngày tạo
 <ArrowUpDown className="ml-2 h-4 w-4" />
 </Button>
 );
 },
 cell: ({ row }) => {
 const date = new Date(row.getValue('createdAt') as string);
 return <div>{date.toLocaleDateString('vi-VN')}</div>;
 },
 },
 {
 id: 'actions',
 header: 'Hành động',
 cell: ({ row }) => {
 const product = row.original;

 return (
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button variant="ghost" className="h-8 w-8 p-0">
 <span className="sr-only">Mở menu</span>
 <MoreHorizontal className="h-4 w-4" />
 </Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end">
 <DropdownMenuLabel>Hành động</DropdownMenuLabel>
 <DropdownMenuSeparator />
 <DropdownMenuItem
 onClick={() => onViewProduct?.(product)}
 className="cursor-pointer"
 >
 <Eye className="mr-2 h-4 w-4" />
 Xem chi tiết
 </DropdownMenuItem>
 <DropdownMenuItem
 onClick={() => onEditProduct?.(product)}
 className="cursor-pointer"
 >
 <Edit className="mr-2 h-4 w-4" />
 Chỉnh sửa
 </DropdownMenuItem>
 <DropdownMenuSeparator />
 <DropdownMenuItem
 onClick={() => onDeleteProduct?.(product)}
 className="cursor-pointer text-destructive"
 >
 <Trash2 className="mr-2 h-4 w-4" />
 Xóa sản phẩm
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 );
 },
 },
 ];

 return (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-2xl font-bold tracking-tight">Danh sách sản phẩm</h2>
 <p className="text-muted-foreground">
 Quản lý tất cả sản phẩm trong hệ thống
 </p>
 </div>
 <Button>
 <Star className="mr-2 h-4 w-4" />
 Thêm sản phẩm
 </Button>
 </div>

 <DataTable
 columns={columns}
 data={productsData?.products || []}
 loading={isLoading}
 searchKey="name"
 searchPlaceholder="Tìm kiếm sản phẩm..."
 pageSize={10}
 onRowClick={(product) => onViewProduct?.(product)}
 />
 </div>
 );
}