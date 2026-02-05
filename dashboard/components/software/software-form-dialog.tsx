"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Software, SoftwareFormData } from "@/types/software";

interface SoftwareFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SoftwareFormData) => Promise<void>;
  initialData?: Software | null;
}

const emptyForm: SoftwareFormData = {
  name: "",
  category: "",
  platform: "",
  description: "",
  version: "",
  downloadUrl: "",
  websiteUrl: "",
  imageUrl: "",
  features: "",
  productId: "",
  priceCents: 0,
  isPaidRequired: false,
  isActive: true,
};

function buildInitialForm(initialData?: Software | null): SoftwareFormData {
  if (!initialData) return { ...emptyForm };
  return {
    ...emptyForm,
    name: initialData.name,
    slug: initialData.slug,
    description: initialData.description || "",
    category: initialData.category,
    platform: initialData.platform,
    version: initialData.version || "",
    priceCents: Number(initialData.priceCents || 0),
    isPaidRequired: Boolean(initialData.isPaidRequired),
    downloadUrl: initialData.downloadUrl || "",
    websiteUrl: initialData.websiteUrl || "",
    imageUrl: initialData.imageUrl || "",
    features: initialData.features || "",
    productId: initialData.productId || "",
    isActive: initialData.isActive,
  };
}

export function SoftwareFormDialog({ open, onOpenChange, onSubmit, initialData }: SoftwareFormDialogProps) {
  const isEdit = Boolean(initialData?.id);
  const key = `${open ? "open" : "closed"}:${initialData?.id ?? "new"}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <SoftwareFormDialogInner
          key={key}
          isEdit={isEdit}
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function SoftwareFormDialogInner({
  isEdit,
  initialData,
  onSubmit,
  onCancel,
}: {
  isEdit: boolean;
  initialData?: Software | null;
  onSubmit: (data: SoftwareFormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<SoftwareFormData>(() => buildInitialForm(initialData));

  const canSubmit = useMemo(() => {
    return form.name.trim().length > 0 && form.category.trim().length > 0 && form.platform.trim().length > 0;
  }, [form]);

  const handleChange = (field: keyof SoftwareFormData, value: string | boolean | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await onSubmit({
      ...form,
      priceCents: Number(form.priceCents || 0),
      isPaidRequired: Boolean(form.isPaidRequired),
      isActive: form.isActive !== false,
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Cập nhật phần mềm" : "Thêm phần mềm"}</DialogTitle>
        <DialogDescription>
          Nhập thông tin phần mềm. Với link Google Drive, hãy dùng link chia sẻ (Anyone with link).
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tên phần mềm</Label>
          <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Slug (tùy chọn)</Label>
          <Input value={form.slug || ""} onChange={(e) => handleChange("slug", e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Danh mục</Label>
          <Input value={form.category} onChange={(e) => handleChange("category", e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Nền tảng</Label>
          <Input value={form.platform} onChange={(e) => handleChange("platform", e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Phiên bản</Label>
          <Input value={form.version || ""} onChange={(e) => handleChange("version", e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Giá (VND * 100)</Label>
          <Input
            type="number"
            value={form.priceCents || 0}
            onChange={(e) => handleChange("priceCents", Number(e.target.value))}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Mô tả</Label>
          <Textarea rows={3} value={form.description || ""} onChange={(e) => handleChange("description", e.target.value)} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Tính năng</Label>
          <Textarea rows={3} value={form.features || ""} onChange={(e) => handleChange("features", e.target.value)} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Link Google Drive / Download</Label>
          <Input value={form.downloadUrl || ""} onChange={(e) => handleChange("downloadUrl", e.target.value)} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Link Website</Label>
          <Input value={form.websiteUrl || ""} onChange={(e) => handleChange("websiteUrl", e.target.value)} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Image URL</Label>
          <Input value={form.imageUrl || ""} onChange={(e) => handleChange("imageUrl", e.target.value)} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Liên kết Product ID (dành cho bán)</Label>
          <Input value={form.productId || ""} onChange={(e) => handleChange("productId", e.target.value)} />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <Label>Yêu cầu mua</Label>
            <p className="text-xs text-muted-foreground">Bật để chỉ khách đã mua mới tải được</p>
          </div>
          <Switch checked={Boolean(form.isPaidRequired)} onCheckedChange={(val) => handleChange("isPaidRequired", val)} />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <Label>Trạng thái</Label>
            <p className="text-xs text-muted-foreground">Hiển thị trên website</p>
          </div>
          <Switch checked={form.isActive !== false} onCheckedChange={(val) => handleChange("isActive", val)} />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button disabled={!canSubmit} onClick={handleSubmit}>
          {isEdit ? "Lưu" : "Tạo mới"}
        </Button>
      </DialogFooter>
    </>
  );
}
