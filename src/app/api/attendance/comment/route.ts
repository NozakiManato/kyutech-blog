import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("認証が必要です", { status: 401 });
    }

    const { recordId, comment } = await req.json();

    // ユーザーのプロフィールを取得
    const profile = await db.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return new NextResponse("プロフィールが見つかりません", { status: 404 });
    }

    // 在室記録を取得して、ユーザーがその記録の所有者であることを確認
    const attendance = await db.attendance.findUnique({
      where: { id: recordId },
    });

    if (!attendance) {
      return new NextResponse("在室記録が見つかりません", { status: 404 });
    }

    if (attendance.user_id !== profile.id) {
      return new NextResponse("この記録を編集する権限がありません", {
        status: 403,
      });
    }

    // コメントを更新
    await db.attendance.update({
      where: { id: recordId },
      data: { comment },
    });

    return new NextResponse("コメントを更新しました", { status: 200 });
  } catch (error) {
    console.error("[ATTENDANCE_COMMENT_POST]", error);
    return new NextResponse("サーバーエラーが発生しました", { status: 500 });
  }
}
