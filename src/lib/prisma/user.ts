import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const getUserProfile = async (userId: string) => {
  try {
    return await prisma.userProfile.findUnique({
      where: { userId },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const createUserProfile = async ({
  userId,
  name,
  imageUrl,
  researchLab,
  academicYear,
  description,
  github,
  x,
  instagram,
}: {
  userId: string;
  name: string;
  imageUrl: string;
  researchLab: string;
  academicYear: string;
  description: string;
  github: string;
  x: string;
  instagram: string;
}) => {
  try {
    return await prisma.userProfile.create({
      data: {
        userId,
        name,
        imageUrl,
        researchLab,
        academicYear,
        description,
        github,
        x,
        instagram,
      },
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  userId: string,
  data: {
    name?: string;
    imageUrl: string;
    researchLab: string;
    academicYear: string;
    description: string;
    github: string;
    x: string;
    instagram: string;
  }
) => {
  try {
    return await prisma.userProfile.update({
      where: { userId },
      data,
    });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === "P2025") {
      return null;
    }
    console.error("Error updating user profile:", error);
    throw error;
  }
};
