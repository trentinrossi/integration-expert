import axios from 'axios';

class BlingController {
  async createOrder(xml, bling_token) {
    try {
      const api_url = `https://bling.com.br/Api/v2/pedido/json?apikey=${bling_token}&xml=${xml}`;
      return await axios.post(api_url);
    } catch (err) {
      console.log(`Error to create order ${err}`);
    }
  }
}

export default new BlingController();
