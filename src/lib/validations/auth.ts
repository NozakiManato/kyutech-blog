import * as z from "zod";

export const authFormSchema = z.object({
  researchLab: z.string().min(1, "研究室は必須です"),
  academicYear: z.string().min(1, "学年は必須です"),
});
