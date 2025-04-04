import ProfileCard from "@/components/dashboard/profiles/profile-card";
import { requireAuth } from "@/lib/auth";

const Profile = async () => {
  const { profile } = await requireAuth();

  return (
    <>
      <div>
        <ProfileCard initialProfile={profile} />
      </div>
    </>
  );
};

export default Profile;
