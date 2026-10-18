import BaseSocialAdapter from "../BaseSocialAdapter";

export default class MetaAdapter extends BaseSocialAdapter {
  constructor(subProvider = "facebook") {
    super(subProvider);
    this.subProvider = subProvider; // 'facebook' or 'instagram'
    this.appId = process.env.META_APP_ID;
    this.appSecret = process.env.META_APP_SECRET;
  }

  getAuthUrl(state, redirectUri) {
    const scopes = [
      "pages_show_list",
      "pages_read_engagement",
      "pages_manage_posts",
      "instagram_basic",
      "instagram_content_publish",
    ].join(",");

    return `https://www.facebook.com/v19.0/dialog/oauth?client_id=${this.appId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${state}&scope=${encodeURIComponent(scopes)}`;
  }

  async handleCallback(code, redirectUri) {
    // 1. Exchange short-lived token
    const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${this.appId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&client_secret=${this.appSecret}&code=${code}`;

    const res = await fetch(tokenUrl);
    if (!res.ok) {
      throw new Error("Meta access token exchange failed");
    }
    const tokenData = await res.json();

    // 2. Exchange for 60-day long-lived token
    const longLivedUrl = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.appId}&client_secret=${this.appSecret}&fb_exchange_token=${tokenData.access_token}`;
    const longRes = await fetch(longLivedUrl);
    const longData = await longRes.json();
    const finalToken = longData.access_token || tokenData.access_token;

    // 3. Get User Profile and Pages
    const meRes = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name,picture&access_token=${finalToken}`);
    const me = await meRes.json();

    return {
      accessToken: finalToken,
      refreshToken: null, // Meta uses long-lived tokens that are renewed via code
      expiresIn: longData.expires_in || 5184000, // ~60 days
      accountId: me.id,
      accountName: `${me.name} (${this.subProvider === "instagram" ? "Instagram" : "Facebook"})`,
      metadata: {
        picture: me.picture?.data?.url,
        type: this.subProvider,
      },
    };
  }

  async refreshToken(socialAccount) {
    const { accessToken } = socialAccount.getDecryptedTokens();
    const refreshUrl = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.appId}&client_secret=${this.appSecret}&fb_exchange_token=${accessToken}`;
    
    const res = await fetch(refreshUrl);
    if (!res.ok) {
      throw new Error("Meta token renewal failed");
    }
    const data = await res.json();
    return {
      accessToken: data.access_token,
      refreshToken: null,
      expiresIn: data.expires_in || 5184000,
    };
  }

  validate(text, mediaUrl) {
    if (this.subProvider === "instagram" && !mediaUrl) {
      return { isValid: false, error: "Instagram requires an image or media URL for publishing." };
    }
    if (text && text.length > 2200 && this.subProvider === "instagram") {
      return { isValid: false, error: "Instagram captions cannot exceed 2,200 characters." };
    }
    return { isValid: true, error: null };
  }

  async publish({ text, mediaUrl, accessToken, socialAccount }) {
    const val = this.validate(text, mediaUrl);
    if (!val.isValid) throw new Error(val.error);

    // Development fallback
    if (!this.appId || this.appId === "your_meta_app_id" || accessToken.startsWith("mock_")) {
      await new Promise((r) => setTimeout(r, 900));
      const mockId = `${Date.now()}_${Math.floor(Math.random() * 100000)}`;
      return {
        success: true,
        externalPostId: mockId,
        url:
          this.subProvider === "instagram"
            ? `https://instagram.com/p/${mockId}`
            : `https://facebook.com/${mockId}`,
      };
    }

    const accountId = socialAccount.account_id;

    if (this.subProvider === "facebook") {
      const endpoint = mediaUrl
        ? `https://graph.facebook.com/v19.0/${accountId}/photos`
        : `https://graph.facebook.com/v19.0/${accountId}/feed`;

      const params = new URLSearchParams({
        access_token: accessToken,
        message: text,
      });
      if (mediaUrl) params.append("url", mediaUrl);

      const res = await fetch(endpoint, { method: "POST", body: params });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Facebook post failed: ${err}`);
      }
      const data = await res.json();
      return {
        success: true,
        externalPostId: data.id || data.post_id,
        url: `https://facebook.com/${data.id || data.post_id}`,
      };
    } else {
      // Instagram 2-step container publish
      const containerRes = await fetch(
        `https://graph.facebook.com/v19.0/${accountId}/media?image_url=${encodeURIComponent(
          mediaUrl
        )}&caption=${encodeURIComponent(text)}&access_token=${accessToken}`,
        { method: "POST" }
      );
      if (!containerRes.ok) {
        const err = await containerRes.text();
        throw new Error(`Instagram container creation failed: ${err}`);
      }
      const container = await containerRes.json();

      const publishRes = await fetch(
        `https://graph.facebook.com/v19.0/${accountId}/media_publish?creation_id=${container.id}&access_token=${accessToken}`,
        { method: "POST" }
      );
      if (!publishRes.ok) {
        const err = await publishRes.text();
        throw new Error(`Instagram publish failed: ${err}`);
      }
      const published = await publishRes.json();
      return {
        success: true,
        externalPostId: published.id,
        url: `https://instagram.com/p/${published.id}`,
      };
    }
  }
}
