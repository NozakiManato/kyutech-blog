import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("認証が必要です", { status: 401 });
    }

    // 全研究室の在室状況を取得
    const allMembers = await db.userProfile.findMany({
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
            checkOut: null,
          },
          select: {
            checkIn: true,
          },
          take: 1,
        },
      },
      orderBy: [
        { researchLab: "asc" },
        { isCheckedIn: "desc" },
        { name: "asc" },
      ],
    });

    return NextResponse.json(allMembers);
  } catch (error) {
    console.error("[ATTENDANCE_ALL_GET]", error);
    return new NextResponse("サーバーエラーが発生しました", { status: 500 });
  }
}
