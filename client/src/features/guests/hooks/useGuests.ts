import { useQuery } from '@tanstack/react-query';
import { guestsApi } from '@/api/guestsApi';

export function useGuests(search?: string) {
  return useQuery({
    queryKey: ['guests', search ?? ''],
    queryFn: () => guestsApi.list(search),
  });
}
