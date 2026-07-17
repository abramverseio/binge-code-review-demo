import { useQuery } from '@tanstack/react-query';
import { budgetApi } from '@/api/budgetApi';

export function useBudgetItems() {
  return useQuery({ queryKey: ['budget', 'items'], queryFn: budgetApi.list });
}

export function useBudgetSummary() {
  return useQuery({ queryKey: ['budget', 'summary'], queryFn: budgetApi.summary });
}
