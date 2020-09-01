import { Router } from 'express';
import UserController from './app/controllers/UserController';
import PipedriveDealsController from './app/controllers/PipedriveDealsController';

const routes = new Router();

routes.post('/start', PipedriveDealsController.start);
routes.post('/stop', PipedriveDealsController.stop);
// routes.post('/updateTimer', UserController.store);
// routes.get('/wonDeals', PipedriveDealsController.getWonDeals);

export default routes;
