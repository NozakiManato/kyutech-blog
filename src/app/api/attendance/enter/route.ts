import { createAttendance } from "@/lib/prisma/attendance";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

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

    // 既にアクティブな入室記録（check_outがnull）があるか確認
    const activeAttendance = await db.attendance.findFirst({
      where: {
        user_id: userId,
        check_out: null,
      },
      orderBy: {
        check_in: "desc",
      },
    });

    if (activeAttendance) {
      return NextResponse.json({
        success: false,
        isCheckedIn: true,
        message: "既にチェックイン済みです",
      });
    }

    await createAttendance(userId);

    return NextResponse.json({
      success: true,
      isCheckedIn: true,
      message: "チェックインが完了しました",
    });
  } catch (error) {
    console.error("チェックインAPIエラー:", error);

    const errorMessage =
      error instanceof Error ? error.message : "チェックインに失敗しました";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
