import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AllAttendanceList } from "@/components/attendance/all-attendance-list";

export default async function LocalaboPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="py-8">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>全研究室在室状況</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              全研究室の在室状況をリアルタイムで表示しています。
            </p>
            <AllAttendanceList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
