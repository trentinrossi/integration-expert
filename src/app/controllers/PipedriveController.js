import axios from 'axios';

class PipedriveController {
  async getWonDeals(domain, api_token) {
    try {
      const api_url = `https://${domain}.pipedrive.com/api/v1/deals?status=won&start=0&api_token=${api_token}`;
      return await axios.get(api_url);
    } catch (err) {
      console.error(`Error to return deals ${err}`);
    }
  }

  async getDealProducts(domain, api_token, dealId) {
    try {
      const api_url = `https://${domain}.pipedrive.com/api/v1/deals/${dealId}/products?start=0&api_token=${api_token}`;
      return await axios.get(api_url);
    } catch (err) {
      console.error(`Error to return deal products ${err}`);
    }
  }
}

export default new PipedriveController();
