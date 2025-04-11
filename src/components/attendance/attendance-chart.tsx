"use client";

import { format, startOfWeek, addDays } from "date-fns";
import { ja } from "date-fns/locale";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type AttendanceRecord = {
  id: string;
  checkIn: Date;
  checkOut: Date | null;
};

type ChartData = {
  date: string;
  hours: number;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{
    payload: ChartData;
  }>;
  label?: string;
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-gray-600">
          在室時間: {payload[0].payload.hours.toFixed(1)}時間
        </p>
      </div>
    );
  }
  return null;
};

export function AttendanceChart({ records }: { records: AttendanceRecord[] }) {
  // 月曜日始まりの過去7日間のデータを準備
  const data: ChartData[] = Array.from({ length: 7 }, (_, i) => {
    // 現在の日付から月曜日を基準に日付を計算
    const today = new Date();
    const monday = startOfWeek(today, { locale: ja, weekStartsOn: 1 });
    const date = addDays(monday, i);
    const dateStr = format(date, "yyyy-MM-dd");

    // その日の記録をフィルタリング
    const dayRecords = records.filter((record) => {
      const recordDate = format(new Date(record.checkIn), "yyyy-MM-dd");
      return recordDate === dateStr;
    });

    // 在室時間を計算
    const totalHours = dayRecords.reduce((total, record) => {
      if (!record.checkOut) return total;
      const duration =
        new Date(record.checkOut).getTime() -
        new Date(record.checkIn).getTime();
      return total + duration / (1000 * 60 * 60);
    }, 0);

    return {
      date: format(date, "M/d (E)", { locale: ja }),
      hours: Number(totalHours.toFixed(1)),
    };
  });

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="date" />
          <YAxis domain={[0, "auto"]} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="hours" fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
