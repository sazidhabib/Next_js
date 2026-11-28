import BaseSocialAdapter from "../BaseSocialAdapter";

export default class LinkedInAdapter extends BaseSocialAdapter {
  constructor() {
    super("linkedin");
    this.clientId = process.env.LINKEDIN_CLIENT_ID;
    this.clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  }

  getAuthUrl(state, redirectUri) {
    const scopes = ["openid", "profile", "email", "w_member_social"];
    // Enable organization scopes only if LinkedIn App has Community Management API approved
    if (process.env.LINKEDIN_ENABLE_ORG_SCOPES === "true") {
      scopes.push("w_organization_social", "r_organization_social", "rw_organization_admin");
    }

    const scope = encodeURIComponent(scopes.join(" "));
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

    // Fetch personal profile
    const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    const profile = await profileRes.json();

    const personalAccount = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || null,
      expiresIn: data.expires_in,
      accountId: `urn:li:person:${profile.sub}`,
      accountName: `${profile.name || "LinkedIn User"} (Personal)`,
      metadata: {
        picture: profile.picture,
        email: profile.email,
        type: "person",
      },
    };

    const extraAccounts = [];

    // Optionally fetch administered Company Pages if organization scopes are enabled
    if (process.env.LINKEDIN_ENABLE_ORG_SCOPES === "true") {
      try {
        const aclRes = await fetch(
          "https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED",
          {
            headers: {
              Authorization: `Bearer ${data.access_token}`,
              "X-Restli-Protocol-Version": "2.0.0",
            },
          }
        );

        if (aclRes.ok) {
          const aclData = await aclRes.json();
          const orgUrns = (aclData.elements || [])
            .map((el) => el.organization)
            .filter(Boolean);

          for (const orgUrn of orgUrns) {
            const orgId = orgUrn.split(":").pop();
            let orgName = `LinkedIn Page ${orgId}`;

            try {
              const orgRes = await fetch(
                `https://api.linkedin.com/v2/organizations/${orgId}?projection=(id,localizedName)`,
                {
                  headers: {
                    Authorization: `Bearer ${data.access_token}`,
                    "X-Restli-Protocol-Version": "2.0.0",
                  },
                }
              );
              if (orgRes.ok) {
                const orgInfo = await orgRes.json();
                if (orgInfo.localizedName) orgName = orgInfo.localizedName;
              }
            } catch {
              // ignore org name fetch error and use fallback
            }

            extraAccounts.push({
              accessToken: data.access_token,
              refreshToken: data.refresh_token || null,
              expiresIn: data.expires_in,
              accountId: orgUrn,
              accountName: `${orgName} (Company Page)`,
              metadata: {
                picture: profile.picture,
                type: "organization",
                organizationUrn: orgUrn,
              },
            });
          }
        }
      } catch (err) {
        console.warn("LinkedIn organization ACL fetch skipped:", err.message);
      }
    }

    return {
      ...personalAccount,
      extraAccounts,
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

  async registerAndUploadMedia({ authorUrn, accessToken, mediaBuffer, mediaMimeType, isVideo }) {
    const recipe = isVideo
      ? "urn:li:digitalmediaRecipe:feedshare-video"
      : "urn:li:digitalmediaRecipe:feedshare-image";

    const registerRes = await fetch("https://api.linkedin.com/v2/assets?action=registerUpload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        registerUploadRequest: {
          recipes: [recipe],
          owner: authorUrn,
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent",
            },
          ],
        },
      }),
    });

    if (!registerRes.ok) {
      const err = await registerRes.text();
      throw new Error(`LinkedIn asset registration failed: ${err}`);
    }

    const registerData = await registerRes.json();
    const uploadUrl =
      registerData?.value?.uploadMechanism?.["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"]
        ?.uploadUrl;
    const assetUrn = registerData?.value?.asset;

    if (!uploadUrl || !assetUrn) {
      throw new Error("LinkedIn asset registration returned no uploadUrl or asset URN.");
    }

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": mediaMimeType || (isVideo ? "video/mp4" : "image/jpeg"),
      },
      body: mediaBuffer,
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      throw new Error(`LinkedIn binary asset upload failed: ${err}`);
    }

    return assetUrn;
  }

  async publish({
    text,
    title,
    mediaUrl,
    mediaBuffer,
    mediaMimeType,
    mediaType,
    accessToken,
    socialAccount,
  }) {
    const val = this.validate(text, mediaUrl);
    if (!val.isValid) throw new Error(val.error);

    // If running in development / test mode or mock credentials
    if (!this.clientId || this.clientId === "your_linkedin_client_id" || accessToken.startsWith("mock_")) {
      await new Promise((r) => setTimeout(r, 800));
      const mockId = `urn:li:share:${Date.now()}`;
      return {
        success: true,
        externalPostId: mockId,
        url: `https://www.linkedin.com/feed/update/${mockId}`,
      };
    }

    const rawId = socialAccount.account_id;
    const authorUrn = rawId.startsWith("urn:li:") ? rawId : `urn:li:person:${rawId}`;
    const isVideo = mediaType === "video" || (mediaMimeType || "").startsWith("video/");

    let shareMediaCategory = "NONE";
    let mediaArray = [];

    if (mediaBuffer) {
      const assetUrn = await this.registerAndUploadMedia({
        authorUrn,
        accessToken,
        mediaBuffer,
        mediaMimeType,
        isVideo,
      });
      shareMediaCategory = isVideo ? "VIDEO" : "IMAGE";
      mediaArray = [
        {
          status: "READY",
          media: assetUrn,
          ...(title ? { title: { text: title.slice(0, 200) } } : {}),
        },
      ];
    } else if (mediaUrl) {
      shareMediaCategory = "IMAGE";
      mediaArray = [
        {
          status: "READY",
          originalUrl: mediaUrl,
        },
      ];
    }

    const payload = {
      author: authorUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text },
          shareMediaCategory,
          media: mediaArray,
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
