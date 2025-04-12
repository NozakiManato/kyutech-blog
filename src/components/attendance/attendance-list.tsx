"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

type AttendanceRecord = {
  id: string;
  check_in: Date;
  check_out: Date | null;
  user_id: string;
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
                チェックイン: {formatDate(record.check_in)}
              </p>
              {record.check_out && (
                <p className="font-medium">
                  チェックアウト: {formatDate(record.check_out)}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-medium">
                在室時間: {formatDuration(record.check_in, record.check_out)}
              </p>
              <Badge
                variant={record.check_out ? "outline" : "default"}
                className="mt-1"
              >
                {record.check_out ? "完了" : "在室中"}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
