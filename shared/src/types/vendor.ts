export type VendorCategory = 'florist' | 'caterer' | 'music' | 'photographer' | 'security' | 'planning';

export type VendorStatus = 'contacted' | 'pending' | 'booked' | 'declined';

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  contactName: string;
  phone: string;
  email: string;
  estimatedCost: number;
  actualCost: number | null;
  status: VendorStatus;
  // TODO: vendor invoices
}
