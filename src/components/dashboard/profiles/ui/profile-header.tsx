"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { profileProps } from "@/types";

import SocialCard from "./social-card";
import { AttendanceButton } from "@/components/attendance/attendance-button";

interface ProfileHeaderProps {
  profile: profileProps;
  toggleCheckedInStatus: () => void;
  isOwnProfile?: boolean;
}

const ProfileHeader = ({
  profile,
  toggleCheckedInStatus,
  isOwnProfile = false,
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
            {isOwnProfile && (
              <div className="pr-20">
                <AttendanceButton
                  isCheckedIn={profile.isCheckedIn || false}
                  onStatusChange={toggleCheckedInStatus}
                />
              </div>
            )}
          </div>
          <SocialCard profile={profile} />
        </div>
      </div>
      <div className="mt-3">{profile.description}</div>
    </>
  );
};

export default ProfileHeader;
