import { Button } from "@/components/ui/button";
import { Edit, X, Save } from "lucide-react";
import React from "react";

const EditButton = () => {
  return (
    <div className="flex justify-end mb-2">
      {!editMode ? (
        <Button variant={"outline"} size={"sm"} onClick={handleProfileEdit}>
          <Edit className="h-3.5 w-3.5 mr-1.5" />
          編集
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button variant={"outline"} size={"sm"} onClick={handleProfileCancel}>
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
  );
};

export default EditButton;
