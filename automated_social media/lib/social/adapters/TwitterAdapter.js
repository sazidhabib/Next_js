import BaseSocialAdapter from "../BaseSocialAdapter";

export default class TwitterAdapter extends BaseSocialAdapter {
  constructor() {
    super("twitter");
    this.clientId = process.env.X_CLIENT_ID;
    this.clientSecret = process.env.X_CLIENT_SECRET;
  }

  getAuthUrl(state, redirectUri) {
    const scopes = encodeURIComponent("tweet.read tweet.write users.read offline.access");
    // Standard OAuth 2.0 PKCE flow
    return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${this.clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${scopes}&state=${state}&code_challenge=challenge&code_challenge_method=plain`;
  }

  async handleCallback(code, redirectUri) {
    const basicAuth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64");
    const response = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code_verifier: "challenge",
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`X token exchange failed: ${err}`);
    }

    const data = await response.json();

    // Fetch user profile
    const userRes = await fetch("https://api.twitter.com/2/users/me?user.fields=profile_image_url,username", {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    const user = await userRes.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      accountId: user.data.id,
      accountName: `@${user.data.username}`,
      metadata: {
        username: user.data.username,
        profile_image_url: user.data.profile_image_url,
      },
    };
  }

  async refreshToken(socialAccount) {
    const { refreshToken } = socialAccount.getDecryptedTokens();
    if (!refreshToken) throw new Error("No refresh token available for X");

    const basicAuth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64");
    const response = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      throw new Error("X token refresh failed");
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || refreshToken,
      expiresIn: data.expires_in,
    };
  }

  validate(text, mediaUrl) {
    if (!text || text.trim().length === 0) {
      return { isValid: false, error: "Tweet text cannot be empty." };
    }
    if (text.length > 280) {
      return { isValid: false, error: `Tweet exceeds 280 characters limit (Current: ${text.length}).` };
    }
    return { isValid: true, error: null };
  }

  async publish({ text, mediaUrl, accessToken, socialAccount }) {
    this.validate(text, mediaUrl);

    // Development / Simulation Fallback
    if (!this.clientId || this.clientId === "your_x_client_id" || accessToken.startsWith("mock_")) {
      await new Promise((r) => setTimeout(r, 750));
      const mockTweetId = `${Date.now()}`;
      return {
        success: true,
        externalPostId: mockTweetId,
        url: `https://x.com/i/status/${mockTweetId}`,
      };
    }

    const body = { text };

    const res = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`X tweet publishing failed: ${err}`);
    }

    const data = await res.json();
    return {
      success: true,
      externalPostId: data.data.id,
      url: `https://x.com/i/status/${data.data.id}`,
    };
  }
}
