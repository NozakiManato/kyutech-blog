import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const getAllSkills = async () => {
  try {
    return await prisma.techSkill.findMany({
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.error("Error fetching all skills", error);
    return null;
  }
};

export const getUserSkills = async (profileId: string) => {
  try {
    return await prisma.techSkill.findMany({
      where: {
        profileId,
      },
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.error("Error fetching profile skills", error);
    return null;
  }
};

export const getSkillById = async (id: string) => {
  try {
    return await prisma.techSkill.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("Error fetching skill:", error);
    return null;
  }
};

export const createSkill = async (data: {
  name: string;
  category: string;
  iconName?: string;
  profileId: string;
}) => {
  try {
    return await prisma.techSkill.create({
      data,
    });
  } catch (error) {
    console.error("Error createing skill:", error);
    throw error;
  }
};

export const updateSkill = async (
  id: string,
  data: {
    name?: string;
    category?: string;
    iconName?: string;
  }
) => {
  try {
    return await prisma.techSkill.update({
      where: {
        id,
      },
      data,
    });
  } catch (error) {
    console.error("Error updating skill:", error);
    throw error;
  }
};

export const deleteSkill = async (id: string) => {
  try {
    return await prisma.techSkill.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("Error deleting skill:", error);
    throw error;
  }
};

export const deleteAllUserSkills = async (profileId: string) => {
  try {
    return await prisma.techSkill.deleteMany({
      where: {
        profileId,
      },
    });
  } catch (error) {
    console.error("Error deleting user skills:", error);
    throw error;
  }
};
