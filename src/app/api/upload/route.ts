import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = () => path.join(process.cwd(), "public", "products");

// ── POST /api/upload  (multipart file upload) ──────────────────────
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only JPG, PNG, WEBP, GIF allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 5MB allowed." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase()
      .slice(0, 40);
    const filename = `${safeName}-${Date.now()}.${ext}`;

    await mkdir(UPLOAD_DIR(), { recursive: true });
    await writeFile(path.join(UPLOAD_DIR(), filename), buffer);

    return NextResponse.json({ url: `/products/${filename}`, filename });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// ── PUT /api/upload  (fetch image from external URL & save locally) ─
export async function PUT(req: NextRequest) {
  try {
    const { url } = await req.json() as { url: string };

    if (!url || !url.startsWith("http")) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Fetch the remote image
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; EVPartsBot/1.0)" },
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Could not fetch image (HTTP ${response.status})` }, { status: 400 });
    }

    const contentType = response.headers.get("content-type") || "";
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    const matched = allowedTypes.find(t => contentType.includes(t.replace("image/", "")));
    const ext = matched ? matched.split("/")[1].replace("jpeg", "jpg") : "jpg";

    const buffer = Buffer.from(await response.arrayBuffer());

    if (buffer.length > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "Remote image too large (max 8MB)" }, { status: 400 });
    }

    // Create a clean filename from the URL
    const urlPath = new URL(url).pathname;
    const rawName = urlPath.split("/").pop() || "product";
    const safeName = rawName
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase()
      .slice(0, 40);
    const filename = `${safeName}-${Date.now()}.${ext}`;

    await mkdir(UPLOAD_DIR(), { recursive: true });
    await writeFile(path.join(UPLOAD_DIR(), filename), buffer);

    return NextResponse.json({ url: `/products/${filename}`, filename, size: buffer.length });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("URL fetch error:", msg);
    return NextResponse.json({ error: `Failed to download image: ${msg}` }, { status: 500 });
  }
}
