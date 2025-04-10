import DashboardHeader from "@/components/dashboard/blogs/dashboard-header";
import DashBoardShell from "@/components/dashboard/blogs/dashboard-shell";
import { AttendanceDashboard } from "@/components/attendance/attendance-dashboard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface DashboardPageProps {
  params: {
    userId: string;
  };
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
  const { userId: currentUserId } = await auth();

  if (!currentUserId) {
    redirect("/sign-in");
  }

  return (
    <DashBoardShell>
      <DashboardHeader
        heading="在室記録ダッシュボード"
        text="在室状況の履歴と統計"
      >
        <></>
      </DashboardHeader>
      <AttendanceDashboard targetUserId={params.userId} />
    </DashBoardShell>
  );
};

export default DashboardPage;
