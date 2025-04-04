"use client";

import { techIcons } from "@/components/icons/tech-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { useState } from "react";

type Props = {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
};

const IconSelector = ({ selectedIcon, onSelectIcon }: Props) => {
  const [searchIcon, setSearchIcon] = useState("");

  const filteredIcons = Object.entries(techIcons).filter(([name]) => {
    return name.toLowerCase().includes(searchIcon.toLowerCase());
  });

  return (
    <div>
      <Label>アイコン選択</Label>
      <Input
        placeholder="アイコンを検索..."
        value={searchIcon}
        onChange={(e) => setSearchIcon(e.target.value)}
        className="mb-2"
      />
      <div className="border rounded-md p-2">
        <ScrollArea className="h-40">
          <div className="grid grid-cols-4 gap-2 p-1">
            <TooltipProvider>
              {filteredIcons.map(([name, Icon]) => (
                <Tooltip key={name}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={selectedIcon === name ? "default" : "outline"}
                      size={"icon"}
                      className="h-20 w-20"
                      onClick={() => onSelectIcon(name)}
                    >
                      <Icon className="w-20 h-20" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default IconSelector;
