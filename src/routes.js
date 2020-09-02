import Router from 'express';
import SchedulerController from './app/controllers/SchedulerController';
import OpportunityController from './app/controllers/OpportunityController';

const routes = new Router();

routes.post('/start', SchedulerController.start);
routes.post('/stop', SchedulerController.stop);
routes.get('/status', SchedulerController.status);
routes.get('/opportunity', OpportunityController.list);

export default routes;
