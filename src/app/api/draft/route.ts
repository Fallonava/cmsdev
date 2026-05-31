import { NextRequest, NextResponse } from "next/server";
import { setDraft, getDraft, clearDraft } from "@/lib/draftStore";

const COOKIE_NAME = "preview_draft_token";
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 2, // 2 hours
  path: "/",
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token =
    req.cookies.get(COOKIE_NAME)?.value || crypto.randomUUID();

  setDraft(token, {
    settings: body.settings ?? null,
    media: body.media ?? null,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, COOKIE_OPTS);
  return res;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json(null);
  return NextResponse.json(getDraft(token));
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (token) clearDraft(token);
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
