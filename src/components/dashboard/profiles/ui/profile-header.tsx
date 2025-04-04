"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { profileProps } from "@/types";

import SocialCard from "./social-card";

interface ProfileHeaderProps {
  profile: profileProps;
  toggleCheckedInStatus: () => void;
}

const ProfileHeader = ({
  profile,
  toggleCheckedInStatus,
}: ProfileHeaderProps) => {
  return (
    <>
      <div className="flex   gap-6 items-start md:items-center">
        <Avatar className="w-24 h-24 border-2 border-border">
          <AvatarImage src={profile.imageUrl} alt={profile.name} />
          <AvatarFallback>{profile.name}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <CardDescription className="font-medium text-muted-foreground">
                <div>
                  {profile.academicYear}・{profile.researchLab}
                </div>
              </CardDescription>
            </div>
            <div className="pr-20">
              <Button
                variant={"ghost"}
                size={"lg"}
                onClick={toggleCheckedInStatus}
                className="p-0 h-auto"
              >
                {profile.isCheckedIn ? (
                  <Badge className="text-lg px-10 py-5 bg-green-500">
                    在室中
                  </Badge>
                ) : (
                  <Badge variant={"outline"} className="text-lg px-10 py-5">
                    不在
                  </Badge>
                )}
              </Button>
            </div>
          </div>
          <SocialCard profile={profile} />
        </div>
      </div>
      <div className="mt-3">{profile.description}</div>
    </>
  );
};

export default ProfileHeader;
