import { Router } from 'express';
import { z } from 'zod';
import { tableCreateSchema, tableUpdateSchema } from '@buttercup/shared/schemas';
import { tableService } from '../services/TableService';
import { validateBody } from '../middleware/validateBody';

export const tablesRouter = Router();

const seatGuestSchema = z.object({ guestId: z.string().min(1) });

tablesRouter.get('/', (_req, res) => {
  res.json(tableService.listTables());
});

tablesRouter.get('/seating-conflicts', (_req, res) => {
  res.json(tableService.detectSeatingConflicts());
});

tablesRouter.get('/:id', (req, res) => {
  res.json(tableService.getTable(req.params.id));
});

tablesRouter.post('/', validateBody(tableCreateSchema), (req, res) => {
  res.status(201).json(tableService.createTable(req.body));
});

tablesRouter.patch('/:id', validateBody(tableUpdateSchema), (req, res) => {
  res.json(tableService.updateTable(req.params.id as string, req.body));
});

tablesRouter.delete('/:id', (req, res) => {
  tableService.deleteTable(req.params.id);
  res.status(204).send();
});

tablesRouter.post('/:id/seat', validateBody(seatGuestSchema), (req, res) => {
  res.json(tableService.seatGuest(req.params.id as string, req.body.guestId));
});
