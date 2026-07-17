import type { Vendor } from '@buttercup/shared/types';
import type { VendorCreateInput, VendorUpdateInput } from '@buttercup/shared/schemas';
import { vendorRepository, type VendorRepository } from '../repositories/VendorRepository';
import { AppError } from '../errors/AppError';

export class VendorService {
  constructor(private readonly repository: VendorRepository = vendorRepository) {}

  listVendors(): Vendor[] {
    return this.repository.findAll();
  }

  getVendor(id: string): Vendor {
    const vendor = this.repository.findById(id);
    if (!vendor) throw AppError.notFound('Vendor', id);
    return vendor;
  }

  createVendor(input: VendorCreateInput): Vendor {
    return this.repository.create(input as Omit<Vendor, 'id'>);
  }

  updateVendor(id: string, input: VendorUpdateInput): Vendor {
    const updated = this.repository.update(id, input);
    if (!updated) throw AppError.notFound('Vendor', id);
    return updated;
  }

  deleteVendor(id: string): void {
    const deleted = this.repository.delete(id);
    if (!deleted) throw AppError.notFound('Vendor', id);
  }
}

export const vendorService = new VendorService();
