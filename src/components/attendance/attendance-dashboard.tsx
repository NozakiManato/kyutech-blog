"use client";

import { useState, useEffect } from "react";
import {
  startOfWeek,
  endOfWeek,
  subWeeks,
  startOfMonth,
  endOfMonth,
  differenceInMinutes,
} from "date-fns";
import { ja } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceProfile } from "./attendance-profile";
import { AttendanceList } from "./attendance-list";
import { AttendanceChart } from "./attendance-chart";

type AttendanceRecord = {
  id: string;
  checkIn: Date;
  checkOut: Date | null;
  profileId: string;
};

export function AttendanceDashboard({
  targetUserId,
}: {
  targetUserId?: string;
}) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayRecords, setTodayRecords] = useState<AttendanceRecord[]>([]);
  const [weekRecords, setWeekRecords] = useState<AttendanceRecord[]>([]);
  const [monthRecords, setMonthRecords] = useState<AttendanceRecord[]>([]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/attendance/history${
          targetUserId ? `?userId=${targetUserId}` : ""
        }`
      );

      if (!response.ok) {
        throw new Error("在室記録の取得に失敗しました");
      }

      const data = await response.json();
      setRecords(data.records);

      // 今日の記録を抽出
      const today = new Date();
      const todayStart = new Date(today.setHours(0, 0, 0, 0));
      const todayEnd = new Date(today.setHours(23, 59, 59, 999));

      const todayFiltered = data.records.filter((record: AttendanceRecord) => {
        const checkInDate = new Date(record.checkIn);
        return checkInDate >= todayStart && checkInDate <= todayEnd;
      });
      setTodayRecords(todayFiltered);

      // 先週の記録を抽出
      const weekStart = startOfWeek(subWeeks(new Date(), 1), { locale: ja });
      const weekEnd = endOfWeek(subWeeks(new Date(), 1), { locale: ja });

      const weekFiltered = data.records.filter((record: AttendanceRecord) => {
        const checkInDate = new Date(record.checkIn);
        return checkInDate >= weekStart && checkInDate <= weekEnd;
      });
      setWeekRecords(weekFiltered);

      // 今月の記録を抽出
      const monthStart = startOfMonth(new Date());
      const monthEnd = endOfMonth(new Date());

      const monthFiltered = data.records.filter((record: AttendanceRecord) => {
        const checkInDate = new Date(record.checkIn);
        return checkInDate >= monthStart && checkInDate <= monthEnd;
      });
      setMonthRecords(monthFiltered);
    } catch (error) {
      console.error("在室記録の取得に失敗しました:", error);
      toast.error("在室記録の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [targetUserId]);

  // 在室時間を計算する関数
  const calculateTotalTime = (records: AttendanceRecord[]) => {
    return records.reduce((total, record) => {
      const checkIn = new Date(record.checkIn);
      const checkOut = record.checkOut ? new Date(record.checkOut) : new Date();
      const diffMinutes = differenceInMinutes(checkOut, checkIn);
      return total + diffMinutes;
    }, 0);
  };

  // 分を時間と分に変換する関数
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}時間${mins}分`;
  };

  // 今日の在室時間
  const todayTotalTime = calculateTotalTime(todayRecords);

  // 先週の在室時間
  const weekTotalTime = calculateTotalTime(weekRecords);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* プロフィールカード */}
        <div className="md:col-span-1">
          <AttendanceProfile targetUserId={targetUserId} />
        </div>

        {/* 在室時間サマリー */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  今日の在室時間
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold">
                    {formatDuration(todayTotalTime)}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  先週の在室時間
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold">
                    {formatDuration(weekTotalTime)}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 在室時間グラフ */}
      <Card>
        <CardHeader>
          <CardTitle>在室時間グラフ</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <AttendanceChart records={weekRecords} />
          )}
        </CardContent>
      </Card>
      {/* 在室記録タブ */}
      <Card>
        <CardHeader>
          <CardTitle>在室記録</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="month">
            <TabsList className="mb-4">
              <TabsTrigger value="month">今月</TabsTrigger>
              <TabsTrigger value="all">全期間</TabsTrigger>
            </TabsList>
            <TabsContent value="month">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <AttendanceList records={monthRecords} />
              )}
            </TabsContent>
            <TabsContent value="all">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <AttendanceList records={records} />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
