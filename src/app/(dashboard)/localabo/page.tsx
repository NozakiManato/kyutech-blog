import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceList } from "@/components/attendance/attendance-list";
import { getUserProfile } from "@/lib/prisma/user";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function LocalaboPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await getUserProfile(userId);

  if (!profile) {
    redirect("/profile");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>研究室在室状況</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {profile.researchLab}の在室状況をリアルタイムで表示しています。
            </p>
            <AttendanceList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
