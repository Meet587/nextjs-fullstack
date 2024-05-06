import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "UserName must be atleast 2 characters")
  .max(20, "user name must not be more than 20 characters.");

export const signUpSchema = z.object({
  userName: userNameValidation,
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "minimum 8 characters required." })
    .max(24, { message: "max 24 characters allow." }),
});
