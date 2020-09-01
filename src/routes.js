import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SchedulerController from './app/controllers/SchedulerController';

const routes = new Router();

routes.post('/start', SchedulerController.start);
routes.post('/stop', SchedulerController.stop);
// routes.post('/updateTimer', UserController.store);
// routes.get('/wonDeals', PipedriveDealsController.getWonDeals);

export default routes;
