import { z } from "zod"

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export const createPaginatedResponseSchema = <T extends z.ZodType>(
  itemSchema: T,
) =>
  z.object({
    items: z.array(itemSchema),
    pagination: z.object({
      page: z.number().int().min(1),
      pageSize: z.number().int().min(1),
      total: z.number().int().min(0),
      totalPages: z.number().int().min(0),
    }),
  })

export type Pagination = z.infer<typeof paginationSchema>
