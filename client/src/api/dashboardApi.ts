import type { Task } from '@buttercup/shared/types';
import { apiFetch } from './client';
import type { BudgetSummary } from './budgetApi';

export interface RsvpStats {
  total: number;
  attending: number;
  declined: number;
  pending: number;
}

export interface RecentActivityItem {
  id: string;
  message: string;
}

export interface DashboardSummary {
  guestCount: number;
  rsvpStats: RsvpStats;
  budgetSummary: BudgetSummary;
  upcomingTasks: Task[];
  recentActivity: RecentActivityItem[];
}

export const dashboardApi = {
  summary(): Promise<DashboardSummary> {
    return apiFetch<DashboardSummary>('/dashboard');
  },
};
