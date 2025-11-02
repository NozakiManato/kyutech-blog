import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updateAttendance } from "@/lib/prisma/attendance";
import { PresenceStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "ユーザーIDが必要です" },
        { status: 400 }
      );
    }

    const profile = await db.userProfile.findUnique({
      where: { id: userId },
      select: {
        id: true,
        presenceStatus: true,
        isCheckedIn: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "プロフィールが見つかりません" },
        { status: 404 }
      );
    }

    const activeAttendance = await db.attendance.findFirst({
      where: {
        user_id: profile.id,
        check_out: null,
      },
      orderBy: { check_in: "desc" },
    });

    if (activeAttendance) {
      await updateAttendance(profile.id, {
        nextStatus: PresenceStatus.ON_CAMPUS,
      });
    } else {
      await db.userProfile.update({
        where: { id: profile.id },
        data: {
          isCheckedIn: false,
          presenceStatus: PresenceStatus.ON_CAMPUS,
        },
      });
    }

    return NextResponse.json({
      success: true,
      presenceStatus: PresenceStatus.ON_CAMPUS,
      isCheckedIn: false,
      message: "学内ステータスに更新しました",
    });
  } catch (error) {
    console.error("[ATTENDANCE_INSIDE_AREA_POST]", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "学内ステータスの更新に失敗しました";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
