import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { guestsRouter } from './guests.routes';
import { vendorsRouter } from './vendors.routes';
import { tasksRouter } from './tasks.routes';
import { tablesRouter } from './tables.routes';
import { budgetRouter } from './budget.routes';
import { dashboardRouter } from './dashboard.routes';

export const apiRouter = Router();

apiRouter.use(requireAuth);
apiRouter.use('/guests', guestsRouter);
apiRouter.use('/vendors', vendorsRouter);
apiRouter.use('/tasks', tasksRouter);
apiRouter.use('/tables', tablesRouter);
apiRouter.use('/budget', budgetRouter);
apiRouter.use('/dashboard', dashboardRouter);
