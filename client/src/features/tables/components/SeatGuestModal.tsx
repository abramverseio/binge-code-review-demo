import { useState } from 'react';
import type { Guest, Table } from '@buttercup/shared/types';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';

interface SeatGuestModalProps {
  open: boolean;
  table: Table | null;
  unseatedGuests: Guest[];
  onClose: () => void;
  onSeat: (guestId: string) => void;
  errorMessage?: string;
}

export function SeatGuestModal({
  open,
  table,
  unseatedGuests,
  onClose,
  onSeat,
  errorMessage,
}: SeatGuestModalProps) {
  const [selectedGuestId, setSelectedGuestId] = useState('');

  if (!table) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Seat a guest at ${table.name}`}>
      {unseatedGuests.length === 0 ? (
        <p className="text-sm text-slate-500">Every guest is already seated somewhere.</p>
      ) : (
        <select
          className="mb-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={selectedGuestId}
          onChange={(e) => setSelectedGuestId(e.target.value)}
        >
          <option value="">Select a guest…</option>
          {unseatedGuests.map((guest) => (
            <option key={guest.id} value={guest.id}>
              {guest.firstName} {guest.lastName}
            </option>
          ))}
        </select>
      )}
      {errorMessage && <p className="mb-3 text-sm text-red-600">{errorMessage}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={!selectedGuestId} onClick={() => onSeat(selectedGuestId)}>
          Seat Guest
        </Button>
      </div>
    </Modal>
  );
}
