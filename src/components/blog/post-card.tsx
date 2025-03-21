import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PostCardProps } from "@/types";

export function PostCard({ post, showAuthor = true }: PostCardProps) {
  const contentText = post.content?.text || "";
  const truncatedContent =
    contentText.length > 150
      ? `${contentText.substring(0, 150)}...`
      : post.content;

  // 投稿日時を「〜前」の形式で表示
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: ja,
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{post.title}</CardTitle>
          {!post.published && (
            <Badge variant="outline" className="ml-2">
              下書き
            </Badge>
          )}
        </div>
        {showAuthor && post.author && (
          <CardDescription>
            投稿者:{post.author.name} {timeAgo}
            <br />
            {post.author.researchLab} {post.author.academicYear}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground whitespace-pre-line">
          {truncatedContent}
        </p>
      </CardContent>
      <CardFooter>
        <Link
          href={`/posts/${post.id}`}
          className="text-sm text-primary hover:underline"
        >
          続きを読む
        </Link>
      </CardFooter>
    </Card>
  );
}
