import type { Vendor } from '@buttercup/shared/types';
import { VENDOR_CATEGORY_LABELS, VENDOR_STATUS_LABELS } from '@buttercup/shared/constants';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';

const STATUS_TONE = {
  booked: 'success',
  pending: 'warning',
  contacted: 'neutral',
  declined: 'danger',
} as const;

interface VendorCardProps {
  vendor: Vendor;
  onDelete: () => void;
}

export function VendorCard({ vendor, onDelete }: VendorCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">{vendor.name}</h3>
        <Badge tone={STATUS_TONE[vendor.status]}>{VENDOR_STATUS_LABELS[vendor.status]}</Badge>
      </div>
      <p className="mb-1 text-sm text-slate-500">{VENDOR_CATEGORY_LABELS[vendor.category]}</p>
      <p className="text-sm text-slate-600">{vendor.contactName}</p>
      <p className="text-sm text-slate-600">{vendor.phone}</p>
      <p className="mb-3 text-sm text-slate-600">{vendor.email}</p>
      <p className="mb-3 text-sm text-slate-700">
        Estimated: ${vendor.estimatedCost.toLocaleString()}
        {vendor.actualCost !== null && ` · Actual: $${vendor.actualCost.toLocaleString()}`}
      </p>
      <Button variant="danger" onClick={onDelete}>
        Remove
      </Button>
    </div>
  );
}
