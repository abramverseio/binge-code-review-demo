import { Router } from 'express';
import { vendorCreateSchema, vendorUpdateSchema } from '@buttercup/shared/schemas';
import { vendorService } from '../services/VendorService';
import { validateBody } from '../middleware/validateBody';

export const vendorsRouter = Router();

vendorsRouter.get('/', (req, res) => {
  // TODO: vendor search is case-sensitive on the client; consider normalizing here too
  void req.query.filter;
  res.json(vendorService.listVendors());
});

vendorsRouter.get('/:id', (req, res) => {
  res.json(vendorService.getVendor(req.params.id));
});

vendorsRouter.post('/', validateBody(vendorCreateSchema), (req, res) => {
  res.status(201).json(vendorService.createVendor(req.body));
});

vendorsRouter.patch('/:id', validateBody(vendorUpdateSchema), (req, res) => {
  res.json(vendorService.updateVendor(req.params.id as string, req.body));
});

vendorsRouter.delete('/:id', (req, res) => {
  vendorService.deleteVendor(req.params.id);
  res.status(204).send();
});
