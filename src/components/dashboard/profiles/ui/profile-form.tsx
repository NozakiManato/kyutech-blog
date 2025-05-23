"use client";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const ProfileForm = ({
  isUploading,
  previewUrl,
  inputFileRef,
  handleFileChange,
}) => {
  const { control, setValue, getValues } = useFormContext();
  const { user, isLoaded } = useUser();

  // ユーザー情報が読み込まれた後にメールアドレスを設定
  useEffect(() => {
    if (isLoaded && user) {
      const currentEmail = getValues("email");
      // メールアドレスが空の場合のみ、Clerkのメールアドレスを設定
      if (!currentEmail) {
        const userEmail = user.emailAddresses[0]?.emailAddress || "";
        setValue("email", userEmail);
      }
    }
  }, [isLoaded, user, setValue, getValues]);

  useEffect(() => {
    if (previewUrl && previewUrl !== "未設定") {
      setValue("imageUrl", previewUrl);
    }
  }, [previewUrl, setValue]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>名前</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>メールアドレス</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                placeholder="example@example.com"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex space-x-4">
        <FormField
          control={control}
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

        <FormField
          control={control}
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
      </div>
      <FormField
        control={control}
        name="imageUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>プロフィール画像</FormLabel>
            <div className="flex  space-x-2">
              {previewUrl && (
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="プロフィール画像"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => inputFileRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? "アップロード中..." : "画像を選択"}
                </Button>
                <Input
                  type="file"
                  ref={inputFileRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
                <Input type="hidden" {...field} />
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem className="space-y-2 col-span-2">
            <FormLabel>自己紹介</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="自己紹介を入力してください"
                className="resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="github"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>GitHub URL</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://github.com/username" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="x"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>X (Twitter) URL</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://x.com/username" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="instagram"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Instagram URL</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://instagram.com/username" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProfileForm;
