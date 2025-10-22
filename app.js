import express, { json } from "express";

export const createApp = ({ model }) => {
  const app = express();
  app.use(json());
  app.use(corsMiddleware());
  app.disable("x-powered-by");

  app.use("/user", createUserRouter({ model: model }));

  const PORT = process.env.PORT ?? 1234;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
