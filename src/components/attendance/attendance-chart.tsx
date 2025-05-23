"use client";

import { format, addDays, startOfWeek } from "date-fns";
import { ja } from "date-fns/locale";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useEffect, useState } from "react";

type AttendanceRecord = {
  id: string;
  check_in: Date;
  check_out: Date | null;
};

type ChartData = {
  date: string;
  dayOfMonth: string;
  hours: number;
  hoursText: string;
};

type AttendanceChartProps = {
  records: AttendanceRecord[];
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{
    payload: ChartData;
    value: number;
  }>;
  label?: string;
};

const getJSTNow = () => {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000);
};

export function AttendanceChart({ records }: AttendanceChartProps) {
  const [currentTime, setCurrentTime] = useState(getJSTNow());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getJSTNow());
    }, 60000); // 1分ごとに更新

    return () => clearInterval(timer);
  }, []);

  const weekStart = startOfWeek(currentTime, { locale: ja, weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const chartData: ChartData[] = weekDays.map((date) => {
    const dayRecords = records.filter((record) => {
      const recordDate = new Date(
        new Date(record.check_in).getTime() - 9 * 60 * 60 * 1000
      );
      return (
        recordDate.getDate() === date.getDate() &&
        recordDate.getMonth() === date.getMonth() &&
        recordDate.getFullYear() === date.getFullYear()
      );
    });

    const totalHours = dayRecords.reduce((acc, record) => {
      const checkOutTime = record.check_out
        ? new Date(record.check_out)
        : currentTime;
      const duration =
        checkOutTime.getTime() - new Date(record.check_in).getTime();
      return acc + duration / (1000 * 60 * 60);
    }, 0);

    // 時間と分に変換
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);

    // 表示用のテキストを作成
    const hoursText = minutes > 0 ? `${hours}時間${minutes}分` : `${hours}時間`;

    return {
      date: format(date, "E", { locale: ja }),
      dayOfMonth: format(date, "M/d"),
      hours: Number(totalHours.toFixed(1)),
      hoursText,
    };
  });

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-2 shadow-md">
          <p className="font-medium">{`${payload[0].payload.dayOfMonth} (${label})`}</p>
          <p className="text-sm">{`${payload[0].payload.hoursText}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis
            dataKey="date"
            tickFormatter={(value) =>
              `${value}\n${
                chartData.find((d) => d.date === value)?.dayOfMonth || ""
              }`
            }
            height={40}
          />
          <YAxis domain={[0, 8]} />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="hours"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
