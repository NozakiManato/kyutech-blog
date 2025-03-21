import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashBoardShell from "@/components/dashboard/dashboard-shell";
import PostButton from "@/components/dashboard/post-button";
import PostItem from "@/components/dashboard/post-item";
import { getUserPosts } from "@/lib/prisma/post";
import { EditProfileProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const DashboardPage = async (props: EditProfileProps) => {
  const params = props.params;
  const { userId: currentUserId } = await auth();

  if (!currentUserId) {
    redirect("/sign-in");
  }

  const posts = await getUserPosts(params.userId);

  return (
    <DashBoardShell>
      <DashboardHeader heading="記事投稿" text="記事の投稿と管理">
        <PostButton />
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
