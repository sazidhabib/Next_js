import BaseSocialAdapter from "../BaseSocialAdapter";

export default class YouTubeAdapter extends BaseSocialAdapter {
  constructor() {
    super("youtube");
    this.clientId = process.env.GOOGLE_CLIENT_ID;
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  }

  getAuthUrl(state, redirectUri) {
    const scopes = encodeURIComponent(
      "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.profile"
    );
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${scopes}&access_type=offline&prompt=consent&state=${state}`;
  }

  async handleCallback(code, redirectUri) {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Google OAuth token exchange failed: ${err}`);
    }

    const data = await res.json();

    // Fetch YouTube channel details
    const channelRes = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
      {
        headers: { Authorization: `Bearer ${data.access_token}` },
      }
    );
    const channelData = await channelRes.json();
    const channel = channelData.items?.[0];

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      accountId: channel?.id || "yt_channel",
      accountName: channel?.snippet?.title || "YouTube Channel",
      metadata: {
        thumbnail: channel?.snippet?.thumbnails?.default?.url,
        customUrl: channel?.snippet?.customUrl,
      },
    };
  }

  async refreshToken(socialAccount) {
    const { refreshToken } = socialAccount.getDecryptedTokens();
    if (!refreshToken) throw new Error("No refresh token available for Google / YouTube");

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!res.ok) {
      throw new Error("Google / YouTube token refresh failed");
    }

    const data = await res.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || refreshToken,
      expiresIn: data.expires_in,
    };
  }

  validate(text, mediaUrl, options = {}) {
    if ((!text || text.trim().length === 0) && !options?.mediaBuffer) {
      return { isValid: false, error: "YouTube post text or video file is required." };
    }
    return { isValid: true, error: null };
  }

  async publish({
    text,
    title,
    mediaUrl,
    mediaBuffer,
    mediaMimeType,
    accessToken,
  }) {
    const val = this.validate(text, mediaUrl, { mediaBuffer });
    if (!val.isValid) throw new Error(val.error);

    // Development / Simulation Fallback
    if (!this.clientId || this.clientId === "your_google_client_id" || accessToken.startsWith("mock_")) {
      await new Promise((r) => setTimeout(r, 850));
      const mockPostId = `Ugkx${Date.now()}`;
      return {
        success: true,
        externalPostId: mockPostId,
        url: `https://www.youtube.com/shorts/${mockPostId}`,
      };
    }

    if (!mediaBuffer) {
      throw new Error(
        "YouTube Data API v3 only supports video/Shorts uploads (not text-only Community posts). Use the Reels/Video Drive slot for YouTube."
      );
    }

    const videoTitle = (title || text?.split("\n")[0] || "Daily Short").slice(0, 100);
    const privacyStatus = process.env.YOUTUBE_PRIVACY_STATUS || "public";
    const contentType = mediaMimeType || "video/mp4";

    // Step 1: Start resumable upload session
    const initRes = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json; charset=UTF-8",
          "X-Upload-Content-Length": String(mediaBuffer.length),
          "X-Upload-Content-Type": contentType,
        },
        body: JSON.stringify({
          snippet: {
            title: videoTitle,
            description: text || videoTitle,
            categoryId: "22",
          },
          status: {
            privacyStatus,
            selfDeclaredMadeForKids: false,
          },
        }),
      }
    );

    if (!initRes.ok) {
      const err = await initRes.text();
      throw new Error(`YouTube resumable upload init failed: ${err}`);
    }

    const uploadUrl = initRes.headers.get("location");
    if (!uploadUrl) {
      throw new Error("YouTube did not return a resumable upload Location header.");
    }

    // Step 2: Upload video bytes
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(mediaBuffer.length),
      },
      body: mediaBuffer,
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      throw new Error(`YouTube video upload failed: ${err}`);
    }

    const data = await uploadRes.json();
    return {
      success: true,
      externalPostId: data.id,
      url: `https://www.youtube.com/shorts/${data.id}`,
    };
  }
}
