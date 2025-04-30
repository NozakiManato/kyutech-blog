import { z } from "zod";

export const ContactFormSchema = z.object({
  name: z.string().min(1, { message: "名前は必須です" }),
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください" }),
  subject: z.string().min(1, { message: "件名は必須です" }),
  message: z
    .string()
    .min(10, { message: "メッセージは10文字以上入力してください" }),
});
