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
  TooltipProps,
} from "recharts";

type AttendanceRecord = {
  id: string;
  checkIn: Date;
  checkOut: Date | null;
};

type ChartData = {
  date: string;
  dayOfMonth: string;
  hours: number;
};

type AttendanceChartProps = {
  records: AttendanceRecord[];
};

type CustomTooltipProps = TooltipProps<number, string> & {
  payload?: Array<{
    payload: ChartData;
    value: number;
  }>;
};

export function AttendanceChart({ records }: AttendanceChartProps) {
  const today = new Date();
  const weekStart = startOfWeek(today, { locale: ja, weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const chartData: ChartData[] = weekDays.map((date) => {
    const dayRecords = records.filter((record) => {
      const recordDate = new Date(record.checkIn);
      return (
        recordDate.getDate() === date.getDate() &&
        recordDate.getMonth() === date.getMonth() &&
        recordDate.getFullYear() === date.getFullYear()
      );
    });

    const totalHours = dayRecords.reduce((acc, record) => {
      if (!record.checkOut) return acc;
      const duration =
        new Date(record.checkOut).getTime() -
        new Date(record.checkIn).getTime();
      return acc + duration / (1000 * 60 * 60);
    }, 0);

    return {
      date: format(date, "E", { locale: ja }),
      dayOfMonth: format(date, "M/d"),
      hours: Number(totalHours.toFixed(1)),
    };
  });

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-2 shadow-md">
          <p className="font-medium">{`${payload[0].payload.dayOfMonth} (${label})`}</p>
          <p className="text-sm">{`${payload[0].value}時間`}</p>
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
