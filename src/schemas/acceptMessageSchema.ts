import { z } from "zod";

export const acceptMassageSchema = z.object({
  acceptMassage: z.boolean(),
});
