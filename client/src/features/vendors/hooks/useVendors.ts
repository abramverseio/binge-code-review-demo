import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { VendorCreateInput } from '@buttercup/shared/schemas';
import { vendorsApi } from '@/api/vendorsApi';

export function useVendors() {
  return useQuery({ queryKey: ['vendors'], queryFn: vendorsApi.list });
}

export function useCreateVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: VendorCreateInput) => vendorsApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendors'] }),
  });
}

export function useDeleteVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vendorsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendors'] }),
  });
}
