import { Router } from 'express';
import { guestCreateSchema, guestUpdateSchema } from '@buttercup/shared/schemas';
import { guestService } from '../services/GuestService';
import { validateBody } from '../middleware/validateBody';

export const guestsRouter = Router();

guestsRouter.get('/', (req, res) => {
  // TODO: implement pagination and sorting; page/sort params are accepted but ignored
  const { search, page, sort } = req.query;
  void page;
  void sort;
  res.json(guestService.listGuests({ search: typeof search === 'string' ? search : undefined }));
});

guestsRouter.get('/rsvp-stats', (_req, res) => {
  res.json(guestService.getRsvpStats());
});

guestsRouter.get('/:id', (req, res) => {
  res.json(guestService.getGuest(req.params.id));
});

guestsRouter.post('/', validateBody(guestCreateSchema), (req, res) => {
  res.status(201).json(guestService.createGuest(req.body));
});

guestsRouter.patch('/:id', validateBody(guestUpdateSchema), (req, res) => {
  res.json(guestService.updateGuest(req.params.id as string, req.body));
});

guestsRouter.delete('/:id', (req, res) => {
  guestService.deleteGuest(req.params.id);
  res.status(204).send();
});
