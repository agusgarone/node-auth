import { verifyAccessToken } from "../utils/auth.js";

export const requireAuth = (req, res, next) => {
  console.log({
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  if (req.originalUrl !== "/auth/login") {
    const authHeader = req.headers.authorization;

    const token = authHeader.startsWith("Bearer") ? authHeader.slice(7) : null;

    if (!token)
      return res
        .status(401)
        .json({ code: "UNAUTHORIZED", message: "Falta token" });
    try {
      const payload = verifyAccessToken(token);
      console.log({ payload });
      // (req).user = { id: payload.sub, roles: payload.roles || [] };
      next();
    } catch {
      return res
        .status(401)
        .json({ code: "UNAUTHORIZED", message: "Token inválido o vencido" });
    }
  } else {
    next();
  }
};
