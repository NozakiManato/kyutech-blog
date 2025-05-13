import { PostForm } from "@/components/editor/post-form";
import { requireAuth } from "@/lib/auth";
import React from "react";

const CreatePostPage = async () => {
  const { profile } = await requireAuth();
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      <PostForm authorId={profile!.id} name={profile!.name} />
    </div>
  );
};

export default CreatePostPage;
