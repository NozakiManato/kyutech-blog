import { NextResponse } from "next/server";
import { sendCheckoutReminderEmail } from "@/lib/mail";

export async function GET() {
  return await sendTestEmail();
}

export async function POST() {
  return await sendTestEmail();
}

async function sendTestEmail() {
  try {
    // テスト用のメール送信
    await sendCheckoutReminderEmail(
      process.env.SMTP_USER!, // あなたのGmailアドレス
      "テストユーザー",
      "user_2vWBLBD9sJAju0yLSmJmu4Nrpx1",
      new Date(),
      "テスト用メールです"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending test email:", error);
    return NextResponse.json(
      { error: "メール送信に失敗しました" },
      { status: 500 }
    );
  }
}
