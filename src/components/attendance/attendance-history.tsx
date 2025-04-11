"use client";

import { useState, useEffect } from "react";
import { getAttendanceHistory } from "@/app/actions/attendance";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

type AttendanceRecord = {
  id: string;
  checkIn: Date;
  checkOut: Date | null;
  profileId: string;
};

export function AttendanceHistory({ targetUserId }: { targetUserId?: string }) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await getAttendanceHistory(targetUserId, page);
      setRecords(response.records);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("在室記録の取得に失敗しました:", error);
      toast({
        title: "エラー",
        description: "在室記録の取得に失敗しました",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [page, targetUserId]);

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
                      在室時間:{" "}
                      {formatDuration(record.checkIn, record.checkOut)}
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
