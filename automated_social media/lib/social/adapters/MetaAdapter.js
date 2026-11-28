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
      const err = await res.text();
      throw new Error(`Meta access token exchange failed: ${err}`);
    }
    const tokenData = await res.json();

    // 2. Exchange for 60-day long-lived User token
    const longLivedUrl = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.appId}&client_secret=${this.appSecret}&fb_exchange_token=${tokenData.access_token}`;
    const longRes = await fetch(longLivedUrl);
    const longData = await longRes.json();
    const finalUserToken = longData.access_token || tokenData.access_token;

    // 3. Fetch managed Facebook Pages and linked Instagram Business accounts
    const pagesUrl = `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,picture,instagram_business_account{id,username,profile_picture_url}&access_token=${finalUserToken}`;
    const pagesRes = await fetch(pagesUrl);
    const pagesData = await pagesRes.json();
    const pages = Array.isArray(pagesData?.data) ? pagesData.data : [];

    if (this.subProvider === "instagram") {
      const igAccounts = pages
        .filter((p) => p.instagram_business_account?.id)
        .map((p) => {
          const ig = p.instagram_business_account;
          return {
            accessToken: p.access_token || finalUserToken,
            refreshToken: null,
            expiresIn: null, // Page-linked tokens derived from long-lived user tokens do not expire
            accountId: ig.id,
            accountName: `@${ig.username || ig.id} (Instagram)`,
            metadata: {
              picture: ig.profile_picture_url || p.picture?.data?.url,
              handle: ig.username ? `@${ig.username}` : null,
              linkedPageId: p.id,
              linkedPageName: p.name,
              type: "instagram_business",
            },
          };
        });

      if (igAccounts.length === 0) {
        throw new Error(
          "No Instagram Business account found linked to your Facebook Pages. Link an Instagram Business/Creator account to a Facebook Page first."
        );
      }

      return {
        ...igAccounts[0],
        extraAccounts: igAccounts.slice(1),
      };
    }

    // Facebook Pages
    if (pages.length > 0) {
      const fbPages = pages.map((page) => ({
        accessToken: page.access_token,
        refreshToken: null,
        expiresIn: null, // Page access token derived from long-lived user token does not expire
        accountId: page.id,
        accountName: `${page.name} (FB Page)`,
        metadata: {
          picture: page.picture?.data?.url,
          pageName: page.name,
          type: "facebook_page",
        },
      }));

      return {
        ...fbPages[0],
        extraAccounts: fbPages.slice(1),
      };
    }

    // Fallback to /me if user has no Pages (note: Meta blocks posting to personal profiles)
    const meRes = await fetch(
      `https://graph.facebook.com/v19.0/me?fields=id,name,picture&access_token=${finalUserToken}`
    );
    const me = await meRes.json();

    return {
      accessToken: finalUserToken,
      refreshToken: null,
      expiresIn: longData.expires_in || 5184000,
      accountId: me.id,
      accountName: `${me.name} (Profile - No Page Found)`,
      metadata: {
        picture: me.picture?.data?.url,
        type: "facebook_profile",
      },
    };
  }

  async refreshToken(socialAccount) {
    // Facebook Page tokens derived from a long-lived user token do not expire
    const metaType = socialAccount.metadata?.type;
    if (metaType === "facebook_page" || metaType === "instagram_business") {
      const { accessToken } = socialAccount.getDecryptedTokens();
      return {
        accessToken,
        refreshToken: null,
        expiresIn: null,
      };
    }

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

  validate(text, mediaUrl, options = {}) {
    const hasMedia = Boolean(mediaUrl || options?.mediaBuffer);
    if (this.subProvider === "instagram" && !hasMedia) {
      return { isValid: false, error: "Instagram requires an image or media URL for publishing." };
    }
    if (text && text.length > 2200 && this.subProvider === "instagram") {
      return { isValid: false, error: "Instagram captions cannot exceed 2,200 characters." };
    }
    return { isValid: true, error: null };
  }

  async publish({
    text,
    title,
    mediaUrl,
    mediaBuffer,
    mediaMimeType,
    mediaType,
    isReel = false,
    accessToken,
    socialAccount,
  }) {
    const val = this.validate(text, mediaUrl, { mediaBuffer });
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
    const isVideo = mediaType === "video" || (mediaMimeType || "").startsWith("video/");

    if (this.subProvider === "facebook") {
      // Binary Video / Reel upload from Google Drive
      if (mediaBuffer && isVideo) {
        if (isReel) {
          return await this.publishFacebookReel({
            accountId,
            accessToken,
            mediaBuffer,
            description: text,
          });
        }

        const form = new FormData();
        form.append("access_token", accessToken);
        form.append("description", text || "");
        if (title) form.append("title", title);
        form.append(
          "source",
          new Blob([mediaBuffer], { type: mediaMimeType || "video/mp4" }),
          "video.mp4"
        );

        const res = await fetch(`https://graph-video.facebook.com/v19.0/${accountId}/videos`, {
          method: "POST",
          body: form,
        });
        if (!res.ok) {
          const err = await res.text();
          throw new Error(`Facebook video upload failed: ${err}`);
        }
        const data = await res.json();
        return {
          success: true,
          externalPostId: data.id,
          url: `https://www.facebook.com/${accountId}/videos/${data.id}`,
        };
      }

      // Binary Image upload from Google Drive
      if (mediaBuffer && !isVideo) {
        const form = new FormData();
        form.append("access_token", accessToken);
        form.append("message", text || "");
        form.append(
          "source",
          new Blob([mediaBuffer], { type: mediaMimeType || "image/jpeg" }),
          "image.jpg"
        );

        const res = await fetch(`https://graph.facebook.com/v19.0/${accountId}/photos`, {
          method: "POST",
          body: form,
        });
        if (!res.ok) {
          const err = await res.text();
          throw new Error(`Facebook photo upload failed: ${err}`);
        }
        const data = await res.json();
        return {
          success: true,
          externalPostId: data.post_id || data.id,
          url: `https://facebook.com/${data.post_id || data.id}`,
        };
      }

      // URL or text-only publish
      const endpoint = mediaUrl
        ? `https://graph.facebook.com/v19.0/${accountId}/photos`
        : `https://graph.facebook.com/v19.0/${accountId}/feed`;

      const params = new URLSearchParams({
        access_token: accessToken,
        message: text || "",
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
      // Instagram Graph API requires a publicly reachable URL (cannot accept raw multipart bytes directly)
      if (!mediaUrl) {
        throw new Error(
          "Instagram Graph API requires a public mediaUrl. Provide a public URL or host Drive media publicly before publishing to Instagram."
        );
      }

      const containerRes = await fetch(
        `https://graph.facebook.com/v19.0/${accountId}/media?image_url=${encodeURIComponent(
          mediaUrl
        )}&caption=${encodeURIComponent(text || "")}&access_token=${accessToken}`,
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

  /**
   * 3-Step Facebook Page Reels upload flow.
   */
  async publishFacebookReel({ accountId, accessToken, mediaBuffer, description }) {
    // Step 1: Initialize upload session
    const startParams = new URLSearchParams({
      upload_phase: "start",
      access_token: accessToken,
    });
    const startRes = await fetch(
      `https://graph.facebook.com/v19.0/${accountId}/video_reels`,
      { method: "POST", body: startParams }
    );
    if (!startRes.ok) {
      const err = await startRes.text();
      throw new Error(`Facebook Reel start failed: ${err}`);
    }
    const { video_id, upload_url } = await startRes.json();

    // Step 2: Upload binary bytes to rupload endpoint
    const uploadTarget = upload_url || `https://rupload.facebook.com/video-upload/v19.0/${video_id}`;
    const uploadRes = await fetch(uploadTarget, {
      method: "POST",
      headers: {
        Authorization: `OAuth ${accessToken}`,
        offset: "0",
        file_size: String(mediaBuffer.length),
      },
      body: mediaBuffer,
    });
    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      throw new Error(`Facebook Reel binary upload failed: ${err}`);
    }

    // Step 3: Publish Reel
    const finishParams = new URLSearchParams({
      upload_phase: "finish",
      video_id,
      video_state: "PUBLISHED",
      description: description || "",
      access_token: accessToken,
    });
    const finishRes = await fetch(
      `https://graph.facebook.com/v19.0/${accountId}/video_reels`,
      { method: "POST", body: finishParams }
    );
    if (!finishRes.ok) {
      const err = await finishRes.text();
      throw new Error(`Facebook Reel publish finish failed: ${err}`);
    }

    return {
      success: true,
      externalPostId: video_id,
      url: `https://www.facebook.com/reel/${video_id}`,
    };
  }
}
