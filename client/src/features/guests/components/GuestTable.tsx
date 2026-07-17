import type { Guest } from '@buttercup/shared/types';
import { MEAL_PREFERENCE_LABELS } from '@buttercup/shared/constants';
import { RsvpBadge } from './RsvpBadge';
import { Button } from '@/components/Button';

interface GuestTableProps {
  guests: Guest[];
  onEdit: (guest: Guest) => void;
  onDelete: (guest: Guest) => void;
}

export function GuestTable({ guests, onEdit, onDelete }: GuestTableProps) {
  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-slate-200 text-slate-500">
        <tr>
          <th className="py-2">Name</th>
          <th className="py-2">Household</th>
          <th className="py-2">RSVP</th>
          <th className="py-2">Meal</th>
          <th className="py-2">Plus One</th>
          <th className="py-2" />
        </tr>
      </thead>
      <tbody>
        {guests.map((guest) => (
          <tr key={guest.id} className="border-b border-slate-100">
            <td className="py-2 font-medium text-slate-800">
              {guest.firstName} {guest.lastName}
            </td>
            <td className="py-2 text-slate-600">{guest.household}</td>
            <td className="py-2">
              <RsvpBadge status={guest.rsvpStatus} />
            </td>
            <td className="py-2 text-slate-600">{MEAL_PREFERENCE_LABELS[guest.mealPreference]}</td>
            <td className="py-2 text-slate-600">{guest.plusOne ? 'Yes' : 'No'}</td>
            <td className="py-2 text-right">
              <Button variant="secondary" onClick={() => onEdit(guest)} className="mr-2">
                Edit
              </Button>
              <Button variant="danger" onClick={() => onDelete(guest)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
