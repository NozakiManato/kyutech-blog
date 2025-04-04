"use client";
import { profileFormSchema } from "@/lib/validations/profile";
import { ProfileFormProps } from "@/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveUserProfileAction } from "@/lib/actions";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";
import { Input } from "../ui/input";

const AdditionalInfoForm = ({ userId }: ProfileFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      researchLab: "",
      academicYear: "",
      description: "",
      github: "",
      x: "",
      instagram: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      setIsSubmitting(true);

      await saveUserProfileAction({
        userId,
        name: `${user?.lastName}${user?.firstName}` || "",
        imageUrl: user?.imageUrl || "",
        researchLab: values.researchLab,
        academicYear: values.academicYear,
        description: values.description,
        github: values.github,
        x: values.x,
        instagram: values.instagram,
        isCheckedIn: true,
      });

      router.push("/");
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
                    <SelectItem value="芹川研究室">芹川研究室</SelectItem>
                    <SelectItem value="張研究室">張研究室</SelectItem>
                    <SelectItem value="山脇研究室">山脇研究室</SelectItem>
                    <SelectItem value="楊研究室">楊研究室</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>必須</FormDescription>
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
                    <SelectItem value="B4">B4</SelectItem>
                    <SelectItem value="M1">M1</SelectItem>
                    <SelectItem value="M2">M2</SelectItem>
                    <SelectItem value="D1">D1</SelectItem>
                    <SelectItem value="D2">D2</SelectItem>
                    <SelectItem value="先生">先生</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>必須</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>自己紹介・ひとこと</FormLabel>
                <FormControl>
                  <Input placeholder="自由に記入してください" {...field} />
                </FormControl>
                <FormDescription>任意</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub</FormLabel>
                <FormControl>
                  <Input placeholder="GitHub" {...field} />
                </FormControl>
                <FormDescription>任意</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="x"
            render={({ field }) => (
              <FormItem>
                <FormLabel>X</FormLabel>
                <FormControl>
                  <Input placeholder="X" {...field} />
                </FormControl>
                <FormDescription>任意</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input placeholder="Instagram" {...field} />
                </FormControl>
                <FormDescription>任意</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "情報を保存"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AdditionalInfoForm;
