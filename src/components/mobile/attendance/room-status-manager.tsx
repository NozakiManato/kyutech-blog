"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toggleCheckedInStatus } from "@/lib/actions";
import { profileProps } from "@/types";
import { LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type RoomStatusManagerProps = {
  profile: profileProps;
};

export default function RoomStatusManager({ profile }: RoomStatusManagerProps) {
  const [user, setUser] = useState<profileProps>(profile);

  const [isLoading, setIsLoading] = useState(false);
  const handleToggleCheckedInStatus = async () => {
    try {
      setIsLoading(true);
      const newStatus = await toggleCheckedInStatus(
        profile.userId,
        !profile.isCheckedIn
      );
      setUser({ ...profile, isCheckedIn: newStatus });
      if (newStatus) {
        toast.success("在室に変更しました");
      } else {
        toast.error("退室に変更しました");
      }
    } catch (error) {
      console.log("チェックイン状態更新エラー:", error);
      toast.error("チェックイン状態の更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">LocaLabo</CardTitle>
        <CardDescription>現在の状態を更新してください</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center gap-2 py-2">
          <Avatar className="h-12 w-12 ">
            <AvatarImage src={user.imageUrl} />
          </Avatar>
          <span className="font-medium">{user.name}</span>
        </div>

        <div className="flex justify-center">
          <div
            className={`text-center px-4 py-2 rounded-full font-medium ${
              user.isCheckedIn === null
                ? "bg-gray-200 text-gray-700"
                : user.isCheckedIn
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {user.isCheckedIn === null
              ? "読み込み中..."
              : user.isCheckedIn
              ? "在室中"
              : "退室中"}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 py-2">
        <Button
          className="w-full h-16 text-lg"
          onClick={handleToggleCheckedInStatus}
          disabled={isLoading || user.isCheckedIn === true}
          variant={user.isCheckedIn ? "outline" : "default"}
        >
          <LogIn className="mr-2 h-5 w-5" />
          入室
        </Button>
        <Button
          className="w-full h-16 text-lg"
          onClick={handleToggleCheckedInStatus}
          disabled={isLoading || user.isCheckedIn === false}
          variant={!user.isCheckedIn ? "outline" : "default"}
        >
          <LogOut className="mr-2 h-5 w-5" />
          退室
        </Button>
      </CardFooter>
    </>
  );
}
