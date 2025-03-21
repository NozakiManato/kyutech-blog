"use client";
import { PostOperationsProps } from "@/types";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Icon } from "../icons/icon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deletePostAction } from "@/lib/actions";

const PostOperations = ({ post }: PostOperationsProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const formData = new FormData();
      formData.append("id", post.id);

      const result = await deletePostAction(formData);

      if (result.success) {
        router.push("/blog");
      } else {
        console.error("Error deleting post:", result.error);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Icon.ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link href={`/editor/${post.id}`} className="w-full">
              編集
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="bg-destructive text-destructive-foreground focus:bg-destructive/90"
            onClick={handleDelete}
          >
            削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default PostOperations;
