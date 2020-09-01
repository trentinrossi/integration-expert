import Opportunities from '../schemas/Opportunities';

class UserController {
  async store(req, res) {
    const { id, name, email, provider } = req.body;

    await Opportunities.create({
      content: name,
    });

    return res.json({ id, name, email, provider });
  }
}

export default new UserController();
