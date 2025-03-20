"use client";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { useState } from "react";
import { Icon } from "../icons/icon";

const PostCreateButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {};

  return (
    <button
      className={cn(buttonVariants(), {
        "cursor-not-allowed opacity-60": isLoading,
      })}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Icon.spinner className="animate-spin mr-2 h-4 w-4" />
      ) : (
        <Icon.add className="mr-2 h-4 w-4" />
      )}
      新しい投稿
    </button>
  );
};

export default PostCreateButton;
