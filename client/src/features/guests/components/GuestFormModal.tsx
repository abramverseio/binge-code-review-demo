import { useState } from 'react';
import { guestCreateSchema } from '@buttercup/shared/schemas';
import type { Guest } from '@buttercup/shared/types';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

interface GuestFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: {
    firstName: string;
    lastName: string;
    household: string;
    notes: string;
  }) => void;
  initialValues?: Partial<Guest>;
}

export function GuestFormModal({ open, onClose, onSubmit, initialValues }: GuestFormModalProps) {
  const [firstName, setFirstName] = useState(initialValues?.firstName ?? '');
  const [lastName, setLastName] = useState(initialValues?.lastName ?? '');
  const [household, setHousehold] = useState(initialValues?.household ?? '');
  const [notes, setNotes] = useState(initialValues?.notes ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = guestCreateSchema
      .pick({ firstName: true, lastName: true, household: true })
      .safeParse({ firstName, lastName, household });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit({ firstName, lastName, household, notes });
  }

  return (
    <Modal open={open} onClose={onClose} title={initialValues ? 'Edit Guest' : 'Add Guest'}>
      <form onSubmit={handleSubmit}>
        <Input
          label="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={errors.firstName}
        />
        <Input
          label="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={errors.lastName}
        />
        <Input
          label="Household"
          value={household}
          onChange={(e) => setHousehold(e.target.value)}
          error={errors.household}
        />
        <Input label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
}
