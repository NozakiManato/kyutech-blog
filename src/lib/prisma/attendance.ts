import { db } from "../db";

export const createAttendance = async (profileId: string) => {
  try {
    return await db.attendance.create({
      data: {
        user_id: profileId,
        check_in: new Date(),
      },
    });
  } catch (error) {
    console.error("Error creating attendance:", error);
    throw error;
  }
};

export const updateAttendance = async (profileId: string) => {
  try {
    const attendance = await db.attendance.findFirst({
      where: {
        user_id: profileId,
        check_out: null,
      },
      orderBy: {
        check_in: "desc",
      },
    });

    if (!attendance) {
      throw new Error("チェックイン記録が見つかりません");
    }

    return await db.attendance.update({
      where: {
        id: attendance.id,
      },
      data: {
        check_out: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    throw error;
  }
};
