import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AllAttendanceList } from "@/components/attendance/all-attendance-list";

export default async function DisplayPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="h-full">
        <AllAttendanceList />
      </div>
    </div>
  );
}
