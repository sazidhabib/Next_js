import { NextResponse } from "next/server";
import { getAdapter } from "@/lib/social/registry";
import crypto from "crypto";

export async function GET(req, { params }) {
  try {
    const { provider } = await params;
    const adapter = getAdapter(provider);

    const state = crypto.randomBytes(16).toString("hex");
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const redirectUri = `${appUrl}/api/auth/${provider}/callback`;

    const authUrl = adapter.getAuthUrl(state, redirectUri);

    const response = NextResponse.redirect(authUrl);
    response.cookies.set(`oauth_state_${provider}`, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
