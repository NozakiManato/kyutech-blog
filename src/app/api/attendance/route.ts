import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("認証が必要です", { status: 401 });
    }

    const { action } = await req.json();
    const profile = await db.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return new NextResponse("プロフィールが見つかりません", { status: 404 });
    }

    // 現在の在室状態を確認
    const activeAttendance = await db.attendance.findFirst({
      where: {
        profileId: profile.id,
        checkOut: null,
      },
    });

    // プロフィールの在室状態と実際のAttendanceレコードの整合性を確認
    if (profile.isCheckedIn && !activeAttendance) {
      // プロフィールは在室中とマークされているが、実際のレコードがない場合
      await db.userProfile.update({
        where: { id: profile.id },
        data: { isCheckedIn: false },
      });
      return new NextResponse(
        "在室状態をリセットしました。もう一度入室してください。",
        { status: 200 }
      );
    }

    if (action === "check-in") {
      // 既存の未完了のチェックインを探す
      if (activeAttendance) {
        return new NextResponse("既に入室済みです", { status: 400 });
      }

      // 新しいチェックインを作成
      await db.attendance.create({
        data: {
          profileId: profile.id,
        },
      });

      // プロフィールの在室状態を更新
      await db.userProfile.update({
        where: { id: profile.id },
        data: { isCheckedIn: true },
      });
    } else if (action === "check-out") {
      // 未完了のチェックインを探す
      if (!activeAttendance) {
        // プロフィールの在室状態を更新（整合性を保つため）
        await db.userProfile.update({
          where: { id: profile.id },
          data: { isCheckedIn: false },
        });
        return new NextResponse(
          "アクティブな入室記録が見つかりませんでしたが、在室状態をリセットしました。",
          { status: 200 }
        );
      }

      // チェックアウトを記録
      await db.attendance.update({
        where: { id: activeAttendance.id },
        data: { checkOut: new Date() },
      });

      // プロフィールの在室状態を更新
      await db.userProfile.update({
        where: { id: profile.id },
        data: { isCheckedIn: false },
      });
    } else {
      return new NextResponse("不正なアクションです", { status: 400 });
    }

    return new NextResponse("成功", { status: 200 });
  } catch (error) {
    console.error("[ATTENDANCE_POST]", error);
    return new NextResponse("サーバーエラーが発生しました", { status: 500 });
  }
}

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

    // URLから研究室名を取得
    const url = new URL(req.url);
    const labName = url.searchParams.get("lab");

    // 研究室メンバーの在室状況を取得
    const labMembers = await db.userProfile.findMany({
      where: labName
        ? { researchLab: labName }
        : { researchLab: profile.researchLab },
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
      orderBy: [{ isCheckedIn: "desc" }, { name: "asc" }],
    });

    return NextResponse.json(labMembers);
  } catch (error) {
    console.error("[ATTENDANCE_GET]", error);
    return new NextResponse("サーバーエラーが発生しました", { status: 500 });
  }
}
