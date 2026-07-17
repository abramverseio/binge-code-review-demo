import { z } from 'zod';

export const budgetItemCreateSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  planned: z.number().nonnegative(),
  actual: z.number().nonnegative().default(0),
});

export const budgetItemUpdateSchema = budgetItemCreateSchema.partial();

export type BudgetItemCreateInput = z.infer<typeof budgetItemCreateSchema>;
export type BudgetItemUpdateInput = z.infer<typeof budgetItemUpdateSchema>;
