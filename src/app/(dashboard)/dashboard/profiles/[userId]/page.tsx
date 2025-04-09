import ProfileCard from "@/components/dashboard/profiles/profile-card";
import { getUserTechSkills } from "@/lib/actions";
import { requireAuth } from "@/lib/auth";
import { getUserProfile } from "@/lib/prisma/user";
import { notFound } from "next/navigation";

const Profile = async ({ params }: { params: { userId: string } }) => {
  const { userId: currentUserId } = await requireAuth();
  const profile = await getUserProfile(params.userId);

  if (!profile) {
    notFound();
  }

  const skills = await getUserTechSkills(profile.id);
  const isOwnProfile = currentUserId === params.userId;

  return (
    <>
      <div>
        <ProfileCard
          initialProfile={{
            id: profile.id,
            userId: profile.userId,
            name: profile.name,
            imageUrl: profile.imageUrl,
            researchLab: profile.researchLab,
            academicYear: profile.academicYear,
            description: profile.description || "",
            isCheckedIn: profile.isCheckedIn,
            github: profile.github || "",
            x: profile.x || "",
            instagram: profile.instagram || "",
          }}
          initialtechSkills={skills}
          isOwnProfile={isOwnProfile}
        />
      </div>
    </>
  );
};

export default Profile;
