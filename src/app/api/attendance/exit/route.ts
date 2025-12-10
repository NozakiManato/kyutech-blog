import { updateAttendance } from "@/lib/prisma/attendance";
import { PresenceStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "ユーザーIDが必要です。" },
        { status: 400 }
      );
    }

    // 既にチェックアウト済みか確認
    const profile = await db.userProfile.findUnique({
      where: { id: userId },
      select: { isCheckedIn: true },
    });
    if (profile && !profile.isCheckedIn) {
      return NextResponse.json({
        success: false,
        isCheckedIn: false,
        message: "既にチェックアウト済みです",
      });
    }

    // チェックイン記録があれば更新、なければプロフィールの状態のみ更新
    try {
      await updateAttendance(userId, { nextStatus: PresenceStatus.OFF_CAMPUS });
    } catch (error) {
      // チェックイン記録が見つからない場合は、プロフィールの状態のみを更新
      console.error("チェックイン記録の更新エラー:", error);
      console.warn(
        "チェックイン記録が見つかりませんが、プロフィールの状態を更新します"
      );
    }

    // 学内状態も確実に解除（updateAttendanceが成功した場合でも、ここで確実に更新）
    await db.userProfile.update({
      where: { id: userId },
      data: {
        presenceStatus: PresenceStatus.OFF_CAMPUS,
        isCheckedIn: false,
      },
    });

    return NextResponse.json({
      success: true,
      isCheckedIn: false,
      presenceStatus: PresenceStatus.OFF_CAMPUS,
      message: "チェックアウトが完了しました",
    });
  } catch (error) {
    console.error("チェックアウトAPIエラー:", error);

    const errorMessage =
      error instanceof Error ? error.message : "チェックアウトに失敗しました";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
