import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src", "data", "data.json");

function readData() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeData(data: Record<string, unknown>) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = readData();

    // Support partial updates — merge with existing
    const updated = {
      settings: body.settings ?? current.settings,
      brands: body.brands ?? current.brands,
      products: body.products ?? current.products,
    };

    writeData(updated);
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
