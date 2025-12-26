"use client"

import { Badge } from "@/components/ui/badge"
import
  {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"

interface User
{
  id: string
  email: string
  name: string
  phone?: string
  role: string
  createdAt: string
  address?: string
  dateOfBirth?: string
  gender?: string
  isActive?: boolean
  emailNotifications?: boolean
  smsNotifications?: boolean
  promoNotifications?: boolean
  _count?: {
    orders: number
  }
}

interface UserDetailsDialogProps
{
  open: boolean
  onOpenChange: ( open: boolean ) => void
  user: User | null
}

export function UserDetailsDialog ( { open, onOpenChange, user }: UserDetailsDialogProps )
{
  if ( !user ) return null

  const formatDate = ( dateString: string ) =>
  {
    return new Date( dateString ).toLocaleDateString( 'vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    } )
  }

  const getRoleBadgeVariant = ( role: string ) =>
  {
    switch ( role )
    {
      case 'ADMIN':
        return 'destructive'
      case 'MANAGER':
        return 'default'
      case 'USER':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chi tiết người dùng</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về người dùng
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">ID:</span>
            <span className="col-span-2 text-sm text-muted-foreground">{user.id}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Tên:</span>
            <span className="col-span-2">{user.name}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Email:</span>
            <span className="col-span-2">{user.email}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Số điện thoại:</span>
            <span className="col-span-2">{user.phone || 'Chưa cập nhật'}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Giới tính:</span>
            <span className="col-span-2">{user.gender === 'MALE' ? 'Nam' : user.gender === 'FEMALE' ? 'Nữ' : user.gender === 'OTHER' ? 'Khác' : 'Chưa cập nhật'}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Ngày sinh:</span>
            <span className="col-span-2">{user.dateOfBirth ? new Date( user.dateOfBirth ).toLocaleDateString( 'vi-VN' ) : 'Chưa cập nhật'}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Địa chỉ:</span>
            <span className="col-span-2">{user.address || 'Chưa cập nhật'}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Vai trò:</span>
            <div className="col-span-2">
              <Badge variant={getRoleBadgeVariant( user.role )}>
                {user.role}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Trạng thái:</span>
            <div className="col-span-2">
              <Badge variant={user.isActive ? 'default' : 'secondary'}>
                {user.isActive ? 'Hoạt động' : 'Tạm khóa'}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 items-center gap-4 border-t pt-2">
            <span className="font-medium">Thông báo:</span>
            <div className="col-span-2 flex flex-wrap gap-2">
              <Badge variant={user.emailNotifications ? 'outline' : 'secondary'} className={user.emailNotifications ? 'border-green-500 text-green-700' : ''}>
                Email: {user.emailNotifications ? 'Bật' : 'Tắt'}
              </Badge>
              <Badge variant={user.smsNotifications ? 'outline' : 'secondary'} className={user.smsNotifications ? 'border-green-500 text-green-700' : ''}>
                SMS: {user.smsNotifications ? 'Bật' : 'Tắt'}
              </Badge>
              <Badge variant={user.promoNotifications ? 'outline' : 'secondary'} className={user.promoNotifications ? 'border-green-500 text-green-700' : ''}>
                Khuyến mãi: {user.promoNotifications ? 'Bật' : 'Tắt'}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 items-center gap-4 border-t pt-2">
            <span className="font-medium">Số đơn hàng:</span>
            <span className="col-span-2">{user._count?.orders || 0}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4 border-t pt-2">
            <span className="font-medium">Ngày tạo:</span>
            <span className="col-span-2">{formatDate( user.createdAt )}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
