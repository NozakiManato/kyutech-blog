"use client";
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
import React from "react";
import IconSelector from "./icon-selector";
import { Button } from "@/components/ui/button";

type Props = {
  skill: TechSkill | null;
  onOpenChange: (open: boolean) => void;
  onSaveSkill: () => void;
  onUpdateSkill: (updatedSkill: TechSkill) => void;
};

const EditSkillDialog = ({
  skill,
  onOpenChange,
  onSaveSkill,
  onUpdateSkill,
}: Props) => {
  if (!skill) {
    return;
  }
  return (
    <Dialog open={skill !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>スキルを編集</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-skill-name">スキル名</Label>
            <Input
              id="edit-skill-name"
              value={skill.name}
              onChange={(e) =>
                onUpdateSkill({ ...skill, name: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="edit-skill-category">カテゴリー</Label>
            <Select
              value={skill.category}
              onValueChange={(value: any) => {
                onUpdateSkill({ ...skill, category: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="カテゴリーを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frontend">フロントエンド</SelectItem>
                <SelectItem value="backend">バックエンド</SelectItem>
                <SelectItem value="database">データベース</SelectItem>
                <SelectItem value="ai">機械学習</SelectItem>
                <SelectItem value="image processing">画像処理</SelectItem>
                <SelectItem value="fpga">FPGA</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
                <SelectItem value="other">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <IconSelector
            selectedIcon={skill.iconName || ""}
            onSelectIcon={(iconName) => onUpdateSkill({ ...skill, iconName })}
          />
        </div>
        <DialogFooter>
          <Button variant={"outline"} onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={onSaveSkill}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSkillDialog;
