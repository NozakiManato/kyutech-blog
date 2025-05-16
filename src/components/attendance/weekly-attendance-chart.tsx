"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  startOfWeek,
  endOfWeek,
  isWeekend,
  startOfMonth,
  endOfMonth,
  format,
} from "date-fns";
import { ja } from "date-fns/locale";
import { isHoliday } from "@holiday-jp/holiday_jp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DailyAttendanceData {
  date: string;
  requiredTime: number;
  [key: string]: number | string;
}

interface AttendanceRecord {
  check_in: string;
  check_out: string | null;
}

interface LabMember {
  userId: string;
  name: string;
  weekRecords?: AttendanceRecord[];
}

interface WeeklyAttendanceChartProps {
  labName: string;
}

type Period = "month" | "all";

// 日本時間に変換する関数
const toJST = (date: Date) => {
  return new Date(date.getTime() + 9 * 60 * 60 * 1000);
};

// UTCから日本時間に変換する関数
const fromUTCtoJST = (utcDate: Date) => {
  return new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
};

// 平日かどうかを判定する関数
const isSchoolDay = (date: Date) => {
  return !isWeekend(date) && !isHoliday(date);
};

// 期間内の登校日数を計算する関数

// 在室時間を計算する関数
const calculateTotalTime = (records: AttendanceRecord[] = []) => {
  return records.reduce((total, record) => {
    // サーバーからのUTC時間を日本時間に変換
    const check_in = fromUTCtoJST(new Date(record.check_in));
    const check_out = record.check_out
      ? fromUTCtoJST(new Date(record.check_out))
      : toJST(new Date());

    // 日付の比較を日本時間で行う
    const check_in_date = new Date(
      check_in.getFullYear(),
      check_in.getMonth(),
      check_in.getDate()
    );
    const check_out_date = new Date(
      check_out.getFullYear(),
      check_out.getMonth(),
      check_out.getDate()
    );

    // 同じ日の場合は通常の時間差を計算
    if (check_in_date.getTime() === check_out_date.getTime()) {
      const diff_minutes =
        (check_out.getTime() - check_in.getTime()) / (1000 * 60);
      return total + diff_minutes;
    }

    // 日をまたぐ場合は、それぞれの日で計算
    const currentDate = new Date(check_in_date);
    let totalMinutes = 0;

    while (currentDate <= check_out_date) {
      if (isSchoolDay(currentDate)) {
        if (currentDate.getTime() === check_in_date.getTime()) {
          // チェックイン日の在室時間
          const endOfDay = new Date(currentDate);
          endOfDay.setHours(23, 59, 59, 999);
          const minutes =
            (endOfDay.getTime() - check_in.getTime()) / (1000 * 60);
          totalMinutes += minutes;
        } else if (currentDate.getTime() === check_out_date.getTime()) {
          // チェックアウト日の在室時間
          const startOfDay = new Date(currentDate);
          startOfDay.setHours(0, 0, 0, 0);
          const minutes =
            (check_out.getTime() - startOfDay.getTime()) / (1000 * 60);
          totalMinutes += minutes;
        } else {
          // 中間の日の在室時間（全日）
          totalMinutes += 24 * 60;
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return total + totalMinutes;
  }, 0);
};

// 日付ごとの在室時間を計算する関数
const calculateDailyAttendance = (
  members: (LabMember & { weekRecords: AttendanceRecord[] })[],
  startDate: Date,
  endDate: Date
) => {
  // 週の開始日と終了日の配列を作成
  const weeks: { start: Date; end: Date }[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const weekStart = startOfWeek(currentDate, { locale: ja, weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { locale: ja, weekStartsOn: 1 });
    weeks.push({ start: weekStart, end: weekEnd });
    currentDate.setDate(currentDate.getDate() + 7);
  }

  // 週ごとのデータを作成
  const weeklyData: DailyAttendanceData[] = weeks.map(({ start, end }) => {
    // 週の登校日数を計算
    let schoolDays = 0;
    const currentDate = new Date(start);
    while (currentDate <= end) {
      if (isSchoolDay(currentDate)) {
        schoolDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const data: DailyAttendanceData = {
      date: `${format(start, "M/d", { locale: ja })}-${format(end, "M/d", {
        locale: ja,
      })}`,
      requiredTime: schoolDays * 4, // 登校日数 × 4時間
    };

    members.forEach((member) => {
      const weekRecords = member.weekRecords.filter((record) => {
        // サーバーからのUTC時間を日本時間に変換して比較
        const check_in = fromUTCtoJST(new Date(record.check_in));
        const check_in_date = new Date(
          check_in.getFullYear(),
          check_in.getMonth(),
          check_in.getDate()
        );
        return check_in_date >= start && check_in_date <= end;
      });

      const actualMinutes = calculateTotalTime(weekRecords);
      data[member.name] = Math.round((actualMinutes / 60) * 10) / 10;
    });

    return data;
  });

  return weeklyData;
};

// グラフの色を生成する関数
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088fe",
  "#00c49f",
  "#ffbb28",
  "#ff8042",
  "#a4de6c",
  "#d0ed57",
];

export function WeeklyAttendanceChart({ labName }: WeeklyAttendanceChartProps) {
  const [data, setData] = useState<DailyAttendanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("month");
  const [members, setMembers] = useState<
    (LabMember & { weekRecords: AttendanceRecord[] })[]
  >([]);

  // 芹川研究室かどうかを判定
  const isSerikawaLab = labName === "芹川研究室";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/attendance?lab=${encodeURIComponent(labName)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }
        const members = await response.json();

        const now = toJST(new Date());
        let startDate: Date;
        let endDate: Date;

        switch (period) {
          case "month":
            startDate = startOfMonth(now);
            endDate = endOfMonth(now);
            break;
          case "all":
            // 4月1日から開始
            startDate = new Date(now.getFullYear(), 3, 1); // 3は4月を表す（0から始まるため）
            endDate = now;
            break;
        }

        // 各メンバーの在室記録を取得
        const membersWithRecords = await Promise.all(
          members.map(async (member: LabMember) => {
            const historyResponse = await fetch(
              `/api/attendance/history?userId=${member.userId}`
            );
            if (!historyResponse.ok) {
              return null;
            }
            const historyData = await historyResponse.json();

            const periodRecords = historyData.records.filter(
              (record: AttendanceRecord) => {
                // サーバーからのUTC時間を日本時間に変換して比較
                const check_in = fromUTCtoJST(new Date(record.check_in));
                const check_in_date = new Date(
                  check_in.getFullYear(),
                  check_in.getMonth(),
                  check_in.getDate()
                );
                return check_in_date >= startDate && check_in_date <= endDate;
              }
            );

            return {
              ...member,
              weekRecords: periodRecords,
            };
          })
        );

        const validMembers = membersWithRecords.filter(
          (member): member is LabMember & { weekRecords: AttendanceRecord[] } =>
            member !== null
        );
        setMembers(validMembers);

        // 週間データを計算
        const dailyData = calculateDailyAttendance(
          validMembers,
          startDate,
          endDate
        );
        setData(dailyData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [labName, period]);

  const getPeriodTitle = () => {
    const now = toJST(new Date());
    switch (period) {
      case "month":
        return `${format(now, "yyyy年M月", { locale: ja })}の週間在室時間`;
      case "all":
        return "全期間の週間在室時間";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>在室時間</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{getPeriodTitle()}</CardTitle>
        <Select
          value={period}
          onValueChange={(value: Period) => setPeriod(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="期間を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">月間</SelectItem>
            <SelectItem value="all">全期間</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === "requiredTime") {
                    return [`${value}時間（必要時間）`, "必要時間"];
                  }
                  return [`${value}時間`, name];
                }}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              {isSerikawaLab && (
                <Line
                  type="monotone"
                  dataKey="requiredTime"
                  name="必要在室時間"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />
              )}
              {members.map((member, index) => (
                <Line
                  key={member.userId}
                  type="monotone"
                  dataKey={member.name}
                  name={member.name}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
