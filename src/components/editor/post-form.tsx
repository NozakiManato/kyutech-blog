"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { createPostAction, updatePostAction } from "@/lib/actions";
import Script from "next/script";
import { Editor } from "./editor";
import { Input } from "../ui/input";

const formSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  content: z.any().optional(), // EditorJSのJSONデータを受け取るためにany型を使用
  published: z.boolean().default(false),
});

interface PostFormProps {
  authorId: string;
  post?: {
    id: string;
    title: string;
    content: any;
    published: boolean;
  };
  isEditing?: boolean;
}

export function PostForm({ authorId, post, isEditing = false }: PostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorContent, setEditorContent] = useState<any>(
    post?.content || null
  );
  const [editorLoaded, setEditorLoaded] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || null,
      published: post?.published || false,
    },
  });

  // EditorJSのスクリプトがロードされたらフラグを設定
  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  // エディタの内容が変更されたときにフォームの値を更新
  useEffect(() => {
    if (editorContent) {
      form.setValue("content", editorContent);
    }
  }, [editorContent, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      if (isEditing && post) {
        formData.append("id", post.id);
        formData.append("title", values.title);
        formData.append("content", JSON.stringify(values.content));
        formData.append("published", values.published ? "true" : "false");

        const result = await updatePostAction(formData);

        if (result.success) {
          router.push(`/blog`);
        } else {
          console.error("Error updating post:", result.error);
          form.setError("root", {
            message: "投稿の更新中にエラーが発生しました",
          });
        }
      } else {
        formData.append("title", values.title);
        formData.append("content", JSON.stringify(values.content));
        formData.append("published", values.published ? "true" : "false");
        formData.append("authorId", authorId);

        const result = await createPostAction(formData);

        if (result.success) {
          router.push("/blog");
        } else {
          console.error("Error creating post:", result.error);
          form.setError("root", {
            message: "投稿の作成中にエラーが発生しました",
          });
        }
      }
    } catch (error) {
      console.error("Error submitting post:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>タイトル</FormLabel>
                <FormControl>
                  <Input placeholder="投稿のタイトルを入力" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>内容</FormLabel>
            <FormControl>
              {editorLoaded && (
                <Editor
                  onChange={setEditorContent}
                  initialData={post?.content}
                  editorId="post-editor"
                  placeholder="投稿の内容を入力..."
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>公開する</FormLabel>
                  <FormDescription>
                    チェックすると投稿が公開されます。チェックしない場合は下書きとして保存されます。
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {form.formState.errors.root && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              キャンセル
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditing
                  ? "更新中..."
                  : "作成中..."
                : isEditing
                ? "投稿を更新"
                : "投稿を作成"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
