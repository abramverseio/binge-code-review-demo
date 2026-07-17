import { Router } from 'express';
import { budgetItemCreateSchema, budgetItemUpdateSchema } from '@buttercup/shared/schemas';
import { budgetService } from '../services/BudgetService';
import { validateBody } from '../middleware/validateBody';

export const budgetRouter = Router();

budgetRouter.get('/', (_req, res) => {
  res.json(budgetService.listItems());
});

budgetRouter.get('/summary', (_req, res) => {
  res.json(budgetService.getSummary());
});

budgetRouter.post('/', validateBody(budgetItemCreateSchema), (req, res) => {
  res.status(201).json(budgetService.createItem(req.body));
});

budgetRouter.patch('/:id', validateBody(budgetItemUpdateSchema), (req, res) => {
  res.json(budgetService.updateItem(req.params.id as string, req.body));
});

budgetRouter.delete('/:id', (req, res) => {
  budgetService.deleteItem(req.params.id);
  res.status(204).send();
});
