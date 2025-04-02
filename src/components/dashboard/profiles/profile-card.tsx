import { Card, CardHeader } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";
import ProfileHeader from "./ui/profile-header";
import { requireAuth } from "@/lib/auth";

const ProfileCard = async () => {
  const { profile } = await requireAuth();
  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <ProfileHeader profile={profile} />
        </CardHeader>
      </Card>
    </TooltipProvider>
  );
};

export default ProfileCard;
