import jwt from "jsonwebtoken";

const ACCESS_TTL = "1h";

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: ACCESS_TTL });
};

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
