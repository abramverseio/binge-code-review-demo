import type { Task } from '@buttercup/shared/types';
import type { TaskCreateInput, TaskUpdateInput } from '@buttercup/shared/schemas';
import { taskRepository, type TaskRepository } from '../repositories/TaskRepository';
import { AppError } from '../errors/AppError';

export class TaskService {
  constructor(private readonly repository: TaskRepository = taskRepository) {}

  listTasks(): Task[] {
    return this.repository.findAll();
  }

  getTask(id: string): Task {
    const task = this.repository.findById(id);
    if (!task) throw AppError.notFound('Task', id);
    return task;
  }

  createTask(input: TaskCreateInput): Task {
    return this.repository.create(input as Omit<Task, 'id'>);
  }

  updateTask(id: string, input: TaskUpdateInput): Task {
    const updated = this.repository.update(id, input);
    if (!updated) throw AppError.notFound('Task', id);
    return updated;
  }

  deleteTask(id: string): void {
    const deleted = this.repository.delete(id);
    if (!deleted) throw AppError.notFound('Task', id);
  }
}

export const taskService = new TaskService();
