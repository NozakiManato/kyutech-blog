"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TechSkill } from "@/types";
import React, { useState } from "react";
import IconSelector from "./icon-selector";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSkill: (skill: Omit<TechSkill, "id">) => void;
};

const AddSkillDialogProps = ({ isOpen, onOpenChange, onAddSkill }: Props) => {
  const [newSkill, setNewSkill] = useState<Omit<TechSkill, "id">>({
    name: "",
    category: "frontend",
    iconName: "",
  });
  const handleAddSkill = () => {
    onAddSkill(newSkill);
    setNewSkill({
      name: "",
      category: "frontend",
      iconName: "",
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>新しいスキルを追加</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="skill-name">スキル名</Label>
            <Input
              id="skill-name"
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill({ ...newSkill, name: e.target.value })
              }
              placeholder="例: JavaScript"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skill-category">カテゴリー</Label>
            <Select
              value={newSkill.category}
              onValueChange={(value: any) =>
                setNewSkill({ ...newSkill, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="カテゴリーを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frontend">フロントエンド</SelectItem>
                <SelectItem value="backend">バックエンド</SelectItem>
                <SelectItem value="database">データベース</SelectItem>
                <SelectItem value="imaging">画像処理</SelectItem>
                <SelectItem value="ai">機械学習</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
                <SelectItem value="other">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <IconSelector
            selectedIcon={newSkill.iconName || ""}
            onSelectIcon={(iconName) => setNewSkill({ ...newSkill, iconName })}
          />
        </div>
        <DialogFooter>
          <Button variant={"outline"} onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={handleAddSkill} disabled={!newSkill.name}>
            追加
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSkillDialogProps;
