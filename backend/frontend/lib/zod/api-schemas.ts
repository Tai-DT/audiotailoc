import { z } from 'zod'

// Product schemas
export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  priceCents: z.number(),
  categoryId: z.string().nullable(),
  featured: z.boolean(),
  imageUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  description: z.string().optional(),
  priceCents: z.number().min(0, 'Giá phải lớn hơn 0'),
  categoryId: z.string().optional(),
  featured: z.boolean().default(false),
  imageUrl: z.string().optional(),
})

export const UpdateProductSchema = CreateProductSchema.partial()

// Category schemas
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// Order schemas
export const OrderSchema = z.object({
  id: z.string(),
  orderNo: z.string(),
  userId: z.string(),
  totalCents: z.number(),
  status: z.string(),
  shippingAddress: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// User schemas
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  phone: z.string().nullable(),
  role: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// API Response schemas
export const PaginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    meta: z.object({
      page: z.number(),
      pageSize: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  })

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    message: z.string().optional(),
  })

// Export types
export type Product = z.infer<typeof ProductSchema>
export type CreateProduct = z.infer<typeof CreateProductSchema>
export type UpdateProduct = z.infer<typeof UpdateProductSchema>
export type Category = z.infer<typeof CategorySchema>
export type Order = z.infer<typeof OrderSchema>
export type User = z.infer<typeof UserSchema>