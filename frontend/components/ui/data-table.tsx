'use client';

import React from 'react';
import {
 ColumnDef,
 flexRender,
 getCoreRowModel,
 getFilteredRowModel,
 getPaginationRowModel,
 getSortedRowModel,
 useReactTable,
 SortingState,
 ColumnFiltersState,
 VisibilityState,
} from '@tanstack/react-table';

import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
 DropdownMenu,
 DropdownMenuCheckboxItem,
 DropdownMenuContent,
 DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
 ChevronDown,
 ChevronLeft,
 ChevronRight,
 ChevronsLeft,
 ChevronsRight,
 Settings2,
 Search,
 X,
} from 'lucide-react';

interface DataTableProps<TData, TValue> {
 columns: ColumnDef<TData, TValue>[];
 data: TData[];
 loading?: boolean;
 searchKey?: string;
 searchPlaceholder?: string;
 pageSize?: number;
 showPagination?: boolean;
 showColumnToggle?: boolean;
 showSearch?: boolean;
 onRowClick?: (row: TData) => void;
 className?: string;
}

export function DataTable<TData, TValue>({
 columns,
 data,
 loading = false,
 searchKey = '',
 searchPlaceholder = 'Tìm kiếm...',
 pageSize = 10,
 showPagination = true,
 showColumnToggle = true,
 showSearch = true,
 onRowClick,
 className = '',
}: DataTableProps<TData, TValue>) {
 const [sorting, setSorting] = React.useState<SortingState>([]);
 const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
 const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
 const [globalFilter, setGlobalFilter] = React.useState('');

 // eslint-disable-next-line react-hooks/incompatible-library
 const table = useReactTable({
 data,
 columns,
 onSortingChange: setSorting,
 onColumnFiltersChange: setColumnFilters,
 getCoreRowModel: getCoreRowModel(),
 getPaginationRowModel: getPaginationRowModel(),
 getSortedRowModel: getSortedRowModel(),
 getFilteredRowModel: getFilteredRowModel(),
 onColumnVisibilityChange: setColumnVisibility,
 onGlobalFilterChange: setGlobalFilter,
 globalFilterFn: 'includesString',
 state: {
 sorting,
 columnFilters,
 columnVisibility,
 globalFilter,
 pagination: {
 pageIndex: 0,
 pageSize,
 },
 },
 });

 const clearFilters = () => {
 setGlobalFilter('');
 setColumnFilters([]);
 };

 const hasActiveFilters = globalFilter || columnFilters.length > 0;

 if (loading) {
 return (
 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <Skeleton className="h-10 w-[300px]" />
 <Skeleton className="h-10 w-[100px]" />
 </div>
 <div className="rounded-md border">
 <div className="h-12 border-b bg-muted/50">
 <Skeleton className="h-full w-full" />
 </div>
 {Array.from({ length: pageSize }).map((_, index) => (
 <div key={index} className="h-14 border-b last:border-0">
 <Skeleton className="h-full w-full" />
 </div>
 ))}
 </div>
 </div>
 );
 }

 return (
 <div className={`space-y-4 ${className}`}>
 {/* Toolbar */}
 <div className="flex items-center justify-between space-x-2">
 <div className="flex items-center space-x-2">
 {/* Global Search */}
 {showSearch && (
 <div className="relative">
 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
 <Input
 placeholder={searchPlaceholder}
 value={globalFilter ?? ''}
 onChange={(e) => setGlobalFilter(String(e.target.value))}
 className="pl-8 w-[300px]"
 />
 {globalFilter && (
 <Button
 variant="ghost"
 size="sm"
 className="absolute right-0 top-0 h-full px-3"
 onClick={() => setGlobalFilter('')}
 >
 <X className="h-4 w-4" />
 </Button>
 )}
 </div>
 )}

 {/* Column Search */}
 {searchKey && (
 <Input
 placeholder={`Lọc theo ${searchKey}...`}
 value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
 onChange={(e) =>
 table.getColumn(searchKey)?.setFilterValue(e.target.value)
 }
 className="max-w-sm"
 />
 )}

 {/* Clear Filters */}
 {hasActiveFilters && (
 <Button variant="outline" size="sm" onClick={clearFilters}>
 Xóa bộ lọc
 <X className="ml-2 h-4 w-4" />
 </Button>
 )}
 </div>

 {/* Column Toggle */}
 {showColumnToggle && (
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button variant="outline" size="sm" className="ml-auto">
 <Settings2 className="mr-2 h-4 w-4" />
 Cột hiển thị
 <ChevronDown className="ml-2 h-4 w-4" />
 </Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end" className="w-[180px]">
 {table
 .getAllColumns()
 .filter((column) => column.getCanHide())
 .map((column) => {
 return (
 <DropdownMenuCheckboxItem
 key={column.id}
 className="capitalize"
 checked={column.getIsVisible()}
 onCheckedChange={(value) =>
 column.toggleVisibility(!!value)
 }
 >
 {column.id}
 </DropdownMenuCheckboxItem>
 );
 })}
 </DropdownMenuContent>
 </DropdownMenu>
 )}
 </div>

 {/* Active Filters */}
 {hasActiveFilters && (
 <div className="flex flex-wrap items-center gap-2">
 <span className="text-sm text-muted-foreground">Đang lọc:</span>
 {globalFilter && (
 <Badge variant="secondary" className="gap-1">
 Tìm kiếm: {globalFilter}
 <Button
 variant="ghost"
 size="sm"
 className="h-auto p-0 text-muted-foreground hover:text-foreground"
 onClick={() => setGlobalFilter('')}
 >
 <X className="h-3 w-3" />
 </Button>
 </Badge>
 )}
 {columnFilters.map((filter) => (
 <Badge key={filter.id} variant="secondary" className="gap-1">
 {filter.id}: {String(filter.value)}
 <Button
 variant="ghost"
 size="sm"
 className="h-auto p-0 text-muted-foreground hover:text-foreground"
 onClick={() =>
 table.getColumn(filter.id)?.setFilterValue(undefined)
 }
 >
 <X className="h-3 w-3" />
 </Button>
 </Badge>
 ))}
 </div>
 )}

 {/* Table */}
 <div className="rounded-md border bg-background">
 <Table>
 <TableHeader>
 {table.getHeaderGroups().map((headerGroup) => (
 <TableRow key={headerGroup.id} className="hover:bg-transparent">
 {headerGroup.headers.map((header) => {
 return (
 <TableHead key={header.id} className="h-12">
 {header.isPlaceholder
 ? null
 : flexRender(
 header.column.columnDef.header,
 header.getContext()
 )}
 </TableHead>
 );
 })}
 </TableRow>
 ))}
 </TableHeader>
 <TableBody>
 {table.getRowModel().rows?.length ? (
 table.getRowModel().rows.map((row) => (
 <TableRow
 key={row.id}
 data-state={row.getIsSelected() && 'selected'}
 className={onRowClick ? 'cursor-pointer' : ''}
 onClick={() => onRowClick?.(row.original)}
 >
 {row.getVisibleCells().map((cell) => (
 <TableCell key={cell.id}>
 {flexRender(
 cell.column.columnDef.cell,
 cell.getContext()
 )}
 </TableCell>
 ))}
 </TableRow>
 ))
 ) : (
 <TableRow>
 <TableCell
 colSpan={columns.length}
 className="h-24 text-center"
 >
 Không có dữ liệu.
 </TableCell>
 </TableRow>
 )}
 </TableBody>
 </Table>
 </div>

 {/* Pagination */}
 {showPagination && (
 <div className="flex items-center justify-between space-x-2">
 <div className="flex items-center space-x-2">
 <p className="text-sm text-muted-foreground">
 Hiển thị{' '}
 <span className="font-medium">
 {table.getState().pagination.pageIndex * pageSize + 1}
 </span>{' '}
 đến{' '}
 <span className="font-medium">
 {Math.min(
 (table.getState().pagination.pageIndex + 1) * pageSize,
 table.getFilteredRowModel().rows.length
 )}
 </span>{' '}
 trong tổng số{' '}
 <span className="font-medium">
 {table.getFilteredRowModel().rows.length}
 </span>{' '}
 kết quả
 </p>
 <Select
 value={`${table.getState().pagination.pageSize}`}
 onValueChange={(value) => {
 table.setPageSize(Number(value));
 }}
 >
 <SelectTrigger className="h-8 w-[70px]">
 <SelectValue placeholder={table.getState().pagination.pageSize} />
 </SelectTrigger>
 <SelectContent side="top">
 {[10, 20, 30, 40, 50].map((pageSize) => (
 <SelectItem key={pageSize} value={`${pageSize}`}>
 {pageSize}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>
 <div className="flex items-center space-x-2">
 <Button
 variant="outline"
 size="sm"
 onClick={() => table.setPageIndex(0)}
 disabled={!table.getCanPreviousPage()}
 >
 <ChevronsLeft className="h-4 w-4" />
 </Button>
 <Button
 variant="outline"
 size="sm"
 onClick={() => table.previousPage()}
 disabled={!table.getCanPreviousPage()}
 >
 <ChevronLeft className="h-4 w-4" />
 </Button>
 <div className="flex items-center space-x-1">
 <span className="text-sm text-muted-foreground">Trang</span>
 <span className="text-sm font-medium">
 {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
 </span>
 </div>
 <Button
 variant="outline"
 size="sm"
 onClick={() => table.nextPage()}
 disabled={!table.getCanNextPage()}
 >
 <ChevronRight className="h-4 w-4" />
 </Button>
 <Button
 variant="outline"
 size="sm"
 onClick={() => table.setPageIndex(table.getPageCount() - 1)}
 disabled={!table.getCanNextPage()}
 >
 <ChevronsRight className="h-4 w-4" />
 </Button>
 </div>
 </div>
 )}
 </div>
 );
}
