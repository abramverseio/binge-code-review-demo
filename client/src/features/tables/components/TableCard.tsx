import type { Guest, Table } from '@buttercup/shared/types';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';

interface TableCardProps {
  table: Table;
  seatedGuests: Guest[];
  onSeatGuest: () => void;
}

export function TableCard({ table, seatedGuests, onSeatGuest }: TableCardProps) {
  const isFull = seatedGuests.length >= table.capacity;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">{table.name}</h3>
        <Badge tone={isFull ? 'warning' : 'neutral'}>
          {seatedGuests.length} / {table.capacity} seats
        </Badge>
      </div>
      <ul className="mb-3 space-y-1 text-sm text-slate-600">
        {seatedGuests.map((guest) => (
          <li key={guest.id}>
            {guest.firstName} {guest.lastName}
          </li>
        ))}
        {seatedGuests.length === 0 && <li className="text-slate-400">No guests seated yet</li>}
      </ul>
      <Button variant="secondary" onClick={onSeatGuest} disabled={isFull}>
        {isFull ? 'Table Full' : 'Seat Guest'}
      </Button>
    </div>
  );
}
