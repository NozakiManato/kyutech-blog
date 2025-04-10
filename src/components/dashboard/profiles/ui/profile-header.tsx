"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SocialLinks } from "./social-links";
import { profileProps } from "@/types";

interface ProfileHeaderProps {
  profile: profileProps;
  onToggleCheckedIn: () => void;
  isOwnProfile?: boolean;
}

export const ProfileHeader = ({
  profile,
  onToggleCheckedIn,
  isOwnProfile = false,
}: ProfileHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.imageUrl} alt={profile.name} />
          <AvatarFallback>{profile.name[0]}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{profile.academicYear}</Badge>
            <Badge variant="outline">{profile.researchLab}</Badge>
          </div>
        </div>
        {isOwnProfile && (
          <Button
            variant={profile.isCheckedIn ? "destructive" : "default"}
            onClick={onToggleCheckedIn}
            className="ml-auto"
          >
            {profile.isCheckedIn ? "退室" : "在室"}
          </Button>
        )}
      </div>
      <Separator />
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">自己紹介</h3>
          <p className="text-muted-foreground">{profile.description}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">ソーシャルリンク</h3>
          <SocialLinks
            github={profile.github}
            x={profile.x}
            instagram={profile.instagram}
          />
        </div>
      </div>
    </div>
  );
};
