"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

// 日本時間に変換する関数
const toJST = (date: Date) => {
  return new Date(date.getTime() + 9 * 60 * 60 * 1000);
};

type AttendanceRecord = {
  id: string;
  check_in: Date;
  check_out: Date | null;
  user_id: string;
  comment?: string | null;
};

export interface AttendanceListProps {
  records: AttendanceRecord[];
  currentUserId: string; // 現在表示しているユーザーのID
}

export function AttendanceList({
  records,
  currentUserId,
}: AttendanceListProps) {
  const { userId } = useAuth();
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  // 本人のダッシュボードかどうかを判定
  const isOwnDashboard = currentUserId === userId;

  const handleEditComment = (record: AttendanceRecord) => {
    if (!isOwnDashboard) {
      toast.error("自分の記録のみ編集できます");
      return;
    }
    setEditingComment(record.id);
    setCommentText(record.comment || "");
  };

  const handleSaveComment = async (recordId: string) => {
    if (!isOwnDashboard) {
      toast.error("自分の記録のみ編集できます");
      return;
    }

    try {
      const response = await fetch(`/api/attendance/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recordId,
          comment: commentText,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "コメントの更新に失敗しました");
      }

      toast.success("コメントを更新しました");
      setEditingComment(null);
      // 親コンポーネントに更新を通知する必要があります
      window.location.reload();
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error(
        error instanceof Error ? error.message : "コメントの更新に失敗しました"
      );
    }
  };

  if (records.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        在室記録がありません
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              日付
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              チェックイン
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              チェックアウト
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              滞在時間
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              コメント
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.map((record) => {
            const checkIn = toJST(new Date(record.check_in));
            const checkOut = record.check_out
              ? toJST(new Date(record.check_out))
              : null;
            const duration = checkOut
              ? {
                  hours: Math.floor(
                    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)
                  ),
                  minutes: Math.floor(
                    ((checkOut.getTime() - checkIn.getTime()) %
                      (1000 * 60 * 60)) /
                      (1000 * 60)
                  ),
                }
              : null;

            return (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(checkIn, "yyyy年MM月dd日", { locale: ja })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(checkIn, "HH:mm", { locale: ja })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {checkOut
                    ? format(checkOut, "HH:mm", { locale: ja })
                    : "在室中"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {duration
                    ? `${duration.hours}時間${duration.minutes}分`
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingComment === record.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        maxLength={100}
                        className="w-48"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSaveComment(record.id)}
                      >
                        保存
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingComment(null)}
                      >
                        キャンセル
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{record.comment || "-"}</span>
                      {isOwnDashboard && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditComment(record)}
                        >
                          編集
                        </Button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
