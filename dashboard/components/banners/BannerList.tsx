"use client"

import { Banner } from "@/types/banner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import
  {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import
  {
    Edit,
    Trash2,
    ExternalLink,
    Image as ImageIcon
  } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface BannerListProps
{
  banners: Banner[]
  loading: boolean
  onEdit: ( banner: Banner ) => void
  onDelete: ( id: string ) => void
}

export function BannerList ( {
  banners,
  loading,
  onEdit,
  onDelete
}: BannerListProps )
{
  if ( loading )
  {
    return (
      <div className="space-y-2">
        {[ ...Array( 5 ) ].map( ( _, i ) => (
          <Skeleton key={i} className="h-12 w-full" />
        ) )}
      </div>
    )
  }

  if ( banners.length === 0 )
  {
    return (
      <div className="text-center py-8">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">Chưa có banner nào</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Hình ảnh</TableHead>
          <TableHead>Tiêu đề</TableHead>
          <TableHead>Trang</TableHead>
          <TableHead>Vị trí</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {banners.map( ( banner ) => (
          <TableRow key={banner.id}>
            <TableCell>
              <div className="w-20 h-12 bg-gray-100 rounded overflow-hidden">
                {/* Use a plain <img> here to avoid Next/Image remote host restrictions in admin UI */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.imageUrl || "https://via.placeholder.com/80x48?text=No+Image"}
                  alt={banner.title}
                  width={80}
                  height={48}
                  className="w-full h-full object-cover"
                  onError={( e ) =>
                  {
                    e.currentTarget.src = "https://via.placeholder.com/80x48"
                  }}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p className="font-medium">{banner.title}</p>
                {banner.subtitle && (
                  <p className="text-sm text-gray-500">{banner.subtitle}</p>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{banner.page}</Badge>
            </TableCell>
            <TableCell>{banner.position}</TableCell>
            <TableCell>
              <Badge variant={banner.isActive ? "default" : "secondary"}>
                {banner.isActive ? "Hoạt động" : "Tắt"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                {banner.linkUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open( banner.linkUrl!, '_blank' )}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit( banner )}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                  {
                    if ( confirm( 'Bạn có chắc muốn xóa banner này?' ) )
                    {
                      onDelete( banner.id )
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ) )}
      </TableBody>
    </Table>
  )
}
