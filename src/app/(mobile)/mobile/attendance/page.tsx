import RoomStatusManager from "@/components/mobile/attendance/room-status-manager";
import { requireAuth } from "@/lib/auth";

export default async function RoomStatusPage() {
  const { profile } = await requireAuth();

  if (!profile) {
    return <div>プロフィールがありません</div>;
  }
  return (
    <div className="mx-auto max-w-md">
      <RoomStatusManager
        profile={{
          ...profile,
          email: profile.email ?? "",
          description: profile.description ?? "",
          github: profile.github ?? "",
          x: profile.x ?? "",
          instagram: profile.instagram ?? "",
        }}
      />
    </div>
  );
}
