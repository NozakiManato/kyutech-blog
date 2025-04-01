import { PostItemProps } from "@/types";
import { format } from "date-fns/format";
import Link from "next/link";
import React from "react";
import PostOperations from "./post-operations";

const PostItem = ({ post }: PostItemProps) => {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/posts/${post.id}`}
          className="font-semibold hover:underline"
        >
          {post.title}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            {format(post.createdAt, "yyyy-MM-dd")}
          </p>
        </div>
      </div>
      <PostOperations post={post} />
    </div>
  );
};

export default PostItem;
