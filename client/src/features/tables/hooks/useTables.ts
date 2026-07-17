import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tablesApi } from '@/api/tablesApi';
import { guestsApi } from '@/api/guestsApi';

export function useTables() {
  return useQuery({ queryKey: ['tables'], queryFn: tablesApi.list });
}

export function useGuestsForSeating() {
  return useQuery({ queryKey: ['guests', ''], queryFn: () => guestsApi.list() });
}

export function useSeatGuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tableId, guestId }: { tableId: string; guestId: string }) =>
      tablesApi.seatGuest(tableId, guestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
    },
  });
}
