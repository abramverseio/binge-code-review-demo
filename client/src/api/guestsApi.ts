import type { Guest } from '@buttercup/shared/types';
import type { GuestCreateInput, GuestUpdateInput } from '@buttercup/shared/schemas';
import { apiFetch } from './client';

export const guestsApi = {
  list(search?: string): Promise<Guest[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiFetch<Guest[]>(`/guests${query}`);
  },
  create(input: GuestCreateInput): Promise<Guest> {
    return apiFetch<Guest>('/guests', { method: 'POST', body: JSON.stringify(input) });
  },
  update(id: string, input: GuestUpdateInput): Promise<Guest> {
    return apiFetch<Guest>(`/guests/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
  },
  remove(id: string): Promise<void> {
    return apiFetch<void>(`/guests/${id}`, { method: 'DELETE' });
  },
};
