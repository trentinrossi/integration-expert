import cron from 'node-cron';
import PipedriveController from '../controllers/PipedriveController';
import BlingController from '../controllers/BlingController';
import Opportunity from '../schemas/Opportunity';
const { create } = require('xmlbuilder2');

var task;

class TimerWorker {
  /**
   * Start a job to integrate deals from Pipedrive to Bling
   * @param {*} interval Quantity in seconds to schedule and run the job
   */
  async startJob(domain, interval, api_token) {
    console.log(`Starting job every ${interval}s`);

    task = cron.schedule(`*/${interval} * * * * *`, async () => {
      console.count(`Executing integration...`);

      // Getting deals from Pipedrive
      const deals = await PipedriveController.getWonDeals(domain, api_token);
      console.log(`Pipedrive response status: ${deals.status}`);

      deals.data.data.map(async (deal) => {
        // Store a basic opportunitie in mongoDB
        console.log(`Storing deal ${deal.id} in mongodb`);
        Opportunity.findOneAndUpdate(
          { id: deal.id },
          deal,
          { upsert: true },
          (err, doc, ret) => {
            if (err) {
              console.error(`Error to save deal in mongodb: ${err}`);
            }
          }
        );

        // Creating a Bling Order Object to transform in XML
        const orderObj = {
          pedido: {
            obs: `Pedido inserido via integracao`,
            cliente: {
              numero: deal.person_id.value,
              nome: deal.person_id.name,
              email: deal.person_id.email.value,
            },
            itens: { item: [] },
          },
        };

        // Get related deal products from pipedrive
        console.log(`Getting products from deal ${deal.id} in pipedrive...`);
        const products = await PipedriveController.getDealProducts(
          domain,
          api_token,
          deal.id
        );

        // Add products in orderObj to convert in XML
        if (products.data.data) {
          products.data.data.map((prod) => {
            const item = {
              codigo: prod.product_id,
              descricao: prod.name,
              un: 'pc',
              qtde: prod.quantity,
              vlr_unit: prod.item_price,
            };
            orderObj.pedido.itens.item.push(item);
          });
        }

        const doc = create({ encoding: 'UTF-8' }, orderObj);
        const xml = doc.end({ prettyPrint: true });

        // Store a Order in Bling
        console.log(`Sending a order ${deal.id} to bling...`);
        const order = await BlingController.createOrder(xml);

        if (order.data.retorno.erros) {
          console.error(order.data.retorno.erros);
        } else {
          if (order.data.retorno.pedidos[0].pedido.idPedido) {
            console.error(
              `Order ${order.data.retorno.pedidos[0].pedido.idPedido} created succesfully on Bling`
            );
          }
        }
      });
    });
  }

  /**
   * Stop the actual job
   */
  stopJob() {
    task.stop();
    console.log(`Integration stopped.`);
  }
}

export default new TimerWorker();
