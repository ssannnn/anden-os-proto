import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "anden_demo_session";
const DEMO_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { code?: string };
  const expectedCode = process.env.DEMO_ACCESS_CODE ?? "anden-demo";

  if (!body.code || body.code !== expectedCode) {
    return NextResponse.json(
      { ok: false, error: "Invalid access code" },
      { status: 401 }
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "open", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DEMO_SESSION_MAX_AGE_SECONDS
  });

  return NextResponse.json({ ok: true });
}
