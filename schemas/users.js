import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
  is_active: z.boolean().optional().default(true),
  role: z.array(z.enum(["admin", "user"]).default("user"), {
    invalid_type_error: "Role must be an array of strings",
  }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const validateUser = (user) => {
  return userSchema.safeParse(user);
};

export const validateUserUpdate = (user) => {
  return userSchema.partial().safeParse(user);
};
