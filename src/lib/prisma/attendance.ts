import { db } from "../db";

const toJST = (date: Date) => {
  return new Date(date.getTime() + 9 * 60 * 60 * 1000);
};

export const createAttendance = async (profileId: string, comment?: string) => {
  try {
    return await db.attendance.create({
      data: {
        user_id: profileId,
        check_in: toJST(new Date()),
        comment: comment || null,
      },
    });
  } catch (error) {
    console.error("Error creating attendance:", error);
    throw error;
  }
};

export const updateAttendance = async (profileId: string, comment?: string) => {
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
        check_out: toJST(new Date()),
        comment: comment || null,
      },
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    throw error;
  }
};

export const getUserAttendance = async (profileId: string) => {
  try {
    const attendances = await db.attendance.findMany({
      where: {
        user_id: profileId,
      },
      orderBy: {
        check_in: "desc",
      },
    });

    return attendances.map((attendance) => ({
      ...attendance,
      check_in: attendance.check_in,
      check_out: attendance.check_out ? attendance.check_out : null,
      duration: attendance.check_out
        ? (attendance.check_out.getTime() - attendance.check_in.getTime()) /
          (1000 * 60 * 60)
        : null,
    }));
  } catch (error) {
    console.error("Error getting user attendance:", error);
    throw error;
  }
};
