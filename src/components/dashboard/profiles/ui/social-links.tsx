import { Button } from "@/components/ui/button";
import { Github, Twitter, Instagram } from "lucide-react";

interface SocialLinksProps {
  github?: string;
  x?: string;
  instagram?: string;
}

export const SocialLinks = ({ github, x, instagram }: SocialLinksProps) => {
  return (
    <div className="flex space-x-2">
      {github && (
        <Button variant="outline" size="icon" asChild>
          <a href={github} target="_blank" rel="noopener noreferrer">
            <Github className="h-4 w-4" />
          </a>
        </Button>
      )}
      {x && (
        <Button variant="outline" size="icon" asChild>
          <a href={x} target="_blank" rel="noopener noreferrer">
            <Twitter className="h-4 w-4" />
          </a>
        </Button>
      )}
      {instagram && (
        <Button variant="outline" size="icon" asChild>
          <a href={instagram} target="_blank" rel="noopener noreferrer">
            <Instagram className="h-4 w-4" />
          </a>
        </Button>
      )}
    </div>
  );
};
