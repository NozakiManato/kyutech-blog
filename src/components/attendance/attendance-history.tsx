"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type AttendanceRecord = {
  id: string;
  check_in: Date;
  check_out: Date | null;
  user_id: string;
};

export function AttendanceHistory({ targetUserId }: { targetUserId?: string }) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/attendance/history?userId=${targetUserId}&page=${page}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch records");
      }
      const data = await response.json();
      setRecords(data.records);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("在室記録の取得に失敗しました:", error);
      toast.error("在室記録の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [targetUserId, page]);

  useEffect(() => {
    fetchRecords();
  }, [targetUserId, fetchRecords]);

  const formatDate = (date: Date) => {
    return format(new Date(date), "yyyy年MM月dd日 HH:mm", { locale: ja });
  };

  const formatDuration = (check_in: Date, check_out: Date | null) => {
    if (!check_out) return "在室中";

    const start = new Date(check_in);
    const end = new Date(check_out);
    const diffMs = end.getTime() - start.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHrs}時間${diffMins}分`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>在室記録</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : records.length === 0 ? (
          <p className="text-center text-muted-foreground">
            在室記録がありません
          </p>
        ) : (
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
                      在室時間:{" "}
                      {formatDuration(record.check_in, record.check_out)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                前へ
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                次へ
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
