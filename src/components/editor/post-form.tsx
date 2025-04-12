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
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { createPostAction, updatePostAction } from "@/lib/actions";
import { Editor } from "./editor";
import TextareaAutosize from "react-textarea-autosize";

const formSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  content: z.record(z.unknown()).optional(),
  published: z.boolean().default(false),
});

interface PostFormProps {
  authorId: string;
  post?: {
    id: string;
    title: string;
    content: Record<string, unknown>;
    published: boolean;
  };
  name: string;
  isEditing?: boolean;
}

export function PostForm({
  authorId,
  post,
  name,
  isEditing = false,
}: PostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editorContent, setEditorContent] = useState<Record<
    string,
    unknown
  > | null>(post?.content || null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || {},
      published: post?.published || true,
    },
  });
  const published = form.watch("published");

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

  useEffect(() => {
    if (!isEditing && !post?.title) {
      form.setValue("title", `週報(${name ?? ""})`);
    }
  }, [isEditing, post, name, form]);

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
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center space-x-10">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                キャンセル
              </Button>
              <Button
                name="published"
                type="button"
                variant={"secondary"}
                onClick={() => {
                  const currentValue = form.getValues("published");
                  form.setValue("published", !currentValue);
                }}
              >
                {published ? "公開" : "下書き"}
              </Button>
            </div>

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
          <div className="w-[800px] mx-auto">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TextareaAutosize
                      id="title"
                      autoFocus
                      placeholder="新規投稿"
                      className="w-full resize-none overflow-hidden bg-transparent text-5xl focus:outline-none font-bold"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormItem>
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

          {form.formState.errors.root && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}
        </form>
      </Form>
    </>
  );
}
