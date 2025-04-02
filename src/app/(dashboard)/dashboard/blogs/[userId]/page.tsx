import DashboardHeader from "@/components/dashboard/blogs/dashboard-header";
import DashBoardShell from "@/components/dashboard/blogs/dashboard-shell";

import PostItem from "@/components/dashboard/blogs/post-item";
import { Icon } from "@/components/icons/icon";
import { Button } from "@/components/ui/button";
import { getUserPosts } from "@/lib/prisma/post";
import { EditProfileProps } from "@/types";
import Link from "next/link";
import React from "react";

const DashboardPage = async (props: EditProfileProps) => {
  const params = await props.params;

  const posts = await getUserPosts(params.userId);

  return (
    <DashBoardShell>
      <DashboardHeader heading="記事投稿" text="記事の投稿と管理">
        <Link href={"/posts/create"}>
          <Button>
            <Icon.add />
            新しい投稿
          </Button>
        </Link>
      </DashboardHeader>
      <div>
        {posts?.length ? (
          <div className="divide-y border rounded-md">
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="ml-2">投稿がありません</div>
        )}
      </div>
    </DashBoardShell>
  );
};

export default DashboardPage;
