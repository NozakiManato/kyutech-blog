"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AttendanceButtonProps {
  isCheckedIn: boolean;
  onStatusChange: (isCheckedIn: boolean) => void;
}

export function AttendanceButton({
  isCheckedIn,
  onStatusChange,
}: AttendanceButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

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
        const data = await response.json();
        throw new Error(data.error || "エラーが発生しました");
      }

      onStatusChange(!isCheckedIn);
      toast.success(isCheckedIn ? "退室しました" : "入室しました");
    } catch (error) {
      console.error("Attendance error:", error);
      toast.error(
        error instanceof Error ? error.message : "エラーが発生しました"
      );
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
    >
      {isLoading ? "処理中..." : isCheckedIn ? "退室する" : "入室する"}
    </Button>
  );
}
