import { PostCard } from "@/components/blog/post-card";

import { Icon } from "@/components/icons/icon";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth";
import { getAllPosts } from "@/lib/prisma/post";
import Link from "next/link";

const BlogPage = async () => {
  const posts = await getAllPosts();
  const { profile } = await requireAuth();
  return (
    <div className="container mx-auto py-6 lg:py-10 ">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-4">
          <h1 className="font-extrabold text-4xl lg:text-5xl tracking-tight">
            Blog🚀
          </h1>
          <p className="text-muted-foreground text-xl">
            週報やゼミの資料、研究のことなんでも投稿してください。
          </p>
          <Link
            href={"/dashboard/docs"}
            className="text-xl text-muted-foreground"
          >
            ドキュメントページへ
          </Link>
        </div>
        <Link href={"/posts/create"}>
          <Button>
            <Icon.add />
            新しい投稿
          </Button>
        </Link>
      </div>
      <hr className="my-8" />

      {posts?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">まだ投稿がありません</p>
          <Link href="/posts/create">
            <Button>最初の投稿を作成</Button>
          </Link>
        </div>
      ) : (
        <div className="grid  gap-6">
          {posts?.map((post) => (
            <PostCard key={post.id} post={post} profile={profile!} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
