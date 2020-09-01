import cron from 'node-cron';
import axios from 'axios';
import Opportunities from '../schemas/Opportunities';
import PipedriveDealsController from '../controllers/PipedriveController';
import PipedriveController from '../controllers/PipedriveController';
const { create } = require('xmlbuilder2');

var task;

class TimerWorker {
  /**
   * Start a job to integrate deals from Pipedrive to Bling
   * @param {*} interval Quantity in seconds to run the job
   */
  async startJob(domain, interval, api_token) {
    console.log(`Starting job every ${interval}s`);

    task = cron.schedule(`*/${interval} * * * * *`, async () => {
      console.count(`Executing integration...`);
      const deals = await PipedriveController.getWonDeals(domain, api_token);
      console.log(`Pipedrive response status: ${deals.status}`);
      deals.data.data.map(async (deal) => {
        // Store a Opportunitie in mongoDB
        console.log(`Storing deal ${deal.id} in mongodb`);
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
        const products = await PipedriveController.getDealProducts(
          domain,
          api_token,
          deal.id
        );
        console.log(products);
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
