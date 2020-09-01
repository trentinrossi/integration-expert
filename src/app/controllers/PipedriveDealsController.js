import Opportunities from '../schemas/Opportunities';
import axios from 'axios';
import TimerWorker from '../worker/TimerWorker';

class PipedriveDealsController {
  start(req, res) {
    const { domain, interval } = req.body;
    const { api_token } = req.headers;

    TimerWorker.startJob(domain, interval, api_token);

    return res.send({ status: 'Integration started!' });
  }

  stop(req, res) {
    TimerWorker.stopJob();

    return res.send({ status: 'Stop succefully' });
  }
}

export default new PipedriveDealsController();
