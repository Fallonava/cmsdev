import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const enable = searchParams.get("enable") === "true";

  const dm = await draftMode();
  if (enable) {
    dm.enable();
  } else {
    dm.disable();
  }

  return NextResponse.json({ draftMode: enable });
}
