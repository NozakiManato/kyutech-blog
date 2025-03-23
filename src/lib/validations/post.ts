import { z } from "zod";
export const formSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  content: z.any().optional(),
  published: z.boolean().default(false),
});
