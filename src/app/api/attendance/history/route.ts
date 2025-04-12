import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("認証が必要です", { status: 401 });
    }

    const profile = await db.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return new NextResponse("プロフィールが見つかりません", { status: 404 });
    }

    // URLからパラメータを取得
    const url = new URL(req.url);
    const targetUserId = url.searchParams.get("userId");
    const limit = parseInt(url.searchParams.get("limit") || "30");
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    // 対象ユーザーのプロフィールを取得
    let targetProfile = profile;

    // userIdパラメータが存在し、undefinedでない場合のみ別のユーザーを検索
    if (targetUserId && targetUserId !== "undefined") {
      // まずidで検索
      let foundProfile = await db.userProfile.findUnique({
        where: { id: targetUserId },
      });

      // idで見つからない場合はuserIdで検索
      if (!foundProfile) {
        foundProfile = await db.userProfile.findUnique({
          where: { userId: targetUserId },
        });
      }

      if (foundProfile) {
        targetProfile = foundProfile;
      } else {
        return new NextResponse("対象ユーザーのプロフィールが見つかりません", {
          status: 404,
        });
      }
    }

    // 在室記録を取得
    const attendanceRecords = await db.attendance.findMany({
      where: {
        user_id: targetProfile.id,
      },
      orderBy: {
        check_in: "desc",
      },
      skip,
      take: limit,
    });

    // 総レコード数を取得
    const totalRecords = await db.attendance.count({
      where: {
        user_id: targetProfile.id,
      },
    });

    return NextResponse.json({
      records: attendanceRecords,
      total: totalRecords,
      page,
      limit,
      totalPages: Math.ceil(totalRecords / limit),
    });
  } catch (error) {
    console.error("[ATTENDANCE_HISTORY_GET]", error);
    return new NextResponse("サーバーエラーが発生しました", { status: 500 });
  }
}
