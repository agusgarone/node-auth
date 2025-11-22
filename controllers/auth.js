import { verify } from "argon2";
import { validateAuth } from "../schemas/auth.js";
import { generateRefreshToken, generateToken } from "../utils/auth.js";

export class AuthController {
  constructor({ model, refreshTokenModel }) {
    this.model = model;
    this.refreshTokenModel = refreshTokenModel;
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

    console.log("user", user);

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

    const refreshToken = generateRefreshToken();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenModel.create({
      input: {
        token: refreshToken,
        userId: user._id,
        expiresAt: expiresAt,
        createdAt: new Date(),
      },
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      user: { name: user.name, email: user.email },
    });
  };

  refresh = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    // Buscar el refresh token en la base de datos
    const storedToken = await this.refreshTokenModel.getByToken(refreshToken);

    if (!storedToken) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // Verificar si el token ha expirado
    if (new Date() > new Date(storedToken.expiresAt)) {
      // Eliminar el token expirado
      await this.refreshTokenModel.delete(refreshToken);
      return res.status(401).json({ error: "Refresh token has expired" });
    }

    // Obtener el usuario
    const user = await this.model.getById(storedToken.userId);

    if (!user || !user.is_active) {
      return res.status(401).json({ error: "User not found or inactive" });
    }

    // Generar nuevos tokens
    const newAccessToken = generateToken({ id: user._id, roles: user.role });
    const newRefreshToken = generateRefreshToken();

    // Eliminar el refresh token antiguo
    await this.refreshTokenModel.delete(refreshToken);

    // Guardar el nuevo refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenModel.create({
      input: {
        token: newRefreshToken,
        userId: user._id,
        expiresAt: expiresAt,
        createdAt: new Date(),
      },
    });

    return res.status(200).json({
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      tokenType: "Bearer",
    });
  };

  logout = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    // Eliminar el refresh token de la base de datos
    const deleted = await this.refreshTokenModel.delete(refreshToken);

    if (!deleted) {
      return res.status(404).json({ error: "Refresh token not found" });
    }

    return res.status(200).json({
      message: "Logout successful",
    });
  };
}
