import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Task } from '@buttercup/shared/types';
import type { TaskCreateInput } from '@buttercup/shared/schemas';
import { tasksApi } from '@/api/tasksApi';

export function useTasks() {
  return useQuery({ queryKey: ['tasks'], queryFn: tasksApi.list });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TaskCreateInput) => tasksApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

export function useToggleTaskCompleted() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ task }: { task: Task }) => tasksApi.update(task.id, { completed: !task.completed }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
}
