import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendCheckoutReminderEmail } from "@/lib/mail";

export async function POST() {
  try {
    // 現在在室中のユーザーを取得
    const activeUsers = await db.userProfile.findMany({
      where: {
        isCheckedIn: true,
      },
      include: {
        Attendance: {
          where: {
            checkOut: null,
          },
          orderBy: {
            checkIn: "desc",
          },
          take: 1,
        },
      },
    });

    // 各ユーザーにリマインダーメールを送信
    for (const user of activeUsers) {
      if (user.email && user.Attendance[0]) {
        await sendCheckoutReminderEmail(
          user.email,
          user.name,
          user.userId,
          user.Attendance[0].checkIn
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending reminder emails:", error);
    return NextResponse.json(
      { error: "メール送信に失敗しました" },
      { status: 500 }
    );
  }
}
