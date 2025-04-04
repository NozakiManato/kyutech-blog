"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveUserProfileAction } from "@/lib/actions";
import { profileFormSchema } from "@/lib/validations/profile";
import { zodResolver } from "@hookform/resolvers/zod";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const EditForm = ({ profile, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile.name || "名前",
      researchLab: profile.researchLab || "研究室",
      academicYear: profile.academicYear || "学年",
      description: profile.description || "未設定",
      github: profile.github || "未設定",
      x: profile.x || "未設定",
      instagram: profile.instagram || "未設定",
    },
  });
  useEffect(() => {
    form.reset({
      name: profile.name || "名前",
      researchLab: profile.researchLab || "研究室",
      academicYear: profile.academicYear || "学年",
      description: profile.description || "未設定",
      github: profile.github || "未設定",
      x: profile.x || "未設定",
      instagram: profile.instagram || "未設定",
    });
  }, [profile, form]);

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      setIsSubmitting(true);
      await saveUserProfileAction({
        userId: profile.userId,
        name: values.name,
        imageUrl: profile.imageUrl,
        researchLab: values.researchLab,
        academicYear: values.academicYear,
        description: values.description,
        x: values.x,
        github: values.github,
        instagram: values.instagram,
        isCheckedIn: profile.isCheckedIn,
      });
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error("Error saving user profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="space-y-2">
      <div>
        <Form {...form}>
          <form
            id="profile-edit-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名前</FormLabel>
                  <FormControl>
                    <Input placeholder="名前" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-8 items-center">
              <FormField
                control={form.control}
                name="researchLab"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>研究室</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>コメント</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="研究内容や趣味などなんでも書いてください"
                      {...field}
                    />
                  </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditForm;
