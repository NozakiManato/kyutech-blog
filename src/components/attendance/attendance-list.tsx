"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface LabMember {
  id: string;
  userId: string;
  name: string;
  imageUrl: string;
  isCheckedIn: boolean;
  academicYear?: string;
  Attendance: {
    checkIn: string;
  }[];
}

interface AttendanceListProps {
  labName?: string;
}

export function AttendanceList({ labName }: AttendanceListProps) {
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
        setMembers(data);
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
                        href={`/dashboard/profiles/${member.userId}`}
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
