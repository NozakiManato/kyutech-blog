import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json(
        { error: "この画像は対応していません" },
        { status: 400 }
      );
    }

    const fileExtension = image.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = join(process.cwd(), "public", "uploads", fileName);

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: 1,
      file: {
        url: imageUrl,
      },
    });
  } catch (error) {
    console.error("Error uplading image:", error);
    return NextResponse.json(
      { error: "画像のアップロードに失敗しました" },
      { status: 500 }
    );
  }
}
