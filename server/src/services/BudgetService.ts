import type { BudgetItem } from '@buttercup/shared/types';
import type { BudgetItemCreateInput, BudgetItemUpdateInput } from '@buttercup/shared/schemas';
import { budgetRepository, type BudgetRepository } from '../repositories/BudgetRepository';
import { AppError } from '../errors/AppError';

export interface BudgetSummary {
  totalPlanned: number;
  totalActual: number;
  remaining: number;
}

export class BudgetService {
  constructor(private readonly repository: BudgetRepository = budgetRepository) {}

  listItems(): BudgetItem[] {
    return this.repository.findAll();
  }

  createItem(input: BudgetItemCreateInput): BudgetItem {
    return this.repository.create(input as Omit<BudgetItem, 'id'>);
  }

  updateItem(id: string, input: BudgetItemUpdateInput): BudgetItem {
    const updated = this.repository.update(id, input);
    if (!updated) throw AppError.notFound('BudgetItem', id);
    return updated;
  }

  deleteItem(id: string): void {
    const deleted = this.repository.delete(id);
    if (!deleted) throw AppError.notFound('BudgetItem', id);
  }

  getSummary(): BudgetSummary {
    const items = this.repository.findAll();
    const totalPlanned = items.reduce((sum, item) => sum + item.planned, 0);
    const totalActual = items.reduce((sum, item) => sum + item.actual, 0);
    return { totalPlanned, totalActual, remaining: totalPlanned - totalActual };
  }
}

export const budgetService = new BudgetService();
