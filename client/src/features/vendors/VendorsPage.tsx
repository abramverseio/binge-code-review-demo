import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { EmptyState } from '@/components/EmptyState';
import { useCreateVendor, useDeleteVendor, useVendors } from './hooks/useVendors';
import { VendorCard } from './components/VendorCard';
import { VendorFormModal } from './components/VendorFormModal';

export function VendorsPage() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { data: vendors, isLoading } = useVendors();
  const createVendor = useCreateVendor();
  const deleteVendor = useDeleteVendor();

  // TODO: vendor search is case-sensitive — normalize case before matching
  const filtered = (vendors ?? []).filter((vendor) => vendor.name.includes(search));

  return (
    <div>
      <PageHeader
        title="Vendors"
        description="Florists, caterers, music, and photography."
        actions={<Button onClick={() => setModalOpen(true)}>Add Vendor</Button>}
      />

      <Input
        label="Search"
        placeholder="Search vendors by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 max-w-xs"
      />

      {isLoading && <p className="text-sm text-slate-500">Loading vendors…</p>}

      {!isLoading && filtered.length === 0 && (
        <EmptyState
          title="No vendors found"
          description="We couldn't find a match — try a different search, or add a new vendor to get started."
        />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} onDelete={() => deleteVendor.mutate(vendor.id)} />
        ))}
      </div>

      <VendorFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(input) => {
          createVendor.mutate({ ...input, actualCost: null, status: 'contacted' });
          setModalOpen(false);
        }}
      />
    </div>
  );
}
