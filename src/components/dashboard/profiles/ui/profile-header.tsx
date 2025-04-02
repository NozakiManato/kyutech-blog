"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import SocailCard from "./social-card";
import EditForm from "./edit-form";
import { Edit, Save, X } from "lucide-react";

const ProfileHeader = ({ profile }) => {
  const [editMode, setEditMode] = useState(false);

  const [checkedIn, setCheckedIn] = useState(profile.isCheckedIn);

  const toggleCheckedInStatus = () => {
    setCheckedIn(!checkedIn);
  };
  const handleProfileEdit = () => {
    setEditMode(true);
  };
  const handleProfileSave = () => {
    setEditMode(false);
  };
  const handleProfileCancel = () => {
    setEditMode(false);
  };

  return (
    <>
      <div className="flex justify-end mb-2">
        {!editMode ? (
          <Button variant={"outline"} size={"sm"} onClick={handleProfileEdit}>
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            編集
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={handleProfileCancel}
            >
              <X className="h-3.5 w-3.5 mr-1.5" />
              キャンセル
            </Button>
            <Button variant={"default"} size={"sm"} onClick={handleProfileSave}>
              <Save className="h-3.5 w-3.5 mr-1.5" />
              保存
            </Button>
          </div>
        )}
      </div>
      {!editMode ? (
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <Avatar className="w-24 h-24 border-2 border-border">
            <AvatarImage src={profile?.imageUrl} alt={profile?.name} />
            <AvatarFallback>{profile?.name}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{profile?.name}</CardTitle>
                <CardDescription className="text-lg font-medium text-muted-foreground">
                  {profile?.description}
                </CardDescription>
                <p className="text-sm text-muted-foreground">
                  {profile?.researchLab}
                </p>
              </div>
              <div className="pr-20">
                <Button
                  variant={"ghost"}
                  size={"lg"}
                  onClick={toggleCheckedInStatus}
                  className="p-0 h-auto"
                >
                  {profile?.isCheckedIn ? (
                    <Badge className="text-lg px-10 py-5 bg-green-500">
                      在室中
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-lg px-10 py-5">
                      不在
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
            <SocailCard profile={profile} />
          </div>
        </div>
      ) : (
        <EditForm profile={profile} />
      )}
    </>
  );
};

export default ProfileHeader;
