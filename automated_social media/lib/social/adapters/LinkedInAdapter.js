import BaseSocialAdapter from "../BaseSocialAdapter";

export default class LinkedInAdapter extends BaseSocialAdapter {
  constructor() {
    super("linkedin");
    this.clientId = process.env.LINKEDIN_CLIENT_ID;
    this.clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  }

  getAuthUrl(state, redirectUri) {
    const scope = encodeURIComponent("openid profile email w_member_social");
    return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${this.clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${state}&scope=${scope}`;
  }

  async handleCallback(code, redirectUri) {
    const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`LinkedIn token exchange failed: ${err}`);
    }

    const data = await response.json();
    
    // Fetch profile
    const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    const profile = await profileRes.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || null,
      expiresIn: data.expires_in,
      accountId: profile.sub,
      accountName: profile.name || "LinkedIn User",
      metadata: {
        picture: profile.picture,
        email: profile.email,
      },
    };
  }

  async refreshToken(socialAccount) {
    const { refreshToken } = socialAccount.getDecryptedTokens();
    if (!refreshToken) throw new Error("No refresh token available for LinkedIn");

    const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`LinkedIn token refresh failed`);
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
      return { isValid: false, error: "Post text cannot be empty" };
    }
    if (text.length > 3000) {
      return { isValid: false, error: "LinkedIn post exceeds maximum limit of 3,000 characters" };
    }
    return { isValid: true, error: null };
  }

  async publish({ text, mediaUrl, accessToken, socialAccount }) {
    this.validate(text, mediaUrl);

    // If running in development / test mode or mock credentials
    if (!this.clientId || this.clientId === "your_linkedin_client_id" || accessToken.startsWith("mock_")) {
      await new Promise((r) => setTimeout(r, 800)); // Simulate API network latency
      const mockId = `urn:li:share:${Date.now()}`;
      return {
        success: true,
        externalPostId: mockId,
        url: `https://www.linkedin.com/feed/update/${mockId}`,
      };
    }

    const authorUrn = `urn:li:person:${socialAccount.account_id}`;
    const payload = {
      author: authorUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text },
          shareMediaCategory: mediaUrl ? "IMAGE" : "NONE",
          media: mediaUrl
            ? [
                {
                  status: "READY",
                  originalUrl: mediaUrl,
                },
              ]
            : [],
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`LinkedIn publishing failed: ${err}`);
    }

    const data = await res.json();
    return {
      success: true,
      externalPostId: data.id,
      url: `https://www.linkedin.com/feed/update/${data.id}`,
    };
  }
}
