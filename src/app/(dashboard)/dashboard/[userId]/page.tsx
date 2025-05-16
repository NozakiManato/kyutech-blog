import DashBoardShell from "@/components/dashboard/blogs/dashboard-shell";
import { AttendanceDashboard } from "@/components/attendance/attendance-dashboard";
import { getUserProfile } from "@/lib/prisma/user";

interface DashboardPageProps {
  params: Promise<{
    userId: string;
  }>;
}

const DashboardPage = async (props: DashboardPageProps) => {
  const targetUserId = (await props.params).userId;

  const profile = await getUserProfile(targetUserId);

  const currentUserId = profile!.userId;

  return (
    <DashBoardShell>
      <AttendanceDashboard targetUserId={currentUserId} />
    </DashBoardShell>
  );
};

export default DashboardPage;
