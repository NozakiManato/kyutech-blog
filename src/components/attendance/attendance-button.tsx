"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AttendanceButtonProps {
  isCheckedIn: boolean;
  onStatusChange: (status: boolean) => void;
}

export function AttendanceButton({
  isCheckedIn: initialIsCheckedIn,
  onStatusChange,
}: AttendanceButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(initialIsCheckedIn);

  // 初期状態を設定
  useEffect(() => {
    setIsCheckedIn(initialIsCheckedIn);
  }, [initialIsCheckedIn]);

  const handleAttendance = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: isCheckedIn ? "check-out" : "check-in",
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to update attendance");
      }

      // 状態を更新
      const newStatus = !isCheckedIn;
      setIsCheckedIn(newStatus);
      onStatusChange(newStatus);

      toast.info(newStatus ? "入室しました" : "退室しました", {
        description: newStatus ? "今日も一日頑張りましょう" : "お疲れ様でした",
      });
    } catch (error) {
      console.error("[ATTENDANCE_BUTTON]", error);
      toast.error("エラーが発生しました", {
        description:
          error instanceof Error ? error.message : "もう一度お試しください",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAttendance}
      disabled={isLoading}
      variant={isCheckedIn ? "destructive" : "default"}
      className="w-full"
      size={"lg"}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {isCheckedIn ? "退室する" : "入室する"}
    </Button>
  );
}
