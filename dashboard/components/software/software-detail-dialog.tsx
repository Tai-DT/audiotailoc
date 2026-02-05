"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Software } from "@/types/software";

interface SoftwareDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  software: Software | null;
}

export function SoftwareDetailDialog({ open, onOpenChange, software }: SoftwareDetailDialogProps) {
  if (!software) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{software.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge>{software.category}</Badge>
            <Badge variant="outline">{software.platform}</Badge>
            {software.version && <Badge variant="secondary">{software.version}</Badge>}
            {software.isPaidRequired ? <Badge variant="destructive">Có phí</Badge> : <Badge variant="default">Miễn phí</Badge>}
            {software.isActive ? <Badge variant="default">Hoạt động</Badge> : <Badge variant="outline">Ẩn</Badge>}
          </div>

          {software.description && (
            <div>
              <div className="text-xs uppercase text-muted-foreground">Mô tả</div>
              <div className="text-sm whitespace-pre-line">{software.description}</div>
            </div>
          )}

          {software.features && (
            <div>
              <div className="text-xs uppercase text-muted-foreground">Tính năng</div>
              <div className="text-sm whitespace-pre-line">{software.features}</div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Download URL:</span>
              <div className="break-all">{software.downloadUrl || '-'}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Website URL:</span>
              <div className="break-all">{software.websiteUrl || '-'}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Image URL:</span>
              <div className="break-all">{software.imageUrl || '-'}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Product ID:</span>
              <div className="break-all">{software.productId || '-'}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
