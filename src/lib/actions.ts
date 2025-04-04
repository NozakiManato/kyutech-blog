"use server";

import { SaveUserProfileProps } from "@/types";
import { revalidatePath } from "next/cache";
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
} from "./prisma/user";
import { createPost, deletePost, updatePost } from "./prisma/post";

export const saveUserProfileAction = async ({
  userId,
  name,
  imageUrl,
  researchLab,
  academicYear,
  description,
  github,
  x,
  instagram,
  isCheckedIn,
}: SaveUserProfileProps) => {
  try {
    const result = await updateUserProfile(userId, {
      imageUrl,
      researchLab,
      academicYear,
      description,
      github,
      x,
      instagram,
      isCheckedIn,
    });

    if (!result) {
      await createUserProfile({
        userId,
        name,
        imageUrl,
        researchLab,
        academicYear,
        description,
        github,
        x,
        instagram,
        isCheckedIn,
      });
    }
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Error saving user profile:", error);
    return { success: false, error };
  }
};

export async function toggleCheckedInStatus(
  userId: string,
  isCheckedIn: boolean
) {
  try {
    const profile = await getUserProfile(userId);

    if (!profile) {
      throw new Error("プロフィールが見つかりません");
    }

    await updateUserProfile(userId, {
      name: profile.name,
      imageUrl: profile.imageUrl,
      researchLab: profile.researchLab,
      academicYear: profile.academicYear,
      description: profile.description || "",
      github: profile.github || "",
      x: profile.x || "",
      instagram: profile.instagram || "",
      isCheckedIn,
    });

    revalidatePath("/");
    return isCheckedIn;
  } catch (error) {
    console.error("チェックイン状態更新エラー:", error);
    throw new Error("チェックイン状態の更新に失敗しました");
  }
}

export async function createPostAction(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const contentStr = formData.get("content") as string;
    const published = formData.get("published") === "true";
    const authorId = formData.get("authorId") as string;

    if (!title || !contentStr || !authorId) {
      return { success: false, error: "必須フィールドが不足しています" };
    }

    // 文字列をJSONオブジェクトに変換
    let content;
    try {
      content = JSON.parse(contentStr);

      // EditorJSのデータ構造が不完全な場合の対応
      if (!content.blocks && !content.time) {
        // 単純なテキストとして扱う
        content = {
          blocks: [
            {
              type: "paragraph",
              data: {
                text: contentStr,
              },
            },
          ],
          time: new Date().getTime(),
          version: "2.22.2",
        };
      }

      // コンソールに保存するデータを出力（デバッグ用）
      console.log("Saving content:", content);
    } catch (e) {
      console.error("Error parsing JSON:", e);
      // JSONパースに失敗した場合は単純なテキストとして扱う
      content = {
        blocks: [
          {
            type: "paragraph",
            data: {
              text: contentStr,
            },
          },
        ],
        time: new Date().getTime(),
        version: "2.22.2",
      };
    }

    await createPost({
      title,
      content,
      published,
      authorId,
    });

    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, error };
  }
}

// 投稿の更新アクション
export async function updatePostAction(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const contentStr = formData.get("content") as string;
    const published = formData.get("published") === "true";

    if (!id || !title || !contentStr) {
      return { success: false, error: "必須フィールドが不足しています" };
    }

    // 文字列をJSONオブジェクトに変換
    let content;
    try {
      content = JSON.parse(contentStr);

      // EditorJSのデータ構造が不完全な場合の対応
      if (!content.blocks && !content.time) {
        // 単純なテキストとして扱う
        content = {
          blocks: [
            {
              type: "paragraph",
              data: {
                text: contentStr,
              },
            },
          ],
          time: new Date().getTime(),
          version: "2.22.2",
        };
      }

      // コンソールに保存するデータを出力（デバッグ用）
      console.log("Updating content:", content);
    } catch (e) {
      console.error("Error parsing JSON:", e);
      // JSONパースに失敗した場合は単純なテキストとして扱う
      content = {
        blocks: [
          {
            type: "paragraph",
            data: {
              text: contentStr,
            },
          },
        ],
        time: new Date().getTime(),
        version: "2.22.2",
      };
    }

    await updatePost(id, {
      title,
      content,
      published,
    });

    revalidatePath(`/posts/${id}`);
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error("Error updating post:", error);
    return { success: false, error };
  }
}

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
