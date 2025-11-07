import { verify } from "argon2";
import { validateAuth } from "../schemas/auth.js";
import { generateToken } from "../utils/auth.js";

export class AuthController {
  constructor({ model }) {
    this.model = model;
  }

  register = async (req, res) => {
    console.log("register");
    console.log(req.body);
  };

  login = async (req, res) => {
    console.log("login");
    const result = validateAuth(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.message });
    }

    const user = await this.model.getByEmail(result.data.email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.is_active) {
      return res.status(401).json({ error: "User is not active" });
    }

    const isPasswordValid = await verify(user.password, result.data.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const accessToken = generateToken({ id: user._id, roles: user.role });

    return res
      .status(200)
      .json({
        message: "Login successful",
        accessToken,
        tokenType: "Bearer",
        user: { name: user.name, email: user.email },
      });
  };

  refresh = async (req, res) => {
    console.log(req.body);
    console.log("refresh");
  };

  logout = async (req, res) => {
    console.log(req.body);
    console.log("logout");
  };
}
