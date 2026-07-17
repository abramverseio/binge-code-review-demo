import { Router } from 'express';
import { dashboardService } from '../services/DashboardService';

export const dashboardRouter = Router();

dashboardRouter.get('/', (_req, res) => {
  res.json(dashboardService.getSummary());
});
