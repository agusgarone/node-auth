export class UserController {
  constructor({ model }) {
    this.model = model;
  }

  getAll = async (req, res) => {
    const users = await this.model.getAll();
    res.json(users);
  };

  getById = async (req, res) => {
    const { id } = req.params;
    const user = await this.model.getById(id);
    if (user) return res.json(user);
    res.status(404).json({ error: "User not found" });
  };

  create = async (req, res) => {
    const result = validateUser(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.message });
    }
    const newUser = await this.model.create(result.data);
    res.status(201).json(newUser);
  };

  delete = async (req, res) => {
    const { id } = req.params;
    const user = await this.model.delete(id);
    if (user) return res.json(user, { message: "User deleted successfully" });
    res.status(404).json({ error: "User not found" });
  };

  update = async (req, res) => {
    const result = validateUserUpdate(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.message });
    }

    const { id } = req.params;
    const updatedUser = await this.model.update({ id, input: result.data });
    res.json(updatedUser);
  };
}
