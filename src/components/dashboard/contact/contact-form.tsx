"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface FormState {
  errors?: {
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
    _form?: string[];
  };
  success?: boolean;
  isSubmitting: boolean;
}

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormState({ isSubmitting: true });

    const formData = new FormData(e.currentTarget);
    const formValues = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const response = await fetch("/api/dashboard/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormState({
          errors: data.errors,
          success: false,
          isSubmitting: false,
        });
        return;
      }

      // 成功した場合はフォームをリセット
      e.currentTarget.reset();

      setFormState({
        success: true,
        isSubmitting: false,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormState({
        errors: {
          _form: [
            "通信エラーが発生しました。インターネット接続を確認してください。",
          ],
        },
        success: false,
        isSubmitting: false,
      });
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {formState.errors?._form && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {formState.errors._form.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {formState.success && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>
              お問い合わせありがとうございます。メッセージを受け付けました。
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">お名前</Label>
          <Input
            id="name"
            name="name"
            placeholder="山田 太郎"
            aria-describedby="name-error"
          />
          {formState.errors?.name && (
            <p id="name-error" className="text-sm text-red-500">
              {formState.errors.name.map((error) => (
                <span key={error}>{error}</span>
              ))}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your-email@example.com"
            aria-describedby="email-error"
          />
          {formState.errors?.email && (
            <p id="email-error" className="text-sm text-red-500">
              {formState.errors.email.map((error) => (
                <span key={error}>{error}</span>
              ))}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">件名</Label>
          <Input
            id="subject"
            name="subject"
            placeholder="お問い合わせの件名"
            aria-describedby="subject-error"
          />
          {formState.errors?.subject && (
            <p id="subject-error" className="text-sm text-red-500">
              {formState.errors.subject.map((error) => (
                <span key={error}>{error}</span>
              ))}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">メッセージ</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="お問い合わせ内容をご記入ください"
            rows={5}
            aria-describedby="message-error"
          />
          {formState.errors?.message && (
            <p id="message-error" className="text-sm text-red-500">
              {formState.errors.message.map((error) => (
                <span key={error}>{error}</span>
              ))}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? "送信中..." : "送信する"}
        </Button>
      </form>
    </div>
  );
}
