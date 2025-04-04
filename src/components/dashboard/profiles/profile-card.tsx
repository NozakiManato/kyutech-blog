"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import React, { useState } from "react";
import ProfileHeader from "./ui/profile-header";

import { ProfileEditButtons } from "./ui/profile-edit-button";
import { ProfileCardProps, profileProps, TechSkill } from "@/types";
import { toast } from "sonner";
import {
  addTechSkill,
  deleteTechSkill,
  saveUserProfileAction,
  toggleCheckedInStatus,
  updateTechSkill,
} from "@/lib/actions";
import ProfileForm from "./ui/profile-form";
import { z } from "zod";
import { profileFormSchema } from "@/lib/validations/profile";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TechSkillsSection from "./ui/tech-skills-section";
import { defaultTechSkills } from "@/components/icons/tech-icons";

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileCard = ({ initialProfile }: ProfileCardProps) => {
  const defaultProfile: profileProps = {
    name: initialProfile?.name || "",
    academicYear: initialProfile?.academicYear || "",
    researchLab: initialProfile?.researchLab || "",
    id: initialProfile?.id || "",
    userId: initialProfile?.userId || "",
    imageUrl: initialProfile?.imageUrl || "",
    description: initialProfile?.description || "",
    isCheckedIn: initialProfile?.isCheckedIn,
    github: initialProfile?.github || "",
    x: initialProfile?.x || "",
    instagram: initialProfile?.instagram || "",
  };

  const [profile, setProfile] = useState<profileProps>(defaultProfile);
  const [techSkills, setTechSkills] = useState<TechSkill[]>(defaultTechSkills);
  const [editMode, setEditMode] = useState(false);
  const [editingProfile, setEditingProfile] = useState<profileProps>({
    ...defaultProfile,
  });
  const [editingSkill, setEditingSkill] = useState<TechSkill | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile.name,
      researchLab: profile.researchLab,
      academicYear: profile.academicYear,
      description: profile.description || "",
      isCheckedIn: profile.isCheckedIn,
      github: profile.github || "",
      x: profile.x || "",
      instagram: profile.instagram || "",
    },
  });

  const handleProfileEdit = () => {
    methods.reset({
      name: profile.name,
      researchLab: profile.researchLab,
      academicYear: profile.academicYear,
      description: profile.description || "",
      isCheckedIn: profile.isCheckedIn,
      github: profile.github || "",
      x: profile.x || "",
      instagram: profile.instagram || "",
    });
    setEditingProfile({ ...profile });
    setEditMode(true);
  };

  const handleProfileSave = async () => {
    try {
      const isValid = await methods.trigger();
      if (!isValid) {
        toast.error("入力内容を確認してください");
        return;
      }
      const formValues = methods.getValues();
      const updatedProfileData = {
        ...profile,
        ...formValues,
      };
      await saveUserProfileAction({
        userId: updatedProfileData.userId,
        name: updatedProfileData.name,
        imageUrl: updatedProfileData.imageUrl,
        researchLab: updatedProfileData.researchLab,
        academicYear: updatedProfileData.academicYear,
        description: updatedProfileData.description,
        x: updatedProfileData.x,
        github: updatedProfileData.github,
        instagram: updatedProfileData.instagram,
        isCheckedIn: updatedProfileData.isCheckedIn,
      });
      setProfile(updatedProfileData);
      setEditMode(false);

      toast.success("プロフィールが保存されました");
    } catch (error) {
      console.error("保存エラー:", error);
      toast.error("プロフィールの保存に失敗しました");
    }
  };

  const handleProfileCancel = () => {
    setEditingProfile({ ...profile });
    setEditMode(false);
  };

  const handleToggleCheckedInStatus = async () => {
    if (!editMode) {
      setProfile({ ...profile, isCheckedIn: !profile.isCheckedIn });
    }
    try {
      const newStatus = await toggleCheckedInStatus(
        profile.userId,
        !profile.isCheckedIn
      );
      setProfile({ ...profile, isCheckedIn: newStatus });
      if (newStatus) {
        toast.success("在室に変更しました");
      } else {
        toast.error("退室に変更しました");
      }
    } catch (error) {
      console.error("チェックイン状態更新エラー:", error);
      toast.error("チェックイン状態の更新に失敗しました");
    }
  };

  const handleAddSkill = async (newSkill: Omit<TechSkill, "id">) => {
    try {
      if (!profile.id) {
        const tempId = Math.random().toString(36).substring(2, 9);
        setTechSkills([...techSkills, { id: tempId, ...newSkill }]);
        return;
      }
      const skill = await addTechSkill(profile.id, newSkill);
      setTechSkills([...techSkills, skill]);
      toast.success("スキルが追加されました");
    } catch (error) {
      console.error("スキル追加エラー:", error);
      toast.error("スキルの追加に失敗しました");
    }
  };
  const handleEditSkill = (skill: TechSkill) => {
    setEditingSkill(skill);
  };

  const handleSaveEditSkill = async () => {
    if (!editingSkill || !profile.id) {
      return;
    }
    try {
      const updatedSkill = await updateTechSkill(editingSkill.id, {
        name: editingSkill.name,
        category: editingSkill.category,
        iconName: editingSkill.iconName,
      });

      setTechSkills(
        techSkills.map((skill) =>
          skill.id === editingSkill.id ? updatedSkill : skill
        )
      );
      setEditingSkill(null);

      toast.success("スキルが更新されました");
    } catch (error) {
      console.error("スキル更新エラー:", error);
      toast.error("スキルの更新に失敗しました");
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      if (!profile.id) {
        setTechSkills(techSkills.filter((skill) => skill.id !== id));
        return;
      }
      await deleteTechSkill(id);
      setTechSkills(techSkills.filter((skill) => skill.id !== id));
      toast.success("スキルが削除されました");
    } catch (error) {
      console.error("スキル削除エラー:", error);
      toast.error("スキルの削除に失敗しました");
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="pb-4">
          <div className="flex justify-center items-center h-40">
            <p>読み込み中...</p>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="mt-5">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-800">プロフィール</h3>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card>
            <CardContent className="pb-4">
              <ProfileEditButtons
                editMode={editMode}
                onEdit={handleProfileEdit}
                onSave={handleProfileSave}
                onCancel={handleProfileCancel}
              />
              <FormProvider {...methods}>
                {!editMode ? (
                  <ProfileHeader
                    profile={profile}
                    toggleCheckedInStatus={handleToggleCheckedInStatus}
                  />
                ) : (
                  <ProfileForm />
                )}
              </FormProvider>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pb-1">
              <TechSkillsSection
                techSkills={techSkills}
                onAddSkill={handleAddSkill}
                onEditSkill={handleEditSkill}
                onSaveEditSkill={handleSaveEditSkill}
                onDeleteSkill={handleDeleteSkill}
                editingSkill={editingSkill}
                setEditingSkill={setEditingSkill}
              />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ProfileCard;
