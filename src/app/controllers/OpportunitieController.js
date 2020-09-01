import Opportunities from '../schemas/Opportunities';

class OpportunitieController {
  async list(req, res) {
    const result = await Opportunities.aggregate([
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

export default new OpportunitieController();
