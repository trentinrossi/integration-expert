import { Router } from 'express';
import UserController from './app/controllers/OpportunitieController';
import SchedulerController from './app/controllers/SchedulerController';
import OpportunitieController from './app/controllers/OpportunitieController';

const routes = new Router();

routes.post('/start', SchedulerController.start);
routes.post('/stop', SchedulerController.stop);
routes.get('/opportunity', OpportunitieController.list);

export default routes;
