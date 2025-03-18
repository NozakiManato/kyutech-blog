import AdditionalInfoForm from "@/components/auth/additional-info-form";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const AdditionalInfoPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">追加情報</h1>
          <p className="mt-2 text-muted-foreground">
            研究室と学年の情報を入力してください
          </p>
        </div>
        <AdditionalInfoForm userId={userId} />
      </div>
    </div>
  );
};

export default AdditionalInfoPage;
