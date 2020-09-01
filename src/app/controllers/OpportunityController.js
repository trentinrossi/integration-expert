import Opportunity from '../schemas/Opportunity';

class OpportunityController {
  async list(req, res) {
    const result = await Opportunity.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$add_time' } },
          total: { $sum: '$value' },
        },
      },
    ]);

    return res.json({ result });
  }
}

export default new OpportunityController();
