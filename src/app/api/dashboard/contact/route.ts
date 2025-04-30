import { db } from "@/lib/db";
import { sendEmail } from "@/lib/mail";
import { ContactFormSchema } from "@/lib/validations/contact";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = ContactFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validationResult.data;

    await db.contact.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    const adminEmail =
      process.env.SMTP_USER ||
      process.env.SMTP_FROM ||
      "nozaki.manato889@kyutech.mail.jp";
    await sendEmail({
      to: adminEmail,
      subject: `新しいお問い合わせ: ${subject}`,
      html: `
         <h1>新しいお問い合わせがありました</h1>
        <p><strong>名前:</strong> ${name}</p>
        <p><strong>メールアドレス:</strong> ${email}</p>
        <p><strong>件名:</strong> ${subject}</p>
        <p><strong>メッセージ:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Contact form submission error: ", error);
    return NextResponse.json(
      {
        success: false,
        errors: {
          _form: [
            "お問い合わせの送信中にエラーが発生しました。後でもう一度お試しください。",
          ],
        },
      },
      { status: 500 }
    );
  }
}
