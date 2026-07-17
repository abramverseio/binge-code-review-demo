import type { BudgetItem } from '@buttercup/shared/types';
import type { BudgetItemCreateInput } from '@buttercup/shared/schemas';
import { apiFetch } from './client';

export interface BudgetSummary {
  totalPlanned: number;
  totalActual: number;
  remaining: number;
}

export const budgetApi = {
  list(): Promise<BudgetItem[]> {
    return apiFetch<BudgetItem[]>('/budget');
  },
  summary(): Promise<BudgetSummary> {
    return apiFetch<BudgetSummary>('/budget/summary');
  },
  create(input: BudgetItemCreateInput): Promise<BudgetItem> {
    return apiFetch<BudgetItem>('/budget', { method: 'POST', body: JSON.stringify(input) });
  },
};
