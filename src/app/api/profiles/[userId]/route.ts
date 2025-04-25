import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserProfile } from "@/lib/prisma/user";

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

    const profile = await getUserProfile(targetUserId);
    return NextResponse.json(profile);
  } catch (error) {
    console.error("[PROFILE_GET]", error);
    return new NextResponse("サーバーエラーが発生しました", { status: 500 });
  }
}
