import { describe, expect, it } from 'vitest';
import { BudgetRepository } from '../repositories/BudgetRepository';
import { BudgetService } from './BudgetService';

describe('BudgetService.getSummary', () => {
  it('computes totals and remaining budget', () => {
    const repo = new BudgetRepository();
    repo.seed([
      { id: 'b1', category: 'Venue', planned: 15000, actual: 15000 },
      { id: 'b2', category: 'Flowers', planned: 2000, actual: 2350 },
    ]);
    const summary = new BudgetService(repo).getSummary();
    expect(summary).toEqual({ totalPlanned: 17000, totalActual: 17350, remaining: -350 });
  });

  it('returns zeros when there are no budget items', () => {
    const summary = new BudgetService(new BudgetRepository()).getSummary();
    expect(summary).toEqual({ totalPlanned: 0, totalActual: 0, remaining: 0 });
  });
});
