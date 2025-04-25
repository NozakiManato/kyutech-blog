import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { cache } from "react";

// データベースクエリをcache関数でラップ
const getAllMembersAttendance = cache(async () => {
  return await db.userProfile.findMany({
    select: {
      id: true,
      userId: true,
      name: true,
      imageUrl: true,
      isCheckedIn: true,
      academicYear: true,
      researchLab: true,
      Attendance: {
        where: {
          check_out: null,
        },
        select: {
          check_in: true,
        },
        take: 1,
      },
    },
    orderBy: [{ researchLab: "asc" }, { isCheckedIn: "desc" }, { name: "asc" }],
  });
});

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("認証が必要です", { status: 401 });
    }

    // キャッシュされた関数を使用して全メンバーの出席状況を取得
    const allMembers = await getAllMembersAttendance();

    return NextResponse.json(allMembers);
  } catch (error) {
    console.error("[ATTENDANCE_ALL_GET]", error);
    return new NextResponse("サーバーエラーが発生しました", { status: 500 });
  }
}
