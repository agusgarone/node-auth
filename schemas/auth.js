import { z } from "zod";

const authSchema = z.object({
  email: z.email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const validateAuth = (auth) => {
  return authSchema.safeParse(auth);
};
