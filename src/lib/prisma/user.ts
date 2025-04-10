import { db } from "../db";

export const getUserProfile = async (userIdOrId: string) => {
  try {
    // まずuserIdで検索
    let profile = await db.userProfile.findUnique({
      where: { userId: userIdOrId },
    });

    // 見つからない場合はidで検索
    if (!profile) {
      profile = await db.userProfile.findUnique({
        where: { id: userIdOrId },
      });
    }

    return profile;
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
  isCheckedIn,
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
  isCheckedIn: boolean;
}) => {
  try {
    return await db.userProfile.create({
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
        isCheckedIn,
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
    isCheckedIn: boolean;
  }
) => {
  try {
    return await db.userProfile.update({
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
