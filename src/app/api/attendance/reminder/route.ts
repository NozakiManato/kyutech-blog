import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendCheckoutReminderEmail } from "@/lib/mail";
import { cache } from "react";
import { updateAttendance } from "@/lib/prisma/attendance";

// 在室中のユーザーを取得する部分だけをキャッシュ
const getActiveUsers = cache(async () => {
  return await db.userProfile.findMany({
    where: {
      isCheckedIn: true,
    },
    include: {
      Attendance: {
        where: {
          check_out: null,
        },
        orderBy: {
          check_in: "desc",
        },
        take: 1,
      },
    },
  });
});

export async function GET() {
  return await sendReminderEmails();
}

export async function POST() {
  return await sendReminderEmails();
}

async function sendReminderEmails() {
  try {
    // キャッシュされた関数を使用して在室中のユーザーを取得
    const activeUsers = await getActiveUsers();

    // 各ユーザーにリマインダーメールを送信（この部分はキャッシュされない）
    for (const user of activeUsers) {
      if (user.email && user.Attendance[0]) {
        await sendCheckoutReminderEmail(
          user.email,
          user.name,
          user.userId,
          user.Attendance[0].check_in
        );
        await updateAttendance(user.userId);
        await db.userProfile.update({
          where: {
            userId: user.userId,
          },
          data: {
            name: user.name,
            imageUrl: user.imageUrl,
            email: user.email || "",
            researchLab: user.researchLab,
            academicYear: user.academicYear,
            description: user.description || "",
            github: user.github || "",
            x: user.x || "",
            instagram: user.instagram || "",
            isCheckedIn: false,
          },
        });
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
