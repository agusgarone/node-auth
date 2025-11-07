import express, { json } from "express";
import { corsMiddleware } from "./middlewares/cors.js";
import { requireAuth } from "./middlewares/auth.js";

import { userRouter } from "./routes/users.js";
import { authRouter } from "./routes/auth.js";

export const createApp = ({ model }) => {
  const app = express();
  app.use(json());
  app.use(corsMiddleware());
  app.use(requireAuth());
  app.disable("x-powered-by");

  app.use("/users", userRouter({ model: model }));
  app.use("/auth", authRouter({ model: model }));

  const PORT = process.env.PORT ?? 1234;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
