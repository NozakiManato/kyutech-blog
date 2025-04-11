"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface PostButtonProps {
  onPost: () => Promise<void>;
  disabled?: boolean;
}

export function PostButton({ onPost, disabled = false }: PostButtonProps) {
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    try {
      setIsPosting(true);
      await onPost();
      toast.success("投稿しました", {
        description: "記事が正常に投稿されました。",
      });
    } catch (error) {
      console.error(error);
      toast.error("エラーが発生しました", {
        description: "記事の投稿中にエラーが発生しました。",
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Button onClick={handlePost} disabled={disabled || isPosting}>
      {isPosting ? "投稿中..." : "投稿"}
    </Button>
  );
}
