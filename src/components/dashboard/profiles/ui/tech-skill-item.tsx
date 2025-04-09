import { defaultIcons, techIcons } from "@/components/icons/tech-icons";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { TechSkill } from "@/types";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Edit, Trash } from "lucide-react";
import React from "react";

interface Props {
  skill: TechSkill;
  onEdit: (skill: TechSkill) => void;
  onDelete: (id: string) => void;
  isOwnProfile?: boolean;
}

const TechSkillItem = ({
  skill,
  onEdit,
  onDelete,
  isOwnProfile = false,
}: Props) => {
  const getIconForSkill = (skill: TechSkill) => {
    if (skill.iconName && techIcons[skill.iconName]) {
      const IconComponent = techIcons[skill.iconName];
      return <IconComponent className="h-5 w-5" />;
    }
    if (techIcons[skill.name]) {
      const IconComponent = techIcons[skill.name];
      return <IconComponent className="h-5 w-5" />;
    }
    const DefaultIcon = defaultIcons[skill.category];
    return <DefaultIcon className="h-5 w-5" />;
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative group">
            <div className="flex flex-col items-center justify-center p-4 rounded-md border bg-background hover:bg-accent transition-colors">
              <div className="mb-2 p-2 rounded-full bg-muted flex items-center justify-center">
                {getIconForSkill(skill)}
              </div>
              <span className="text-sm font-medium text-center truncate w-full">
                {skill.name}
              </span>
              {isOwnProfile && (
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="h-6 w-6 bg-background/80 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(skill);
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 bg-background/80 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(skill.id);
                    }}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{skill.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TechSkillItem;
