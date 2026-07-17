import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { GuestCreateInput, GuestUpdateInput } from '@buttercup/shared/schemas';
import { guestsApi } from '@/api/guestsApi';

export function useCreateGuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: GuestCreateInput) => guestsApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['guests'] }),
  });
}

export function useUpdateGuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: GuestUpdateInput }) =>
      guestsApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['guests'] }),
  });
}

export function useDeleteGuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => guestsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['guests'] }),
  });
}
