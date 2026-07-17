import { useState } from 'react';
import type { Guest } from '@buttercup/shared/types';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { EmptyState } from '@/components/EmptyState';
import { useGuests } from './hooks/useGuests';
import { useCreateGuest, useDeleteGuest, useUpdateGuest } from './hooks/useGuestMutations';
import { GuestTable } from './components/GuestTable';
import { GuestFormModal } from './components/GuestFormModal';

export function GuestsPage() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const { data: guests, isLoading } = useGuests(search);
  const createGuest = useCreateGuest();
  const updateGuest = useUpdateGuest();
  const deleteGuest = useDeleteGuest();

  function handleSubmit(input: { firstName: string; lastName: string; household: string; notes: string }) {
    if (editingGuest) {
      updateGuest.mutate({ id: editingGuest.id, input });
    } else {
      createGuest.mutate({
        ...input,
        rsvpStatus: 'pending',
        mealPreference: 'standard',
        tableId: null,
        plusOne: false,
      });
    }
    setModalOpen(false);
    setEditingGuest(null);
  }

  return (
    <div>
      <PageHeader
        title="Guests"
        description="Track RSVPs, meal preferences, and seating."
        actions={
          <>
            {/* TODO: export seating chart to PDF */}
            <Button variant="secondary" disabled title="Coming soon">
              Export
            </Button>
            <Button
              onClick={() => {
                setEditingGuest(null);
                setModalOpen(true);
              }}
            >
              Add Guest
            </Button>
          </>
        }
      />

      <div className="mb-4 flex items-center gap-3">
        <Input
          label="Search"
          placeholder="Search by name or household"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        {/* TODO: sorting and column filtering are not implemented yet */}
        <select disabled title="Coming soon" className="mt-6 rounded-md border border-slate-200 px-2 py-2 text-sm text-slate-400">
          <option>Sort by name</option>
        </select>
      </div>

      {isLoading && <p className="text-sm text-slate-500">Loading guests…</p>}

      {!isLoading && guests && guests.length === 0 && (
        <EmptyState
          title="No guests yet — add your first!"
          description="Start building your guest list to track RSVPs, meals, and seating."
        />
      )}

      {!isLoading && guests && guests.length > 0 && (
        <GuestTable
          guests={guests}
          onEdit={(guest) => {
            setEditingGuest(guest);
            setModalOpen(true);
          }}
          onDelete={(guest) => deleteGuest.mutate(guest.id)}
        />
      )}

      <GuestFormModal
        key={editingGuest?.id ?? 'new'}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingGuest(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editingGuest ?? undefined}
      />
    </div>
  );
}
