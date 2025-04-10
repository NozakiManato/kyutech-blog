"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
}

export function AllAttendanceList() {
  const [members, setMembers] = useState<LabMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/attendance/all");
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
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[calc(100vh-5rem)]">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-full overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>
                <Skeleton className="h-6 w-[150px]" />
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-3rem)] overflow-y-auto">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div
                    key={j}
                    className="flex items-center space-x-4 p-3 rounded-lg border bg-card"
                  >
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // 研究室ごとにメンバーをグループ化
  const labGroups = members.reduce((groups, member) => {
    const lab = member.researchLab;
    if (!groups[lab]) {
      groups[lab] = [];
    }
    groups[lab].push(member);
    return groups;
  }, {} as Record<string, LabMember[]>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[calc(100vh-5rem)]">
      {Object.entries(labGroups).map(([lab, labMembers]) => {
        const presentMembers = labMembers.filter(
          (member) => member.isCheckedIn
        );
        const absentMembers = labMembers.filter(
          (member) => !member.isCheckedIn
        );

        return (
          <Card key={lab} className="h-full overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>{lab}</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-3rem)] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    在室中 ({presentMembers.length})
                  </h3>
                  {presentMembers.length === 0 ? (
                    <p className="text-center text-muted-foreground py-2">
                      現在在室しているメンバーはいません
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {presentMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-2 rounded-lg border bg-card"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={member.imageUrl}
                                alt={member.name}
                              />
                              <AvatarFallback>
                                {member.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-1">
                                <Link
                                  href={`/dashboard/profiles/${member.userId}`}
                                  className="font-medium hover:underline text-sm"
                                >
                                  {member.name}
                                </Link>
                                {member.academicYear && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {member.academicYear}
                                  </Badge>
                                )}
                              </div>
                              {member.Attendance[0] && (
                                <p className="text-xs text-muted-foreground">
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
                          <div className="flex items-center space-x-1">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-xs text-muted-foreground">
                              在室中
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    不在 ({absentMembers.length})
                  </h3>
                  {absentMembers.length === 0 ? (
                    <p className="text-center text-muted-foreground py-2">
                      退室しているメンバーはいません
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {absentMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-2 rounded-lg border bg-card"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={member.imageUrl}
                                alt={member.name}
                              />
                              <AvatarFallback>
                                {member.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-1">
                                <Link
                                  href={`/dashboard/profiles/${member.userId}`}
                                  className="font-medium hover:underline text-sm"
                                >
                                  {member.name}
                                </Link>
                                {member.academicYear && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {member.academicYear}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                            <span className="text-xs text-muted-foreground">
                              退室中
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
