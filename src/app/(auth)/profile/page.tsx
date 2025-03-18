import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserProfile } from "@/lib/prisma/user";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }
  const profile = await getUserProfile(userId);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ユーザープロフィール</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">名前：</div>
            <div>
              {user.lastName} {user.firstName}
            </div>

            <div className="font-medium">メール：</div>
            <div>{user.emailAddresses[0].emailAddress}</div>

            <div className="font-medium">研究室：</div>
            <div>{profile?.researchLab || "未設定"}</div>

            <div className="font-medium">学年：</div>
            <div>{profile?.academicYear || "未設定"}</div>
          </div>

          <div className="flex justify-between mt-6">
            <Link href="/">
              <Button>ホームに戻る</Button>
            </Link>
            <Link href={`/profile/${userId}/edit`}>
              <Button>プロフィール編集</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
