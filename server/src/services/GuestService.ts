import type { Guest, RsvpStatus } from '@buttercup/shared/types';
import type { GuestCreateInput, GuestUpdateInput } from '@buttercup/shared/schemas';
import { guestRepository, type GuestRepository } from '../repositories/GuestRepository';
import { AppError } from '../errors/AppError';

export interface GuestListQuery {
  search?: string;
}

export interface RsvpStats {
  total: number;
  attending: number;
  declined: number;
  pending: number;
}

export class GuestService {
  constructor(private readonly repository: GuestRepository = guestRepository) {}

  listGuests(query: GuestListQuery = {}): Guest[] {
    const guests = this.repository.findAll();
    if (!query.search) return guests;

    const term = query.search.toLowerCase();
    // TODO: optimize guest search (linear scan is fine at this scale, not at production scale)
    return guests.filter((guest) =>
      `${guest.firstName} ${guest.lastName} ${guest.household}`.toLowerCase().includes(term),
    );
  }

  getGuest(id: string): Guest {
    const guest = this.repository.findById(id);
    if (!guest) throw AppError.notFound('Guest', id);
    return guest;
  }

  createGuest(input: GuestCreateInput): Guest {
    return this.repository.create(input as Omit<Guest, 'id'>);
  }

  updateGuest(id: string, input: GuestUpdateInput): Guest {
    const updated = this.repository.update(id, input);
    if (!updated) throw AppError.notFound('Guest', id);
    return updated;
  }

  deleteGuest(id: string): void {
    const deleted = this.repository.delete(id);
    if (!deleted) throw AppError.notFound('Guest', id);
  }

  getRsvpStats(): RsvpStats {
    const guests = this.repository.findAll();
    const counts: Record<RsvpStatus, number> = { attending: 0, declined: 0, pending: 0 };
    for (const guest of guests) {
      counts[guest.rsvpStatus] += 1;
    }
    return { total: guests.length, ...counts };
  }
}

export const guestService = new GuestService();
