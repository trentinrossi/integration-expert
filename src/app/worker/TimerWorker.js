import cron from 'node-cron';
import axios from 'axios';
import Opportunities from '../schemas/Opportunities';

var task;

class TimerWorker {
  /**
   * Start a job to integrate deals from Pipedrive to Bling
   * @param {*} interval Quantity in seconds to run the job
   */
  startJob(domain, interval, api_token) {
    console.log(`Starting job every ${interval}s`);
    task = cron.schedule(`*/${interval} * * * * *`, () => {
      console.count(`Executing integration...`);

      const api_url = `https://${domain}.pipedrive.com/api/v1/deals?status=won&start=0&api_token=${api_token}`;

      axios
        .get(api_url)
        .then((res) => {
          console.log(`Pipedrive response status: ${res.status}`);
          res.data.data.map((deal) => {
            Opportunities.findOneAndUpdate(
              { id: deal.id },
              deal,
              { upsert: true },
              (err, doc, ret) => {
                if (err) {
                  console.log('ERRO');
                }
              }
            );
          });
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }

  /**
   * Stop the actual job
   */
  stopJob() {
    task.stop();
    console.count(`Integration stopped.`);
  }
}

export default new TimerWorker();
