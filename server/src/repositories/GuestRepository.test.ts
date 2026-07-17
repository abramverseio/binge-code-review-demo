import { describe, expect, it } from 'vitest';
import { GuestRepository } from './GuestRepository';
import type { Guest } from '@buttercup/shared/types';

function buildGuest(overrides: Partial<Guest> = {}): Omit<Guest, 'id'> {
  return {
    firstName: 'Test',
    lastName: 'Guest',
    household: 'Test Household',
    rsvpStatus: 'pending',
    mealPreference: 'standard',
    tableId: null,
    plusOne: false,
    notes: '',
    ...overrides,
  };
}

describe('GuestRepository', () => {
  it('creates a guest with a generated id', () => {
    const repo = new GuestRepository();
    const guest = repo.create(buildGuest({ firstName: 'Westley' }));
    expect(guest.id).toBeTruthy();
    expect(guest.firstName).toBe('Westley');
    expect(repo.findAll()).toHaveLength(1);
  });

  it('updates an existing guest', () => {
    const repo = new GuestRepository();
    const guest = repo.create(buildGuest());
    const updated = repo.update(guest.id, { rsvpStatus: 'attending' });
    expect(updated?.rsvpStatus).toBe('attending');
  });

  it('deletes a guest', () => {
    const repo = new GuestRepository();
    const guest = repo.create(buildGuest());
    expect(repo.delete(guest.id)).toBe(true);
    expect(repo.findAll()).toHaveLength(0);
  });

  it('finds guests seated at a given table', () => {
    const repo = new GuestRepository();
    repo.create(buildGuest({ tableId: 'table-1' }));
    repo.create(buildGuest({ tableId: 'table-2' }));
    expect(repo.findByTable('table-1')).toHaveLength(1);
  });

  it('generates a new id that does not collide with seeded ids', () => {
    const repo = new GuestRepository();
    repo.seed([
      { ...buildGuest({ firstName: 'Westley' }), id: 'guest-1' },
      { ...buildGuest({ firstName: 'Buttercup' }), id: 'guest-2' },
    ]);
    const guest = repo.create(buildGuest({ firstName: 'NewGuest' }));
    expect(guest.id).not.toBe('guest-1');
    expect(guest.id).not.toBe('guest-2');
    expect(guest.id).toBe('guest-3');
  });
});
