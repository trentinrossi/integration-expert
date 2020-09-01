import cron from 'node-cron';
import axios from 'axios';
import Opportunities from '../schemas/Opportunities';
const { create } = require('xmlbuilder2');

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

      await axios
        .get(api_url)
        .then((res) => {
          console.log(`Pipedrive response status: ${res.status}`);
          res.data.data.map((deal) => {
            // Store a Opportunitie in mongoDB
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
                obs: `Pedido inserido via integração`,
                cliente: {
                  numero: deal.person_id.value,
                  nome: deal.person_id.name,
                  email: deal.person_id.email.value,
                },
                itens: [],
              },
            };

            const id = deal.id;
            axios
              .get(
                `https://${domain}.pipedrive.com/api/v1/deals/${id}/products?start=0&api_token=${api_token}`
              )
              .then((resProduct) => {
                // console.log(resProduct.data);
                if (resProduct.data.data) {
                  resProduct.data.data.map((prod) => {
                    console.log('Add item');
                    orderObj.pedido.itens.push = {
                      item: {
                        codigo: prod.product_id,
                        descricao: prod.name,
                        un: 'pc',
                        qtde: prod.quantity,
                        vlr_unit: prod.item_price,
                      },
                    };
                  });
                }
              })
              .catch((error) => {
                console.log(`Error to return products: ${error}`);
              });

            console.log(orderObj);
            const doc = create(orderObj);

            // const bling_url = `https://bling.com.br/Api/v2/pedidos/json?apikey=4ad0492316b974e25dfa287d9b4889116a32f76efd95aa34f748c1d258e05eb093280176&xml=${doc}`;
            // axios
            //   .post(bling_url)
            //   .then((res_bling) => {
            //     console.log(res_bling);
            //   })
            //   .catch((err) => {
            //     console.log(`Error to send onder to Bling: ${err}`);
            //   });
            const xml = doc.end({ prettyPrint: true });
            console.log(xml);
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
