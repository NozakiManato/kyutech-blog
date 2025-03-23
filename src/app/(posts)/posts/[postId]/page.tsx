import { PostForm } from "@/components/editor/post-form";
import { requireAuth } from "@/lib/auth";
import { getPostById } from "@/lib/prisma/post";
import { EditPostPageProps } from "@/types";
import { notFound, redirect } from "next/navigation";

const EditPostPage = async (props: EditPostPageProps) => {
  const params = await props.params;
  const { profile } = await requireAuth();

  const post = await getPostById(params.postId);

  if (!post) {
    notFound();
  }
  if (profile?.id !== post.authorId) {
    redirect(`/posts/${params.postId}`);
  }

  return (
    <div className="container">
      <PostForm
        authorId={profile.id}
        post={{
          id: post.id,
          title: post.title,
          content: post.content,
          published: post.published,
        }}
        isEditing={true}
      />
    </div>
  );
};

export default EditPostPage;
