import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const imageUrl = body.url;
    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image URL provided" },
        { status: 400 }
      );
    }
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image from URL" },
        { status: 400 }
      );
    }
    const imageData = await response.arrayBuffer();
    let fileExtension = "jpg";
    const contentType = response.headers.get("content-type");

    if (contentType) {
      if (contentType.includes("png")) {
        fileExtension = "png";
      } else if (contentType.includes("gif")) {
        fileExtension = "gif";
      } else if (contentType.includes("webp")) {
        fileExtension = "webp";
      }
    } else {
      const urlExtension = imageUrl.split(".").pop()?.toLowerCase();
      if (["jpg", "jpeg", "png", "gif", "webp"].includes(urlExtension)) {
        fileExtension = urlExtension || "jpg";
      }
    }
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = join(process.cwd(), "public", "uploads", fileName);
    await writeFile(filePath, Buffer.from(imageData));
    const localImageUrl = `uploads/${fileName}`;

    return NextResponse.json({
      success: 1,
      file: {
        url: localImageUrl,
      },
    });
  } catch (error) {
    console.error("Error fetching image from URL:", error);
    return NextResponse.json(
      { error: "画像のアップロードに失敗しました" },
      { status: 500 }
    );
  }
}
