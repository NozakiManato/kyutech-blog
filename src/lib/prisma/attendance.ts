import { db } from "../db";

export const createAttendance = async (profileId: string) => {
  try {
    return await db.attendance.create({
      data: {
        profileId,
        checkIn: new Date(),
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
        profileId,
        checkOut: null,
      },
      orderBy: {
        checkIn: "desc",
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
        checkOut: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    throw error;
  }
};
