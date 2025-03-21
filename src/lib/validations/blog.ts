import * as z from "zod";

export const postCreateSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
});
