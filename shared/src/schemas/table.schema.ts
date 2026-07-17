import { z } from 'zod';

export const tableCreateSchema = z.object({
  name: z.string().min(1, 'Table name is required'),
  capacity: z.number().int().positive('Capacity must be at least 1'),
});

export const tableUpdateSchema = tableCreateSchema.partial();

export type TableCreateInput = z.infer<typeof tableCreateSchema>;
export type TableUpdateInput = z.infer<typeof tableUpdateSchema>;
