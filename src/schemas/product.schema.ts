import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.number().positive(),
  category_id: z.number().int(),
  stock: z.number().int().nonnegative(),
});

export const updateProductSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  category_id: z.number().int().optional(),
  stock: z.number().int().nonnegative().optional(),
});
