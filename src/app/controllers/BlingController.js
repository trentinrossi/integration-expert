import axios from 'axios';

class BlingController {
  async createOrder(xml) {
    try {
      const api_url = `https://bling.com.br/Api/v2/pedido/json?apikey=4ad0492316b974e25dfa287d9b4889116a32f76efd95aa34f748c1d258e05eb093280176&xml=${xml}`;
      return await axios.post(api_url);
    } catch (err) {
      console.log(`Error to create order ${err}`);
    }
  }
}

export default new BlingController();
