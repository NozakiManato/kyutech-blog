import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendCheckoutReminderEmail(
  email: string,
  name: string,
  userId: string,
  checkInTime: Date,
  customMessage?: string
) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: "【重要】退室手続きのお忘れではありませんか？",
    text: `
${name} 様

${customMessage || "退室手続きをお忘れではないでしょうか？"}
入室時刻: ${checkInTime.toLocaleString("ja-JP")}

以下のリンクから退室手続きを行ってください：
${process.env.NEXT_PUBLIC_APP_URL}/dashboard/profiles/${userId}

※このメールは自動送信されています。
`,
    html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #e11d48;">【重要】退室手続きのお忘れではありませんか？</h2>
  
  <p>${name} 様</p>
  
  <p>${customMessage || "退室手続きをお忘れではないでしょうか？"}</p>
  <p>入室時刻: ${checkInTime.toLocaleString("ja-JP")}</p>
  
  <div style="margin: 30px 0;">
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/profiles/${userId}" 
       style="background-color: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
      退室手続きを行う
    </a>
  </div>
  
  <p style="color: #666; font-size: 0.9em;">
    ※このメールは自動送信されています。
  </p>
</div>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Reminder email sent successfully");
  } catch (error) {
    console.error("Error sending reminder email:", error);
    throw new Error("メール送信に失敗しました");
  }
}
