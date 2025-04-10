import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceList } from "@/components/attendance/attendance-list";
import { getUserProfile } from "@/lib/prisma/user";
import { notFound } from "next/navigation";

type Props = {
  params: {
    lab: string;
  };
};

export default async function LabLocalaboPage({ params }: Props) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await getUserProfile(userId);

  if (!profile) {
    redirect("/profile");
  }

  // URLパラメータの研究室名をデコード
  const labName = decodeURIComponent(params.lab);

  // 研究室名が存在するか確認
  const validLabs = ["芹川研究室", "張研究室", "山脇研究室", "楊研究室"];
  if (!validLabs.includes(labName)) {
    notFound();
  }

  return (
    <div className="py-8">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{labName}在室状況</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {labName}の在室状況をリアルタイムで表示しています。
            </p>
            <AttendanceList labName={labName} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
