import DashBoardShell from "@/components/dashboard/blogs/dashboard-shell";
import { AttendanceDashboard } from "@/components/attendance/attendance-dashboard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const { userId: currentUserId } = await auth();

  if (!currentUserId) {
    redirect("/sign-in");
  }

  return (
    <DashBoardShell>
      <AttendanceDashboard targetUserId={currentUserId} />
    </DashBoardShell>
  );
};

export default DashboardPage;
