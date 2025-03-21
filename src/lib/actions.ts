"use server";

import { SaveUserProfileProps } from "@/types";
import { revalidatePath } from "next/cache";
import { createUserProfile, updateUserProfile } from "./prisma/user";
import { createPost, deletePost, updatePost } from "./prisma/post";

export const saveUserProfileAction = async ({
  userId,
  name,
  researchLab,
  academicYear,
}: SaveUserProfileProps) => {
  try {
    const result = await updateUserProfile(userId, {
      researchLab,
      academicYear,
    });

    if (!result) {
      await createUserProfile({ userId, name, researchLab, academicYear });
    }
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Error saving user profile:", error);
    return { success: false, error };
  }
};

export const createPostAction = async (formData: FormData) => {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const published = formData.get("published") === "true";
    const authorId = formData.get("authorId") as string;

    if (!title || !content || !authorId) {
      return { success: false, error: "必須フィールドが不足しています" };
    }
    await createPost({ title, content, published, authorId });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error createing post:", error);
    return { success: false, error };
  }
};

export const updatePostAction = async (formData: FormData) => {
  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const published = formData.get("published") === "true";

    if (!title || !content || !id) {
      return { success: false, error: "必須フィールドが不足しています" };
    }
    await updatePost(id, { title, content, published });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error createing post:", error);
    return { success: false, error };
  }
};

export const deletePostAction = async (formData: FormData) => {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return { success: false, error: "投稿IDが不足しています" };
    }

    await deletePost(id);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, error };
  }
};
