import type { Table } from '@buttercup/shared/types';
import type { TableCreateInput, TableUpdateInput } from '@buttercup/shared/schemas';
import { tableRepository, type TableRepository } from '../repositories/TableRepository';
import { guestRepository, type GuestRepository } from '../repositories/GuestRepository';
import { AppError } from '../errors/AppError';

export class TableService {
  constructor(
    private readonly tables: TableRepository = tableRepository,
    private readonly guests: GuestRepository = guestRepository,
  ) {}

  listTables(): Table[] {
    return this.tables.findAll();
  }

  getTable(id: string): Table {
    const table = this.tables.findById(id);
    if (!table) throw AppError.notFound('Table', id);
    return table;
  }

  createTable(input: TableCreateInput): Table {
    return this.tables.create(input as Omit<Table, 'id'>);
  }

  updateTable(id: string, input: TableUpdateInput): Table {
    const updated = this.tables.update(id, input);
    if (!updated) throw AppError.notFound('Table', id);
    return updated;
  }

  deleteTable(id: string): void {
    const deleted = this.tables.delete(id);
    if (!deleted) throw AppError.notFound('Table', id);
  }

  /**
   * Assigns a guest to a table, rejecting the assignment if the table is
   * already at capacity.
   */
  seatGuest(tableId: string, guestId: string) {
    const table = this.getTable(tableId);
    const guest = this.guests.findById(guestId);
    if (!guest) throw AppError.notFound('Guest', guestId);

    const currentlySeated = this.guests.findByTable(tableId).filter((g) => g.id !== guestId);
    if (currentlySeated.length >= table.capacity) {
      throw AppError.badRequest(
        `Table "${table.name}" is at capacity (${table.capacity} seats)`,
      );
    }

    const updated = this.guests.update(guestId, { tableId });
    if (!updated) throw AppError.notFound('Guest', guestId);
    return updated;
  }

  /**
   * TODO: seating conflict detection — e.g. flag known feuds
   * (Prince Humperdinck / Count Rugen seated with Westley's party) or
   * households split across tables. Currently a stub.
   */
  detectSeatingConflicts(): string[] {
    return [];
  }
}

export const tableService = new TableService();
