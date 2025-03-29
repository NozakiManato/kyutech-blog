import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "このファイルは対応していません" },
        { status: 400 }
      );
    }
    const originalName = file.name;
    const fileExtension = originalName.split(".").pop() || "";
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = join(process.cwd(), "public", "uploads", fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;
    return NextResponse.json({
      success: 1,
      file: {
        url: fileUrl,
        name: originalName,
        size: file.size,
        extension: fileExtension,
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "ファイルのアップロードに失敗しました" },
      { status: 500 }
    );
  }
}
