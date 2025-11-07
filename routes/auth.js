import { Router } from "express";
import { AuthController } from "../controllers/auth.js";

export const authRouter = ({ model }) => {
  const router = Router();

  const authController = new AuthController({ model });
  router.post("/register", authController.register);
  router.post("/login", authController.login);
  router.post("/refresh", authController.refresh);
  router.post("/logout", authController.logout);

  return router;
};
