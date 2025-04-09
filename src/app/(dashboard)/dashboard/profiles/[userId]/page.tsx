import ProfileCard from "@/components/dashboard/profiles/profile-card";
import { getUserTechSkills } from "@/lib/actions";
import { requireAuth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function Profile(props: Props) {
  const { userId: currentUserId } = await requireAuth();
  const userId = (await props.params).userId;
  const { profile } = await requireAuth();

  if (!profile) {
    if (currentUserId === userId) {
      redirect("/additional-info");
    } else {
      notFound();
    }
  }

  const skills = await getUserTechSkills(profile.id);
  const isOwnProfile = currentUserId === profile.userId;

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
