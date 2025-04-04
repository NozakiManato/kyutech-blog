"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TechSkill } from "@/types";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import TechSkillItem from "./tech-skill-item";
import AddSkillDialog from "./add-skill-dialog";
import EditSkillDialog from "./edit-skill-dialog";

type Props = {
  techSkills: TechSkill[];
  onAddSkill: (skill: Omit<TechSkill, "id">) => void;
  onEditSkill: (Skill: TechSkill) => void;
  onSaveEditSkill: () => void;
  onDeleteSkill: (id: string) => void;
  editingSkill: TechSkill | null;
  setEditingSkill: (skill: TechSkill | null) => void;
};

const TechSkillsSection = ({
  techSkills,
  onAddSkill,
  onEditSkill,
  onSaveEditSkill,
  onDeleteSkill,
  editingSkill,
  setEditingSkill,
}: Props) => {
  const [activeTab, setActiveTab] = useState("all");
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);

  const filteredSkills =
    activeTab === "all"
      ? techSkills
      : techSkills.filter((skill) => skill.category === activeTab);
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">技術スタック</h3>
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => setIsAddSkillOpen(true)}
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          スキル追加
        </Button>
      </div>
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full justify-start">
          <TabsTrigger value="all">すべて</TabsTrigger>
          <TabsTrigger value="frontend">フロントエンド</TabsTrigger>
          <TabsTrigger value="backend">バックエンド</TabsTrigger>
          <TabsTrigger value="database">データベース</TabsTrigger>
          <TabsTrigger value="ai">機械学習</TabsTrigger>
          <TabsTrigger value="image processing">画像処理</TabsTrigger>
          <TabsTrigger value="fpga">FPGA</TabsTrigger>
          <TabsTrigger value="devops">DevOps</TabsTrigger>
          <TabsTrigger value="other">その他</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredSkills.map((skill) => (
              <TechSkillItem
                key={skill.id}
                skill={skill}
                onEdit={onEditSkill}
                onDelete={onDeleteSkill}
              />
            ))}
            {filteredSkills.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                このカテゴリーにはスキルがありません。「スキル追加」ボタンから追加してください。
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AddSkillDialog
        isOpen={isAddSkillOpen}
        onOpenChange={setIsAddSkillOpen}
        onAddSkill={onAddSkill}
      />
      <EditSkillDialog
        skill={editingSkill}
        onOpenChange={(open) => {
          if (!open) {
            setEditingSkill(null);
          }
        }}
        onSaveSkill={onSaveEditSkill}
        onUpdateSkill={setEditingSkill}
      />
    </>
  );
};

export default TechSkillsSection;
