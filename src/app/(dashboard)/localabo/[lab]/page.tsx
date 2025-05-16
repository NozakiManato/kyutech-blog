import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LabAttendanceList } from "@/components/attendance/lab-attendance-list";
import { notFound } from "next/navigation";
import { WeeklyAttendanceChart } from "@/components/attendance/weekly-attendance-chart";

type Props = {
  params: Promise<{
    lab: string;
  }>;
};

export default async function LabLocalaboPage(props: Props) {
  const params = await props.params;

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
            <LabAttendanceList labName={labName} />
          </CardContent>
        </Card>

        <WeeklyAttendanceChart labName={labName} />
      </div>
    </div>
  );
}
