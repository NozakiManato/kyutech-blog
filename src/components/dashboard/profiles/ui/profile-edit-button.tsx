import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";

interface ProfileEditButtonsProps {
  editMode: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfileEditButtons({
  editMode,
  onEdit,
  onSave,
  onCancel,
}: ProfileEditButtonsProps) {
  return (
    <div className="flex justify-end mb-2">
      {!editMode ? (
        <Button variant={"outline"} size={"sm"} onClick={onEdit}>
          <Edit className="h-3.5 w-3.5 mr-1.5" />
          編集
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button variant={"outline"} size={"sm"} onClick={onCancel}>
            <X className="h-3.5 w-3.5 mr-1.5" />
            キャンセル
          </Button>
          <Button variant={"default"} size={"sm"} onClick={onSave}>
            <Save className="h-3.5 w-3.5 mr-1.5" />
            保存
          </Button>
        </div>
      )}
    </div>
  );
}
