import type { Guest, Table } from '@buttercup/shared/types';
import { apiFetch } from './client';

export const tablesApi = {
  list(): Promise<Table[]> {
    return apiFetch<Table[]>('/tables');
  },
  seatGuest(tableId: string, guestId: string): Promise<Guest> {
    return apiFetch<Guest>(`/tables/${tableId}/seat`, {
      method: 'POST',
      body: JSON.stringify({ guestId }),
    });
  },
};
