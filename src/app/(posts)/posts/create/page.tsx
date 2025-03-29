import { PostForm } from "@/components/editor/post-form";
import { requireAuth } from "@/lib/auth";
import React from "react";

const CreatePostPage = async () => {
  const { profile } = await requireAuth();
  return <PostForm authorId={profile!.id} name={profile!.name} />;
};

export default CreatePostPage;
