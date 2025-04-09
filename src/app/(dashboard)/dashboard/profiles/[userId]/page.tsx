import ProfileCard from "@/components/dashboard/profiles/profile-card";
import { getUserTechSkills } from "@/lib/actions";
import { requireAuth } from "@/lib/auth";
import { getUserProfile } from "@/lib/prisma/user";
import { notFound } from "next/navigation";

type Props = {
  params: { userId: string };
};

export default async function Profile(props: Props) {
  const { userId: currentUserId } = await requireAuth();
  const userId = props.params.userId;
  const profile = await getUserProfile(userId);

  if (!profile) {
    notFound();
  }

  const skills = await getUserTechSkills(profile.id);
  const isOwnProfile = currentUserId === userId;

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
}
