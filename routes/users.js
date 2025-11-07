import { Router } from "express";
import { UserController } from "../controllers/users.js";

export const userRouter = ({ model }) => {
  const router = Router();

  const userController = new UserController({ model });
  router.get("/", userController.getAll);
  router.post("/", userController.create);

  router.get("/:id", userController.getById);
  router.delete("/:id", userController.delete);
  router.patch("/:id", userController.update);

  return router;
};
