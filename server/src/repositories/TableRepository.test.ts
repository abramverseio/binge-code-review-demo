import { describe, expect, it } from 'vitest';
import { TableRepository } from './TableRepository';

describe('TableRepository', () => {
  it('creates and retrieves a table', () => {
    const repo = new TableRepository();
    const table = repo.create({ name: 'Fire Swamp', capacity: 6 });
    expect(repo.findById(table.id)).toEqual(table);
  });

  it('returns undefined for an unknown id', () => {
    const repo = new TableRepository();
    expect(repo.findById('missing')).toBeUndefined();
  });
});
