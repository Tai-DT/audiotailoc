import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'file' | 'image';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  multiple?: boolean;
  accept?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
}

export interface FormModalProps {
  title: string;
  description?: string;
  trigger?: React.ReactNode;
  fields: FormField[];
  data?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function FormModal({
  title,
  description,
  trigger,
  fields,
  data = {},
  onSubmit,
  onCancel,
  loading = false,
  size = 'md',
  open,
  onOpenChange,
}: FormModalProps) {
  const [isOpen, setIsOpen] = useState(open || false);
  const [formData, setFormData] = useState<Record<string, any>>(data);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [files, setFiles] = useState<Record<string, File[]>>({});

  useEffect(() => {
    setFormData(data);
    setErrors({});
    setTouched({});
    setFiles({});
  }, [data]);

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
    if (!newOpen) {
      onCancel?.();
    }
  };

  const validateField = (name: string, value: any): string | null => {
    const field = fields.find(f => f.name === name);
    if (!field) return null;

    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return `${field.label} là bắt buộc`;
    }

    if (field.validation) {
      const { minLength, maxLength, pattern, custom } = field.validation;

      if (minLength && value && value.length < minLength) {
        return `${field.label} phải có ít nhất ${minLength} ký tự`;
      }

      if (maxLength && value && value.length > maxLength) {
        return `${field.label} không được vượt quá ${maxLength} ký tự`;
      }

      if (pattern && value && !pattern.test(value)) {
        return `${field.label} không đúng định dạng`;
      }

      if (custom) {
        const customError = custom(value);
        if (customError) return customError;
      }
    }

    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleFieldChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error || '' }));
    }
  };

  const handleFieldBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error || '' }));
  };

  const handleFileChange = (name: string, fileList: FileList | null) => {
    if (!fileList) return;

    const filesArray = Array.from(fileList);
    setFiles(prev => ({ ...prev, [name]: filesArray }));

    // For single file, store the first file
    const field = fields.find(f => f.name === name);
    if (!field?.multiple) {
      setFormData(prev => ({ ...prev, [name]: filesArray[0] || null }));
    } else {
      setFormData(prev => ({ ...prev, [name]: filesArray }));
    }
  };

  const removeFile = (fieldName: string, index: number) => {
    const field = fields.find(f => f.name === fieldName);
    if (field?.multiple) {
      const newFiles = [...(files[fieldName] || [])];
      newFiles.splice(index, 1);
      setFiles(prev => ({ ...prev, [fieldName]: newFiles }));
      setFormData(prev => ({ ...prev, [fieldName]: newFiles }));
    } else {
      setFiles(prev => ({ ...prev, [fieldName]: [] }));
      setFormData(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      setIsOpen(false);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name];
    const error = errors[field.name];
    const fieldFiles = files[field.name] || [];

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            id={field.name}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            onBlur={() => handleFieldBlur(field.name)}
            className={error ? 'border-red-500' : ''}
          />
        );

      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={(newValue) => handleFieldChange(field.name, newValue)}
          >
            <SelectTrigger className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={value || false}
              onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
            />
            <Label htmlFor={field.name} className="text-sm font-normal">
              {field.label}
            </Label>
          </div>
        );

      case 'file':
      case 'image':
        return (
          <div className="space-y-2">
            <Input
              id={field.name}
              type="file"
              accept={field.accept}
              multiple={field.multiple}
              onChange={(e) => handleFileChange(field.name, e.target.files)}
              className={error ? 'border-red-500' : ''}
            />

            {fieldFiles.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {fieldFiles.map((file, index) => (
                  <div key={index} className="relative">
                    {field.type === 'image' && (
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-20 object-cover rounded"
                      />
                    )}
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removeFile(field.name, index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {value && !fieldFiles.length && typeof value === 'string' && (
              <div className="text-sm text-gray-600">
                File hiện tại: {value}
              </div>
            )}
          </div>
        );

      default:
        return (
          <Input
            id={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            onBlur={() => handleFieldBlur(field.name)}
            className={error ? 'border-red-500' : ''}
          />
        );
    }
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={sizeClasses[size]}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              {field.type !== 'checkbox' && (
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
              )}
              {renderField(field)}
              {errors[field.name] && (
                <p className="text-sm text-red-600">{errors[field.name]}</p>
              )}
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}