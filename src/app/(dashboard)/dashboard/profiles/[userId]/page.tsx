import ProfileCard from "@/components/dashboard/profiles/profile-card";
import { getUserTechSkills } from "@/lib/actions";
import { requireAuth } from "@/lib/auth";

const Profile = async () => {
  const { profile } = await requireAuth();
  const skills = await getUserTechSkills(profile!.id);

  return (
    <>
      <div>
        <ProfileCard initialProfile={profile} initialtechSkills={skills} />
      </div>
    </>
  );
};

export default Profile;
