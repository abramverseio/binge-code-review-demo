import type { Task } from '@buttercup/shared/types';
import { InMemoryRepository } from './InMemoryRepository';

export class TaskRepository extends InMemoryRepository<Task> {
  constructor() {
    super('task');
  }
}

export const taskRepository = new TaskRepository();
