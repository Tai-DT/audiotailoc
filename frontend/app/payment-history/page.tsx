'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
 CreditCard,
 Eye,
 Search,
 DollarSign,
 CheckCircle,
 XCircle,
 Clock,
 Receipt
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyPayments, PaymentRecord } from '@/lib/hooks/use-payments';

// Map backend status to UI status
const mapStatus = (status: string): 'SUCCESS' | 'FAILED' | 'PENDING' | 'CANCELLED' => {
 switch (status) {
 case 'SUCCEEDED': return 'SUCCESS';
 case 'FAILED': return 'FAILED';
 case 'REFUNDED': return 'CANCELLED';
 case 'PENDING':
 default: return 'PENDING';
 }
};

export default function PaymentHistoryPage() {
 const { data: paymentsData, isLoading, error } = useMyPayments();
 const [searchQuery, setSearchQuery] = useState('');
 const [statusFilter, setStatusFilter] = useState<string>('all');
 const [dateFilter, setDateFilter] = useState<string>('all');
 const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);

 const payments = paymentsData || [];

 const filteredPayments = payments.filter(payment => {
 const matchesSearch = payment.orderNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 payment.description?.toLowerCase().includes(searchQuery.toLowerCase());

 const uiStatus = mapStatus(payment.status);
 const matchesStatus = statusFilter === 'all' || uiStatus === statusFilter;
 const matchesDate = dateFilter === 'all' || checkDateFilter(payment.createdAt, dateFilter);

 return matchesSearch && matchesStatus && matchesDate;
 });

 const checkDateFilter = (dateString: string, filter: string) => {
 const date = new Date(dateString);
 const now = new Date();

 switch (filter) {
 case 'today':
 return date.toDateString() === now.toDateString();
 case 'week':
 const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
 return date >= weekAgo;
 case 'month':
 const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
 return date >= monthAgo;
 default:
 return true;
 }
 };

 const getStatusBadge = (status: string) => {
 const uiStatus = mapStatus(status);
 switch (uiStatus) {
 case 'SUCCESS':
 return <Badge className="bg-success">Thành công</Badge>;
 case 'FAILED':
 return <Badge variant="destructive">Thất bại</Badge>;
 case 'PENDING':
 return <Badge className="bg-yellow-500">Đang xử lý</Badge>;
 case 'CANCELLED':
 return <Badge variant="secondary">Đã hoàn tiền</Badge>;
 default:
 return <Badge variant="outline">{status}</Badge>;
 }
 };

 const getStatusIcon = (status: string) => {
 const uiStatus = mapStatus(status);
 switch (uiStatus) {
 case 'SUCCESS':
 return <CheckCircle className="h-4 w-4 text-success" />;
 case 'FAILED':
 return <XCircle className="h-4 w-4 text-destructive" />;
 case 'PENDING':
 return <Clock className="h-4 w-4 text-warning" />;
 case 'CANCELLED':
 return <XCircle className="h-4 w-4 text-muted-foreground" />;
 default:
 return <Clock className="h-4 w-4 text-muted-foreground" />;
 }
 };

 const totalAmount = filteredPayments
 .filter(p => mapStatus(p.status) === 'SUCCESS')
 .reduce((sum, payment) => sum + (payment.amount || 0), 0);

 if (isLoading) {
 return (
 <div className="container mx-auto px-4 py-8">
 <Skeleton className="h-10 w-64 mb-8" />
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
 {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24" />)}
 </div>
 <Skeleton className="h-64 w-full" />
 </div>
 );
 }

 if (error) {
 return (
 <div className="container mx-auto px-4 py-8">
 <div className="text-center py-12">
 <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
 <h3 className="text-lg font-semibold mb-2">Không thể tải lịch sử thanh toán</h3>
 <p className="text-muted-foreground">Vui lòng thử lại sau</p>
 </div>
 </div>
 );
 }

 return (
 <div className="container mx-auto px-4 py-8">
 {/* Header */}
 <div className="mb-8">
 <h1 className="text-3xl font-bold mb-4">Lịch sử thanh toán</h1>
 <p className="text-muted-foreground">
 Theo dõi và quản lý tất cả giao dịch thanh toán của bạn
 </p>
 </div>

 {/* Summary Cards */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
 <Card>
 <CardContent className="p-6">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-blue-100 rounded-full">
 <Receipt className="h-6 w-6 text-primary" />
 </div>
 <div>
 <p className="text-sm font-medium text-muted-foreground">Tổng giao dịch</p>
 <p className="text-2xl font-bold">{filteredPayments.length}</p>
 </div>
 </div>
 </CardContent>
 </Card>

 <Card>
 <CardContent className="p-6">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-green-100 rounded-full">
 <CheckCircle className="h-6 w-6 text-success" />
 </div>
 <div>
 <p className="text-sm font-medium text-muted-foreground">Thành công</p>
 <p className="text-2xl font-bold">
 {filteredPayments.filter(p => mapStatus(p.status) === 'SUCCESS').length}
 </p>
 </div>
 </div>
 </CardContent>
 </Card>

 <Card>
 <CardContent className="p-6">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-purple-100 rounded-full">
 <DollarSign className="h-6 w-6 text-purple-600" />
 </div>
 <div>
 <p className="text-sm font-medium text-muted-foreground">Tổng tiền</p>
 <p className="text-2xl font-bold">{totalAmount.toLocaleString('vi-VN')}₫</p>
 </div>
 </div>
 </CardContent>
 </Card>
 </div>

 {/* Filters */}
 <Card className="mb-6">
 <CardContent className="p-6">
 <div className="flex flex-col lg:flex-row gap-4">
 <div className="flex-1">
 <div className="relative">
 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
 <Input
 placeholder="Tìm kiếm theo mã đơn hàng..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="pl-10"
 />
 </div>
 </div>

 <Select value={statusFilter} onValueChange={setStatusFilter}>
 <SelectTrigger className="w-full lg:w-48">
 <SelectValue placeholder="Trạng thái" />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="all">Tất cả trạng thái</SelectItem>
 <SelectItem value="SUCCESS">Thành công</SelectItem>
 <SelectItem value="PENDING">Đang xử lý</SelectItem>
 <SelectItem value="FAILED">Thất bại</SelectItem>
 <SelectItem value="CANCELLED">Đã hoàn tiền</SelectItem>
 </SelectContent>
 </Select>

 <Select value={dateFilter} onValueChange={setDateFilter}>
 <SelectTrigger className="w-full lg:w-48">
 <SelectValue placeholder="Thời gian" />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="all">Tất cả thời gian</SelectItem>
 <SelectItem value="today">Hôm nay</SelectItem>
 <SelectItem value="week">Tuần này</SelectItem>
 <SelectItem value="month">Tháng này</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </CardContent>
 </Card>

 {/* Payments Table */}
 <Card>
 <CardHeader>
 <CardTitle>Danh sách thanh toán</CardTitle>
 </CardHeader>
 <CardContent>
 <div className="overflow-x-auto">
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>Mã đơn hàng</TableHead>
 <TableHead>Thời gian</TableHead>
 <TableHead>Số tiền</TableHead>
 <TableHead>Phương thức</TableHead>
 <TableHead>Trạng thái</TableHead>
 <TableHead className="text-right">Thao tác</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {filteredPayments.map((payment) => (
 <TableRow key={payment.id}>
 <TableCell className="font-medium">
 {payment.orderNo || payment.orderId}
 </TableCell>
 <TableCell>
 {format(new Date(payment.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
 </TableCell>
 <TableCell>
 {(payment.amount || 0).toLocaleString('vi-VN')}₫
 </TableCell>
 <TableCell>
 <div className="flex items-center gap-2">
 <CreditCard className="h-4 w-4" />
 {payment.provider}
 </div>
 </TableCell>
 <TableCell>
 <div className="flex items-center gap-2">
 {getStatusIcon(payment.status)}
 {getStatusBadge(payment.status)}
 </div>
 </TableCell>
 <TableCell className="text-right">
 <Dialog>
 <DialogTrigger asChild>
 <Button
 variant="ghost"
 size="sm"
 onClick={() => setSelectedPayment(payment)}
 >
 <Eye className="h-4 w-4" />
 </Button>
 </DialogTrigger>
 <DialogContent className="max-w-2xl">
 <DialogHeader>
 <DialogTitle>Chi tiết thanh toán</DialogTitle>
 </DialogHeader>
 {selectedPayment && (
 <div className="space-y-6">
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="text-sm font-medium text-muted-foreground">Mã đơn hàng</label>
 <p className="font-medium">{selectedPayment.orderNo || selectedPayment.orderId}</p>
 </div>
 <div>
 <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
 <div className="flex items-center gap-2 mt-1">
 {getStatusIcon(selectedPayment.status)}
 {getStatusBadge(selectedPayment.status)}
 </div>
 </div>
 <div>
 <label className="text-sm font-medium text-muted-foreground">Số tiền</label>
 <p className="font-medium text-lg">
 {(selectedPayment.amount || 0).toLocaleString('vi-VN')}₫
 </p>
 </div>
 <div>
 <label className="text-sm font-medium text-muted-foreground">Phương thức</label>
 <p className="font-medium">{selectedPayment.provider}</p>
 </div>
 <div>
 <label className="text-sm font-medium text-muted-foreground">Thời gian</label>
 <p className="font-medium">
 {format(new Date(selectedPayment.createdAt), 'dd/MM/yyyy HH:mm:ss', { locale: vi })}
 </p>
 </div>
 {selectedPayment.transactionId && (
 <div>
 <label className="text-sm font-medium text-muted-foreground">Mã giao dịch</label>
 <p className="font-medium font-mono text-sm">{selectedPayment.transactionId}</p>
 </div>
 )}
 </div>

 <Separator />

 <div>
 <label className="text-sm font-medium text-muted-foreground">Mô tả</label>
 <p className="mt-1">{selectedPayment.description}</p>
 </div>
 </div>
 )}
 </DialogContent>
 </Dialog>
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 </div>

 {filteredPayments.length === 0 && (
 <div className="text-center py-12">
 <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
 <h3 className="text-lg font-semibold mb-2">Không có giao dịch nào</h3>
 <p className="text-muted-foreground">
 Bạn chưa có giao dịch thanh toán nào trong khoảng thời gian này.
 </p>
 </div>
 )}
 </CardContent>
 </Card>
 </div>
 );
}