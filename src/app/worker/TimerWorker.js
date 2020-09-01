import cron from 'node-cron';
import axios from 'axios';
import Opportunities from '../schemas/Opportunities';
import PipedriveDealsController from '../controllers/PipedriveController';
import PipedriveController from '../controllers/PipedriveController';
import BlingController from '../controllers/BlingController';
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
        // Store a basic opportunitie in mongoDB
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

        // Get deal products from pipedrive
        console.log(`Getting products from deal ${deal.id} in pipedrive...`);
        const products = await PipedriveController.getDealProducts(
          domain,
          api_token,
          deal.id
        );

        // Add products in orderObj to convert in XML
        if (products.data.data) {
          products.data.data.map((prod) => {
            console.log(`Item ${prod.name}`);
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

        // console.log(orderObj);
        const doc = create({ encoding: 'UTF-8' }, orderObj);
        const xml = doc.end({ prettyPrint: true });
        // console.log(orderObj.pedido.itens);
        // console.log(xml);
        console.log(`Sending a order ${deal.id} to bling...`);
        const order = await BlingController.createOrder(xml);

        if (order.data.retorno.erros) {
          console.log(order.data.retorno.erros);
        } else {
          if (order.data.retorno.pedidos.pedido.idPedido) {
            console.log(
              `Order ${order.data.retorno.pedidos.pedido.idPedido} created succesfully`
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
    console.count(`Integration stopped.`);
  }
}

export default new TimerWorker();
