import { useState } from 'react';
import type { Table } from '@buttercup/shared/types';
import { PageHeader } from '@/components/PageHeader';
import { ApiError } from '@/api/client';
import { useTables, useGuestsForSeating, useSeatGuest } from './hooks/useTables';
import { TableCard } from './components/TableCard';
import { SeatGuestModal } from './components/SeatGuestModal';

export function TablesPage() {
  const { data: tables, isLoading } = useTables();
  const { data: guests } = useGuestsForSeating();
  const seatGuest = useSeatGuest();

  const [activeTable, setActiveTable] = useState<Table | null>(null);
  const [seatError, setSeatError] = useState<string | undefined>();

  function guestsFor(tableId: string) {
    return (guests ?? []).filter((guest) => guest.tableId === tableId);
  }

  function handleSeat(guestId: string) {
    if (!activeTable) return;
    seatGuest.mutate(
      { tableId: activeTable.id, guestId },
      {
        onSuccess: () => {
          setActiveTable(null);
          setSeatError(undefined);
        },
        onError: (error) => {
          setSeatError(error instanceof ApiError ? error.message : 'Could not seat guest');
        },
      },
    );
  }

  return (
    <div>
      <PageHeader title="Reception Tables" description="Manage seating for the reception." />

      {isLoading && <p className="text-sm text-slate-500">Loading tables…</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tables?.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            seatedGuests={guestsFor(table.id)}
            onSeatGuest={() => {
              setActiveTable(table);
              setSeatError(undefined);
            }}
          />
        ))}
      </div>

      <SeatGuestModal
        open={activeTable !== null}
        table={activeTable}
        unseatedGuests={(guests ?? []).filter((guest) => guest.tableId === null)}
        onClose={() => setActiveTable(null)}
        onSeat={handleSeat}
        errorMessage={seatError}
      />
    </div>
  );
}
