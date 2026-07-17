import { guestService } from './GuestService';
import { budgetService } from './BudgetService';
import { taskRepository } from '../repositories/TaskRepository';

export interface RecentActivityItem {
  id: string;
  message: string;
}

export interface DashboardSummary {
  guestCount: number;
  rsvpStats: ReturnType<typeof guestService.getRsvpStats>;
  budgetSummary: ReturnType<typeof budgetService.getSummary>;
  upcomingTasks: ReturnType<typeof taskRepository.findAll>;
  // TODO: back this with a real activity log; currently derived ad-hoc from tasks.
  recentActivity: RecentActivityItem[];
}

export class DashboardService {
  getSummary(): DashboardSummary {
    const guests = guestService.listGuests();
    const rsvpStats = guestService.getRsvpStats();
    const budgetSummary = budgetService.getSummary();
    const upcomingTasks = taskRepository
      .findAll()
      .filter((task) => !task.completed)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5);

    const recentActivity: RecentActivityItem[] = taskRepository
      .findAll()
      .filter((task) => task.completed)
      .slice(0, 5)
      .map((task) => ({ id: task.id, message: `Completed: ${task.title}` }));

    return {
      guestCount: guests.length,
      rsvpStats,
      budgetSummary,
      upcomingTasks,
      recentActivity,
    };
  }
}

export const dashboardService = new DashboardService();
