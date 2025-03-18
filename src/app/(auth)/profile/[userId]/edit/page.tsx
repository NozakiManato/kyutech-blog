import ProfileForm from "@/components/auth/profile-form";
import { getUserProfile } from "@/lib/prisma/user";
import { EditProfileProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const EditProfilePage = async (props: EditProfileProps) => {
  const params = await props.params;
  const { userId: currentUserId } = await auth();

  if (!currentUserId) {
    redirect("/sign-in");
  }

  if (params.userId !== currentUserId) {
    redirect("/profile");
  }

  const profile = await getUserProfile(params.userId);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">プロフィール編集</h1>
          <p className="mt-2 text-muted-foreground">
            プロフィール情報を更新する
          </p>
        </div>

        <ProfileForm
          userId={params.userId}
          defaultValues={{
            researchLab: profile?.researchLab || "",
            academicYear: profile?.academicYear || "",
          }}
        />
      </div>
    </div>
  );
};

export default EditProfilePage;
