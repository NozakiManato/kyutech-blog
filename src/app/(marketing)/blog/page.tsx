"use client";

import { PostCard } from "@/components/blog/post-card";
import { Icon } from "@/components/icons/icon";
import { Button } from "@/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Prisma } from "@prisma/client";

const POSTS_PER_PAGE = 10;

type Post = {
  id: string;
  title: string;
  content: Prisma.JsonValue;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    id: string;
    name: string;
    researchLab: string;
    academicYear: string;
  };
};

const BlogPage = () => {
  const { ref, inView } = useInView();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<Post[]>({
    queryKey: ["posts"],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await fetch(
        `/api/posts?page=${pageParam}&limit=${POSTS_PER_PAGE}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < POSTS_PER_PAGE) return undefined;
      return pages.length + 1;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (status === "error") {
    return <div>エラーが発生しました: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-6 lg:py-10">
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

      {status === "pending" ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      ) : data?.pages[0]?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">まだ投稿がありません</p>
          <Link href="/posts/create">
            <Button>最初の投稿を作成</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {data?.pages.map((page) =>
            page.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                profile={{
                  name: post.author?.name || "",
                  id: post.author?.id || "",
                  createdAt: post.createdAt,
                  updatedAt: post.updatedAt,
                  userId: post.author?.id || "",
                  researchLab: post.author?.researchLab || "",
                  academicYear: post.author?.academicYear || "",
                }}
              />
            ))
          )}
          <div ref={ref} className="h-10">
            {isFetchingNextPage && (
              <div className="text-center">
                <p className="text-muted-foreground">読み込み中...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
