"use server";

import { SaveUserProfileProps } from "@/types";
import { revalidatePath } from "next/cache";
import { createUserProfile, updateUserProfile } from "./prisma/user";

export const saveUserProfile = async ({
  userId,
  researchLab,
  academicYear,
}: SaveUserProfileProps) => {
  try {
    const result = await updateUserProfile(userId, {
      researchLab,
      academicYear,
    });

    if (!result) {
      await createUserProfile({
        userId,
        researchLab,
        academicYear,
      });
    }
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Error saving user profile:", error);
    return { success: false, error };
  }
};
