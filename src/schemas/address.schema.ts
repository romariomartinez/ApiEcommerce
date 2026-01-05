import { z } from 'zod';

export const createAddressSchema = z.object({
  country: z.string().min(2),
  city: z.string().min(2),
  address: z.string().min(5),
  zip_code: z.string().optional(),
});
