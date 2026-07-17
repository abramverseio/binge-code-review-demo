import { describe, expect, it } from 'vitest';
import { GuestRepository } from '../repositories/GuestRepository';
import { GuestService } from './GuestService';

function seededService() {
  const repo = new GuestRepository();
  repo.seed([
    { id: 'g1', firstName: 'Westley', lastName: '', household: 'H1', rsvpStatus: 'attending', mealPreference: 'standard', tableId: null, plusOne: false, notes: '' },
    { id: 'g2', firstName: 'Buttercup', lastName: '', household: 'H1', rsvpStatus: 'attending', mealPreference: 'standard', tableId: null, plusOne: false, notes: '' },
    { id: 'g3', firstName: 'Vizzini', lastName: '', household: 'H2', rsvpStatus: 'pending', mealPreference: 'standard', tableId: null, plusOne: false, notes: '' },
    { id: 'g4', firstName: 'Count', lastName: 'Rugen', household: 'H3', rsvpStatus: 'declined', mealPreference: 'standard', tableId: null, plusOne: false, notes: '' },
  ]);
  return new GuestService(repo);
}

describe('GuestService.getRsvpStats', () => {
  it('tallies rsvp statuses correctly', () => {
    const stats = seededService().getRsvpStats();
    expect(stats).toEqual({ total: 4, attending: 2, declined: 1, pending: 1 });
  });
});

describe('GuestService.listGuests', () => {
  it('filters by search term across first name, last name, and household', () => {
    const results = seededService().listGuests({ search: 'rugen' });
    expect(results).toHaveLength(1);
    expect(results[0]?.firstName).toBe('Count');
  });

  it('returns every guest when no search term is given', () => {
    expect(seededService().listGuests()).toHaveLength(4);
  });
});
