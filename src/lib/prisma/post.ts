import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const getPostsById = async (userId: string) => {
  try {
    return await prisma.post.findMany({
      where: {
        authorId: userId,
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
