"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/nextjs";

interface AttendanceRecord {
  id: string;
  profileId: string;
  checkIn: string;
  checkOut: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AttendanceHistoryResponse {
  records: AttendanceRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface AttendanceDashboardProps {
  targetUserId: string;
}

export function AttendanceDashboard({
  targetUserId,
}: AttendanceDashboardProps) {
  const { user } = useUser();
  const [attendanceHistory, setAttendanceHistory] =
    useState<AttendanceHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/api/profiles/${targetUserId}`);
        if (!response.ok) {
          throw new Error("プロフィールの取得に失敗しました");
        }
        const data = await response.json();
        setUserProfile(data);
        setIsOwnProfile(user?.id === targetUserId);
      } catch (error) {
        console.error("プロフィール取得エラー:", error);
      }
    };

    fetchUserProfile();
  }, [targetUserId, user?.id]);

  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/attendance/history?userId=${targetUserId}&page=${currentPage}&limit=10`
        );
        if (!response.ok) {
          throw new Error("在室記録の取得に失敗しました");
        }
        const data = await response.json();
        setAttendanceHistory(data);
      } catch (error) {
        console.error("在室記録取得エラー:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceHistory();
  }, [targetUserId, currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (attendanceHistory && currentPage < attendanceHistory.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const calculateTotalTime = (records: AttendanceRecord[]) => {
    return records.reduce((total, record) => {
      const checkIn = parseISO(record.checkIn);
      const checkOut = record.checkOut ? parseISO(record.checkOut) : new Date();
      const diffInHours =
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
      return total + diffInHours;
    }, 0);
  };

  const formatDuration = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}時間${minutes}分`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-[200px]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-4 rounded-lg border"
                >
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {userProfile && (
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userProfile.imageUrl} alt={userProfile.name} />
              <AvatarFallback>
                {userProfile.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{userProfile.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  variant={userProfile.isCheckedIn ? "default" : "secondary"}
                >
                  {userProfile.isCheckedIn ? "在室中" : "退室中"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {userProfile.researchLab} / {userProfile.academicYear}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history">在室履歴</TabsTrigger>
          <TabsTrigger value="stats">統計</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>在室履歴</CardTitle>
            </CardHeader>
            <CardContent>
              {attendanceHistory && attendanceHistory.records.length > 0 ? (
                <div className="space-y-4">
                  {attendanceHistory.records.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">
                          {format(
                            parseISO(record.checkIn),
                            "yyyy年MM月dd日 HH:mm",
                            {
                              locale: ja,
                            }
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          入室:{" "}
                          {format(parseISO(record.checkIn), "HH:mm", {
                            locale: ja,
                          })}
                          {record.checkOut && (
                            <>
                              {" "}
                              / 退室:{" "}
                              {format(parseISO(record.checkOut), "HH:mm", {
                                locale: ja,
                              })}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {record.checkOut ? (
                          <Badge variant="outline">完了</Badge>
                        ) : (
                          <Badge variant="default">在室中</Badge>
                        )}
                        {record.checkOut && (
                          <div className="text-sm text-muted-foreground">
                            {formatDistanceToNow(parseISO(record.checkOut), {
                              addSuffix: true,
                              locale: ja,
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      前へ
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {currentPage} / {attendanceHistory.totalPages} ページ
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === attendanceHistory.totalPages}
                    >
                      次へ
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  在室記録がありません
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>在室統計</CardTitle>
            </CardHeader>
            <CardContent>
              {attendanceHistory && attendanceHistory.records.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border">
                      <div className="text-sm text-muted-foreground">
                        総在室回数
                      </div>
                      <div className="text-2xl font-bold">
                        {attendanceHistory.total}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <div className="text-sm text-muted-foreground">
                        総在室時間
                      </div>
                      <div className="text-2xl font-bold">
                        {formatDuration(
                          calculateTotalTime(attendanceHistory.records)
                        )}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <div className="text-sm text-muted-foreground">
                        平均在室時間
                      </div>
                      <div className="text-2xl font-bold">
                        {formatDuration(
                          calculateTotalTime(attendanceHistory.records) /
                            attendanceHistory.records.length
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  在室記録がありません
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
