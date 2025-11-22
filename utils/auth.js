import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_TTL = "10m";

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: ACCESS_TTL });
};

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("base64url");
};
