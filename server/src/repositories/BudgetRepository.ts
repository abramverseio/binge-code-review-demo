import type { BudgetItem } from '@buttercup/shared/types';
import { InMemoryRepository } from './InMemoryRepository';

export class BudgetRepository extends InMemoryRepository<BudgetItem> {
  constructor() {
    super('budget');
  }
}

export const budgetRepository = new BudgetRepository();
