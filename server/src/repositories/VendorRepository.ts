import type { Vendor } from '@buttercup/shared/types';
import { InMemoryRepository } from './InMemoryRepository';

export class VendorRepository extends InMemoryRepository<Vendor> {
  constructor() {
    super('vendor');
  }
}

export const vendorRepository = new VendorRepository();
