import { DataProps } from "@/types";
import { db } from "../db";

export const getAllPosts = async () => {
  try {
    return await db.post.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return null;
  }
};

export const getUserPosts = async (authorId: string) => {
  try {
    return await db.post.findMany({
      where: {
        authorId,
      },
      select: {
        id: true,
        title: true,
        published: true,
        createdAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
};

export const getPostById = async (id: string) => {
  try {
    return await db.post.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
};

export const createPost = async (data: DataProps) => {
  try {
    return await db.post.create({
      data,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const updatePost = async (
  id: string,
  data: {
    title?: string;
    content?: string;
    published?: boolean;
  }
) => {
  try {
    return await db.post.update({
      where: {
        id,
      },
      data,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const deletePost = async (id: string) => {
  try {
    return await db.post.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};
