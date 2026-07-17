import type { Guest } from '@buttercup/shared/types';
import { InMemoryRepository } from './InMemoryRepository';

export class GuestRepository extends InMemoryRepository<Guest> {
  constructor() {
    super('guest');
  }

  findByTable(tableId: string): Guest[] {
    return this.findAll().filter((guest) => guest.tableId === tableId);
  }
}

export const guestRepository = new GuestRepository();
