"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  formatDistanceToNow,
  differenceInMinutes,
  startOfWeek,
  endOfWeek,
  subWeeks,
} from "date-fns";
import { ja } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface AttendanceRecord {
  id: string;
  checkIn: string;
  checkOut: string | null;
}

interface LabMember {
  id: string;
  userId: string;
  name: string;
  imageUrl: string;
  isCheckedIn: boolean;
  academicYear?: string;
  researchLab: string;
  Attendance: {
    checkIn: string;
  }[];
  weekRecords?: AttendanceRecord[];
}

interface AttendanceListProps {
  labName?: string;
}

export function LabAttendanceList({ labName }: AttendanceListProps) {
  const [members, setMembers] = useState<LabMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // 研究室名が指定されている場合は、その研究室のメンバーのみを取得
        const url = labName
          ? `/api/attendance?lab=${encodeURIComponent(labName)}`
          : "/api/attendance";

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }
        const data = await response.json();

        // 各メンバーの先週の在室記録を取得
        const membersWithWeekRecords = await Promise.all(
          data.map(async (member: LabMember) => {
            const historyResponse = await fetch(
              `/api/attendance/history?userId=${member.userId}`
            );
            if (!historyResponse.ok) {
              return member;
            }
            const historyData = await historyResponse.json();

            // 先週の記録を抽出
            const weekStart = startOfWeek(subWeeks(new Date(), 1), {
              locale: ja,
            });
            const weekEnd = endOfWeek(subWeeks(new Date(), 1), { locale: ja });

            const weekRecords = historyData.records.filter(
              (record: AttendanceRecord) => {
                const checkInDate = new Date(record.checkIn);
                return checkInDate >= weekStart && checkInDate <= weekEnd;
              }
            );

            return {
              ...member,
              weekRecords,
            };
          })
        );

        setMembers(membersWithWeekRecords);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
    const interval = setInterval(fetchMembers, 60000); // 1分ごとに更新

    return () => clearInterval(interval);
  }, [labName]);

  // 在室時間を計算する関数
  const calculateTotalTime = (records: AttendanceRecord[] = []) => {
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

  // 芹川研究室のメンバーで先週の在室時間が20時間を超えているかチェックする関数
  const isOverTwentyHours = (member: LabMember) => {
    if (member.researchLab !== "芹川研究室") return false;
    if (!member.weekRecords) return false;

    const totalMinutes = calculateTotalTime(member.weekRecords);
    return totalMinutes > 20 * 60; // 20時間 = 20 * 60分
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex items-center space-x-4 p-4 rounded-lg border bg-card"
          >
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const presentMembers = members.filter((member) => member.isCheckedIn);
  const absentMembers = members.filter((member) => !member.isCheckedIn);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          在室中 ({presentMembers.length})
        </h3>
        {presentMembers.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            現在在室しているメンバーはいません
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {presentMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={member.imageUrl} alt={member.name} />
                    <AvatarFallback>
                      {member.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/${member.userId}`}
                        className="font-medium hover:underline"
                      >
                        {member.name}
                      </Link>
                      {member.academicYear && (
                        <Badge variant="secondary">{member.academicYear}</Badge>
                      )}
                    </div>
                    {member.Attendance[0] && (
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(
                          new Date(member.Attendance[0].checkIn),
                          {
                            addSuffix: true,
                            locale: ja,
                          }
                        )}
                        から在室中
                      </p>
                    )}
                  </div>
                </div>
                {member.weekRecords && (
                  <div
                    className={`mt-2 p-2 rounded-md ${
                      isOverTwentyHours(member)
                        ? "bg-green-100 dark:bg-green-900/20"
                        : "bg-gray-100 dark:bg-gray-800/20"
                    }`}
                  >
                    <p
                      className={`text-xs font-medium ${
                        isOverTwentyHours(member)
                          ? "text-green-700 dark:text-green-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      先週の在室時間
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        isOverTwentyHours(member)
                          ? "text-green-700 dark:text-green-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {formatDuration(calculateTotalTime(member.weekRecords))}
                      {isOverTwentyHours(member) && (
                        <span className="ml-1 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                          20時間以上
                        </span>
                      )}
                    </p>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-muted-foreground">在室中</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">
          不在 ({absentMembers.length})
        </h3>
        {absentMembers.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            退室しているメンバーはいません
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {absentMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={member.imageUrl} alt={member.name} />
                    <AvatarFallback>
                      {member.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/profiles/${member.userId}`}
                        className="font-medium hover:underline"
                      >
                        {member.name}
                      </Link>
                      {member.academicYear && (
                        <Badge variant="secondary">{member.academicYear}</Badge>
                      )}
                    </div>
                    {member.weekRecords && (
                      <div
                        className={`mt-2 p-2 rounded-md ${
                          isOverTwentyHours(member)
                            ? "bg-green-100 dark:bg-green-900/20"
                            : "bg-gray-100 dark:bg-gray-800/20"
                        }`}
                      >
                        <p
                          className={`text-xs font-medium ${
                            isOverTwentyHours(member)
                              ? "text-green-700 dark:text-green-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          先週の在室時間
                        </p>
                        <p
                          className={`text-lg font-bold ${
                            isOverTwentyHours(member)
                              ? "text-green-700 dark:text-green-400"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {formatDuration(
                            calculateTotalTime(member.weekRecords)
                          )}
                          {isOverTwentyHours(member) && (
                            <span className="ml-1 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                              20時間以上
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                  <span className="text-sm text-muted-foreground">退室中</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
