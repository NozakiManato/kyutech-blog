import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserProfile } from "@/lib/prisma/user";

export type AuthResult = {
  userId: string;
  user: Awaited<ReturnType<typeof currentUser>>;
  profile: Awaited<ReturnType<typeof getUserProfile>>;
};

/**
 * 認証とプロフィール取得を行う共通関数
 * @param options 設定オプション
 * @returns 認証情報とプロフィール情報
 */
export async function requireAuth({
  requireProfile = true,
  redirectTo = {
    unauthenticated: "/sign-in",
    noProfile: "/additional-info",
  },
}: {
  requireProfile?: boolean;
  redirectTo?: {
    unauthenticated: string;
    noProfile: string;
  };
} = {}): Promise<AuthResult> {
  const { userId } = await auth();
  const user = await currentUser();

  // 認証チェック
  if (!userId || !user) {
    redirect(redirectTo.unauthenticated);
  }

  // プロフィール取得
  const profile = await getUserProfile(userId);

  // プロフィールチェック（必要な場合）
  if (requireProfile && (!profile?.researchLab || !profile?.academicYear)) {
    redirect(redirectTo.noProfile);
  }

  return { userId, user, profile };
}
