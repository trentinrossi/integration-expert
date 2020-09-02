import TimerWorker from '../worker/TimerWorker';

class SchedulerController {
  start(req, res) {
    const { domain, interval } = req.body;
    const { pipedrive_token, bling_token } = req.headers;

    if (!domain) {
      return res
        .status(400)
        .json({ error: 'Property domain in body is mandatory' });
    }
    if (!interval) {
      return res
        .status(400)
        .json({ error: 'Property interval in body is mandatory' });
    }
    if (!pipedrive_token) {
      return res
        .status(400)
        .json({ error: 'Header pipedrive_token is mandatory' });
    }
    if (!bling_token) {
      return res.status(400).json({ error: 'Header bling_token is mandatory' });
    }

    const ret = TimerWorker.statusJob();
    if (ret >= 0) {
      return res.status(400).json({ error: 'Job is already running..' });
    }

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
