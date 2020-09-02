import TimerWorker from '../worker/TimerWorker';

class SchedulerController {
  start(req, res) {
    const { domain, interval } = req.body;
    const { pipedrive_token, bling_token } = req.headers;

    TimerWorker.startJob(domain, interval, pipedrive_token, bling_token);

    return res.send({ status: 'Integration started!' });
  }

  stop(req, res) {
    TimerWorker.stopJob();

    return res.send({ status: 'Stop successfully' });
  }

  status(req, res) {
    const ret = TimerWorker.statusJob();
    if (ret >= 0) {
      res.send({ status: `Job is active and has already run ${ret} times.` });
    } else {
      res.send({ status: `Job is stopped.` });
    }
  }
}

export default new SchedulerController();
