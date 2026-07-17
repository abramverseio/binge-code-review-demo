import type { Task } from '@buttercup/shared/types';
import type { TaskCreateInput, TaskUpdateInput } from '@buttercup/shared/schemas';
import { apiFetch } from './client';

export const tasksApi = {
  list(): Promise<Task[]> {
    return apiFetch<Task[]>('/tasks');
  },
  create(input: TaskCreateInput): Promise<Task> {
    return apiFetch<Task>('/tasks', { method: 'POST', body: JSON.stringify(input) });
  },
  update(id: string, input: TaskUpdateInput): Promise<Task> {
    return apiFetch<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
  },
  remove(id: string): Promise<void> {
    return apiFetch<void>(`/tasks/${id}`, { method: 'DELETE' });
  },
};
