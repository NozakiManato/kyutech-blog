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
import PostOperations from "../dashboard/post-operations";
import { requireAuth } from "@/lib/auth";
import { PostContent } from "../editor/post-content";

export async function PostCard({ post }: PostCardProps) {
  const { profile } = await requireAuth();

  const getPlainTextFromEditorJS = (content: any): string => {
    if (!content || !content.blocks) {
      return content?.text || "";
    }

    // 最初の段落ブロックを探す
    const paragraphBlock = content.blocks.find(
      (block: any) => block.type === "paragraph" || block.type === "text"
    );

    if (paragraphBlock) {
      return paragraphBlock.data.text || "";
    }

    // 段落ブロックがない場合は最初のブロックのテキストを使用
    const firstBlock = content.blocks[0];
    if (firstBlock && firstBlock.data && firstBlock.data.text) {
      return firstBlock.data.text;
    }

    // テキストが見つからない場合は空文字列を返す
    return "";
  };
  const contentText = getPlainTextFromEditorJS(post.content);
  const truncatedContent =
    contentText.length > 150
      ? `${contentText.substring(0, 150)}...`
      : contentText;

  // 投稿日時を「〜前」の形式で表示
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: ja,
  });

  const isAuthor = profile?.id == post.author?.id;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{post.title}</CardTitle>
          <div>
            {!post.published && (
              <Badge variant="outline" className="ml-2">
                下書き
              </Badge>
            )}
          </div>
          <div>{isAuthor && <PostOperations post={post} />}</div>
        </div>
        {post.author && (
          <CardDescription>
            <div className="flex justify-between">
              <div>
                投稿者:{post.author.name}({post.author.researchLab}{" "}
                {post.author.academicYear})
              </div>
              <div>{timeAgo}</div>
            </div>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <div>
          <PostContent data={post.content} />
        </div>
      </CardContent>
    </Card>
  );
}
