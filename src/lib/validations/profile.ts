import * as z from "zod";

export const profileFormSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  researchLab: z.string().min(1, "研究室は必須です"),
  academicYear: z.string().min(1, "学年は必須です"),
  description: z.string(),
  email: z.string().email("有効なメールアドレスを入力してください").optional(),
  github: z.string(),
  x: z.string(),
  instagram: z.string(),
  isCheckedIn: z.boolean(),
});
