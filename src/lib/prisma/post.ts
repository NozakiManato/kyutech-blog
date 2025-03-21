import { DataProps } from "@/types";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const getAllPosts = async () => {
  try {
    return await prisma.post.findMany({
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
    return await prisma.post.findMany({
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
    return await prisma.post.findUnique({
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
    return await prisma.post.create({
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
    return await prisma.post.update({
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
    return await prisma.post.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};
