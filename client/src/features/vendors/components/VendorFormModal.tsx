import { useState } from 'react';
import { vendorCreateSchema } from '@buttercup/shared/schemas';
import type { VendorCategory } from '@buttercup/shared/types';
import { VENDOR_CATEGORY_LABELS } from '@buttercup/shared/constants';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

interface VendorFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: {
    name: string;
    category: VendorCategory;
    contactName: string;
    phone: string;
    email: string;
    estimatedCost: number;
  }) => void;
}

const CATEGORIES = Object.keys(VENDOR_CATEGORY_LABELS) as VendorCategory[];

export function VendorFormModal({ open, onClose, onSubmit }: VendorFormModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<VendorCategory>('caterer');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('0');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = vendorCreateSchema.safeParse({
      name,
      category,
      contactName,
      phone,
      email,
      estimatedCost: Number(estimatedCost),
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Vendor">
      <form onSubmit={handleSubmit}>
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <div className="mb-3">
          <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
          <select
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value as VendorCategory)}
          >
            {CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {VENDOR_CATEGORY_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Contact name"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          error={errors.contactName}
        />
        <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} />
        <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <Input
          label="Estimated cost"
          type="number"
          value={estimatedCost}
          onChange={(e) => setEstimatedCost(e.target.value)}
          error={errors.estimatedCost}
        />
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
