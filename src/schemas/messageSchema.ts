import { z } from "zod";

export const massageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "content must be altleast 10 characters." })
    .max(300, { message: "content must not be longer than 300 characters." }),
});
