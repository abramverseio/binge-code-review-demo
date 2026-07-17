import { z } from 'zod';

export const taskPrioritySchema = z.enum(['low', 'medium', 'high']);

export const taskCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().default(''),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: taskPrioritySchema.default('medium'),
  completed: z.boolean().default(false),
  assignedTo: z.string().default(''),
});

export const taskUpdateSchema = taskCreateSchema.partial();

export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;
