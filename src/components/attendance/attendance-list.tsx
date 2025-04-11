"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

type AttendanceRecord = {
  id: string;
  checkIn: Date;
  checkOut: Date | null;
  profileId: string;
};

export interface AttendanceListProps {
  records: AttendanceRecord[];
}

export function AttendanceList({ records }: AttendanceListProps) {
  const formatDate = (date: Date) => {
    return format(new Date(date), "yyyy年MM月dd日 HH:mm", { locale: ja });
  };

  const formatDuration = (checkIn: Date, checkOut: Date | null) => {
    if (!checkOut) return "在室中";

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffMs = end.getTime() - start.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHrs}時間${diffMins}分`;
  };

  if (records.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        在室記録がありません
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div
          key={record.id}
          className="flex flex-col space-y-1 rounded-lg border p-4"
        >
          <div className="flex justify-between">
            <div>
              <p className="font-medium">
                チェックイン: {formatDate(record.checkIn)}
              </p>
              {record.checkOut && (
                <p className="font-medium">
                  チェックアウト: {formatDate(record.checkOut)}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-medium">
                在室時間: {formatDuration(record.checkIn, record.checkOut)}
              </p>
              <Badge
                variant={record.checkOut ? "outline" : "default"}
                className="mt-1"
              >
                {record.checkOut ? "完了" : "在室中"}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
