import { NextResponse } from "next/server";
import { getAdapter } from "@/lib/social/registry";
import { initDB, SocialAccount, User } from "@/lib/db";

export async function GET(req, { params }) {
  const { provider } = await params;
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (error) {
    return NextResponse.redirect(`${appUrl}?error=${encodeURIComponent(errorDescription || error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${appUrl}?error=${encodeURIComponent("Missing authorization code.")}`);
  }

  // Verify CSRF state cookie
  const cookieState = req.cookies.get(`oauth_state_${provider}`)?.value;
  if (!cookieState || cookieState !== state) {
    return NextResponse.redirect(`${appUrl}?error=${encodeURIComponent("Invalid CSRF state token.")}`);
  }

  try {
    const adapter = getAdapter(provider);
    const redirectUri = `${appUrl}/api/auth/${provider}/callback`;

    const accountData = await adapter.handleCallback(code, redirectUri);

    const dbStatus = await initDB();
    if (dbStatus.isConnected) {
      // Find or create default user
      let [user] = await User.findOrCreate({
        where: { email: "demo@antigravity.dev" },
        defaults: { name: "Demo User", password_hash: "demo_hash" },
      });

      // Upsert social account
      await SocialAccount.upsert({
        user_id: user.id,
        provider,
        account_name: accountData.accountName,
        account_id: accountData.accountId,
        encrypted_access_token: accountData.accessToken,
        encrypted_refresh_token: accountData.refreshToken,
        token_expires_at: accountData.expiresIn
          ? new Date(Date.now() + accountData.expiresIn * 1000)
          : null,
        metadata: accountData.metadata,
        is_active: true,
      });
    }

    const response = NextResponse.redirect(`${appUrl}?connected=${provider}`);
    // Clear state cookie
    response.cookies.delete(`oauth_state_${provider}`);
    return response;
  } catch (err) {
    console.error(`OAuth callback error for ${provider}:`, err);
    return NextResponse.redirect(`${appUrl}?error=${encodeURIComponent(err.message)}`);
  }
}
