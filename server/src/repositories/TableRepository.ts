import type { Table } from '@buttercup/shared/types';
import { InMemoryRepository } from './InMemoryRepository';

export class TableRepository extends InMemoryRepository<Table> {
  constructor() {
    super('table');
  }
}

export const tableRepository = new TableRepository();
