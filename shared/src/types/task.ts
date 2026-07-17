export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO date
  priority: TaskPriority;
  completed: boolean;
  assignedTo: string;
}
