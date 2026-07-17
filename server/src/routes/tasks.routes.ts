import { Router } from 'express';
import { taskCreateSchema, taskUpdateSchema } from '@buttercup/shared/schemas';
import { taskService } from '../services/TaskService';
import { validateBody } from '../middleware/validateBody';

export const tasksRouter = Router();

tasksRouter.get('/', (_req, res) => {
  res.json(taskService.listTasks());
});

tasksRouter.get('/:id', (req, res) => {
  res.json(taskService.getTask(req.params.id));
});

tasksRouter.post('/', validateBody(taskCreateSchema), (req, res) => {
  res.status(201).json(taskService.createTask(req.body));
});

tasksRouter.patch('/:id', validateBody(taskUpdateSchema), (req, res) => {
  res.json(taskService.updateTask(req.params.id as string, req.body));
});

tasksRouter.delete('/:id', (req, res) => {
  taskService.deleteTask(req.params.id);
  res.status(204).send();
});
