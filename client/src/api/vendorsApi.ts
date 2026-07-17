import type { Vendor } from '@buttercup/shared/types';
import type { VendorCreateInput, VendorUpdateInput } from '@buttercup/shared/schemas';
import { apiFetch } from './client';

export const vendorsApi = {
  list(): Promise<Vendor[]> {
    return apiFetch<Vendor[]>('/vendors');
  },
  create(input: VendorCreateInput): Promise<Vendor> {
    return apiFetch<Vendor>('/vendors', { method: 'POST', body: JSON.stringify(input) });
  },
  update(id: string, input: VendorUpdateInput): Promise<Vendor> {
    return apiFetch<Vendor>(`/vendors/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
  },
  remove(id: string): Promise<void> {
    return apiFetch<void>(`/vendors/${id}`, { method: 'DELETE' });
  },
};
