"use client";
import { authFormSchema } from "@/lib/validations/auth";
import { AdditionalInfoFormProps } from "@/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveUserProfile } from "@/lib/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Select, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import { Button } from "../ui/button";

const AdditionalInfoForm = ({ userId }: AdditionalInfoFormProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      researchLab: "",
      academicYear: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof authFormSchema>) => {
    try {
      setIsSubmitting(true);

      await saveUserProfile({
        userId,
        researchLab: values.researchLab,
        academicYear: values.academicYear,
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
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "情報を保存"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AdditionalInfoForm;
