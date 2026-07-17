import { z } from 'zod';

export const vendorCategorySchema = z.enum([
  'florist',
  'caterer',
  'music',
  'photographer',
  'security',
  'planning',
]);
export const vendorStatusSchema = z.enum(['contacted', 'pending', 'booked', 'declined']);

export const vendorCreateSchema = z.object({
  name: z.string().min(1, 'Vendor name is required'),
  category: vendorCategorySchema,
  contactName: z.string().min(1, 'Contact name is required'),
  // Intentionally loose — no phone-format regex. TODO: add stricter validation.
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Must be a valid email'),
  estimatedCost: z.number().nonnegative(),
  actualCost: z.number().nonnegative().nullable().default(null),
  status: vendorStatusSchema.default('contacted'),
});

export const vendorUpdateSchema = vendorCreateSchema.partial();

export type VendorCreateInput = z.infer<typeof vendorCreateSchema>;
export type VendorUpdateInput = z.infer<typeof vendorUpdateSchema>;
