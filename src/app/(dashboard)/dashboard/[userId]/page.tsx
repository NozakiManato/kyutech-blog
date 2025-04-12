import DashBoardShell from "@/components/dashboard/blogs/dashboard-shell";
import { AttendanceDashboard } from "@/components/attendance/attendance-dashboard";

interface DashboardPageProps {
  params: Promise<{
    userId: string;
  }>;
}

const DashboardPage = async (props: DashboardPageProps) => {
  const targetUserIdOrId = (await props.params).userId;
  return (
    <DashBoardShell>
      <AttendanceDashboard targetUserId={targetUserIdOrId} />
    </DashBoardShell>
  );
};

export default DashboardPage;
