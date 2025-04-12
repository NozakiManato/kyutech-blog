import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  props: { params: Promise<{ userId: string }> }
) {
  const params = await props.params;
  try {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return new NextResponse("認証が必要です", { status: 401 });
    }

    const targetUserId = params.userId;

    let profile = await db.userProfile.findUnique({
      where: { userId: targetUserId },
    });

    if (!profile) {
      profile = await db.userProfile.findUnique({
        where: { id: targetUserId },
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[PROFILE_GET]", error);
    return new NextResponse("サーバーエラーが発生しました", { status: 500 });
  }
}
