import { Button } from "@/components/ui/button";
import { profileProps } from "@/types";
import { Github, Instagram, X } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ProfileSocialProps {
  profile: profileProps;
}

const SocialCard = ({ profile }: ProfileSocialProps) => {
  return (
    <div className="flex flex-wrap gap-2 pt-2">
      <Link
        href={profile.github || "https://github.com/"}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant={"outline"} size={"icon"} className="h-8 gap-1.5">
          <Github className="h-3.5 w-3.5" />
        </Button>
      </Link>
      <Link href={profile.x || ""} target="_blank" rel="noopener noreferrer">
        <Button variant={"outline"} size={"icon"} className="h-8 gap-1.5">
          <X className="h-3.5 w-3.5" />
        </Button>
      </Link>
      <Link
        href={profile.instagram || "#"}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant={"outline"} size={"icon"} className="h-8 gap-1.5">
          <Instagram className="h-3.5 w-3.5" />
        </Button>
      </Link>
    </div>
  );
};

export default SocialCard;
