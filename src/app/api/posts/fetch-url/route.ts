// pages/api/posts/fetch-url.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { url } = await req.json();

  // セキュリティ対策を入れつつ fetch
  if (!url || !url.startsWith("http")) {
    return NextResponse.json(
      { success: 0, error: "無効なURLです" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: 1,
    file: {
      url,
    },
  });
}
