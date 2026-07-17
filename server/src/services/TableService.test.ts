import { describe, expect, it } from 'vitest';
import { GuestRepository } from '../repositories/GuestRepository';
import { TableRepository } from '../repositories/TableRepository';
import { TableService } from './TableService';
import { AppError } from '../errors/AppError';

function buildService() {
  const tables = new TableRepository();
  const guests = new GuestRepository();
  const table = tables.create({ name: 'Miracle Pavilion', capacity: 1 });
  const seatedGuest = guests.create({
    firstName: 'Miracle',
    lastName: 'Max',
    household: 'H',
    rsvpStatus: 'attending',
    mealPreference: 'standard',
    tableId: table.id,
    plusOne: false,
    notes: '',
  });
  const newGuest = guests.create({
    firstName: 'Valerie',
    lastName: '',
    household: 'H',
    rsvpStatus: 'attending',
    mealPreference: 'standard',
    tableId: null,
    plusOne: false,
    notes: '',
  });
  return { service: new TableService(tables, guests), table, seatedGuest, newGuest };
}

describe('TableService.seatGuest', () => {
  it('seats a guest when the table has room', () => {
    const { service, table, newGuest } = buildService();
    // capacity is 1 and already has seatedGuest, so first free a seat by raising capacity
    const roomyTable = service.updateTable(table.id, { capacity: 2 });
    const result = service.seatGuest(roomyTable.id, newGuest.id);
    expect(result.tableId).toBe(roomyTable.id);
  });

  it('rejects seating a guest at a table that is already full', () => {
    const { service, table, newGuest } = buildService();
    expect(() => service.seatGuest(table.id, newGuest.id)).toThrow(AppError);
  });
});
