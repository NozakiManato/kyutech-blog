"use client";
import { saveUserProfileAction } from "@/lib/actions";
import { authFormSchema } from "@/lib/validations/auth";
import { ProfileFormProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const ProfileForm = ({ userId, defaultValues }: ProfileFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues,
  });
  const onSubmit = async (values: z.infer<typeof authFormSchema>) => {
    try {
      setIsSubmitting(true);

      await saveUserProfileAction({
        userId,
        researchLab: values.researchLab,
        academicYear: values.academicYear,
      });

      router.push("/profile");
      router.refresh();
    } catch (error) {
      console.error("Error saving user profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="border rounded-md p-4">
      <h2 className="text-lg font-medium mb-4">追加情報</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="researchLab"
            render={({ field }) => (
              <FormItem>
                <FormLabel>研究室</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="研究室を選ぶ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="serikawa">芹川研究室</SelectItem>
                    <SelectItem value="zhang">張研究室</SelectItem>
                    <SelectItem value="yamawaki">山脇研究室</SelectItem>
                    <SelectItem value="yang">楊研究室</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="academicYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>学年</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="学年を選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="b4">B4</SelectItem>
                    <SelectItem value="m1">M1</SelectItem>
                    <SelectItem value="m2">M2</SelectItem>
                    <SelectItem value="d1">D1</SelectItem>
                    <SelectItem value="d2">D2</SelectItem>
                    <SelectItem value="teacher">先生</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/profile")}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "保存中..." : "変更を保存"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
