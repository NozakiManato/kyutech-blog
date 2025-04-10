import { NextResponse } from "next/server";
import { getAllLabs } from "@/lib/prisma/lab";

export async function GET() {
  try {
    const labs = await getAllLabs();
    return NextResponse.json(labs);
  } catch (error) {
    console.error("Error fetching labs:", error);
    return NextResponse.json(
      { error: "研究室の取得に失敗しました" },
      { status: 500 }
    );
  }
}
