import { NextResponse } from "next/server";
import { initDB, Post, PostDelivery, SocialAccount, User } from "@/lib/db";
import { dispatchPost } from "@/lib/queue/publisher";
import { getAdapter } from "@/lib/social/registry";

// In-memory fallback posts store
let mockPosts = [
  {
    id: "post_sample_1",
    content_text: "🚀 We are thrilled to introduce our new unified Social Hub! Publish to LinkedIn, Facebook, Instagram, X, and YouTube in 1 click. #Automation #SocialMedia",
    media_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    status: "completed",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    deliveries: [
      {
        id: "del_1",
        provider: "linkedin",
        status: "published",
        external_post_id: "urn:li:share:71239812938",
        published_at: new Date(Date.now() - 3590000).toISOString(),
      },
      {
        id: "del_2",
        provider: "twitter",
        status: "published",
        external_post_id: "17829381923891",
        published_at: new Date(Date.now() - 3590000).toISOString(),
      },
      {
        id: "del_3",
        provider: "facebook",
        status: "published",
        external_post_id: "fb_post_918239",
        published_at: new Date(Date.now() - 3590000).toISOString(),
      },
      {
        id: "del_4",
        provider: "instagram",
        status: "published",
        external_post_id: "C4x982319",
        published_at: new Date(Date.now() - 3590000).toISOString(),
      },
    ],
  },
];

export async function GET() {
  const dbStatus = await initDB();

  if (dbStatus.isConnected) {
    try {
      const posts = await Post.findAll({
        include: [
          {
            model: PostDelivery,
            as: "deliveries",
            include: [{ model: SocialAccount, as: "socialAccount" }],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      return NextResponse.json({
        success: true,
        databaseConnected: true,
        posts: posts.length > 0 ? posts : mockPosts,
      });
    } catch (err) {
      console.warn("DB posts query error, fallback to mock:", err.message);
    }
  }

  return NextResponse.json({
    success: true,
    databaseConnected: false,
    posts: mockPosts,
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { contentText, mediaUrl, targetAccounts, platformCustomizations } = body;

    if (!contentText || contentText.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Post text is required." }, { status: 400 });
    }

    if (!targetAccounts || targetAccounts.length === 0) {
      return NextResponse.json(
        { success: false, error: "Please select at least one social media channel to post." },
        { status: 400 }
      );
    }

    const dbStatus = await initDB();

    if (dbStatus.isConnected) {
      // Find or create default user
      let [user] = await User.findOrCreate({
        where: { email: "demo@antigravity.dev" },
        defaults: { name: "Demo User", password_hash: "demo_hash" },
      });

      // Create master Post with universal text + platform customizations
      const post = await Post.create({
        user_id: user.id,
        content_text: contentText,
        media_url: mediaUrl || null,
        platform_customizations: platformCustomizations || {},
        status: "processing",
      });

      // Create PostDeliveries with platform-specific overrides if customized
      const deliveries = await Promise.all(
        targetAccounts.map(async (acc) => {
          const customConfig = platformCustomizations?.[acc.provider];
          const hasCustomText = customConfig?.isCustomized && customConfig?.text !== undefined;
          const hasCustomMedia = customConfig?.isCustomized && customConfig?.mediaUrl !== undefined;

          return await PostDelivery.create({
            post_id: post.id,
            social_account_id: acc.id,
            provider: acc.provider,
            custom_text: hasCustomText ? customConfig.text : null,
            custom_media_url: hasCustomMedia ? customConfig.mediaUrl : null,
            status: "pending",
          });
        })
      );

      // Trigger asynchronous background dispatcher (non-blocking)
      dispatchPost(post.id).catch((err) => {
        console.error("Async post dispatcher error:", err);
      });

      return NextResponse.json({
        success: true,
        postId: post.id,
        message: "Post queued successfully across all selected channels.",
        post,
        deliveries,
      });
    }

    // In-Memory Simulation Fallback (runs realistic simulated deliveries with platform customization support)
    const newPostId = "post_" + Date.now();
    const initialDeliveries = targetAccounts.map((acc, idx) => {
      const customConfig = platformCustomizations?.[acc.provider];
      const hasCustomText = customConfig?.isCustomized && customConfig?.text !== undefined;
      const hasCustomMedia = customConfig?.isCustomized && customConfig?.mediaUrl !== undefined;

      return {
        id: `del_${newPostId}_${idx}`,
        provider: acc.provider,
        status: "in_progress",
        custom_text: hasCustomText ? customConfig.text : null,
        custom_media_url: hasCustomMedia ? customConfig.mediaUrl : null,
        external_post_id: null,
        error_message: null,
        published_at: null,
      };
    });

    const mockPost = {
      id: newPostId,
      content_text: contentText,
      media_url: mediaUrl || null,
      platform_customizations: platformCustomizations || {},
      status: "processing",
      createdAt: new Date().toISOString(),
      deliveries: initialDeliveries,
    };

    mockPosts.unshift(mockPost);

    // Simulate async publishing completion across channels with customized content validation
    setTimeout(() => {
      let anyFailed = false;
      mockPost.deliveries.forEach((del) => {
        const customConfig = platformCustomizations?.[del.provider];
        const effectiveText = (customConfig?.isCustomized && customConfig?.text)
          ? customConfig.text
          : contentText;
        const effectiveMediaUrl = (customConfig?.isCustomized && customConfig?.mediaUrl !== undefined)
          ? customConfig.mediaUrl
          : mediaUrl;

        // Validate with platform adapter using effective customized text & media
        const adapter = getAdapter(del.provider);
        const validation = adapter.validate(effectiveText, effectiveMediaUrl);

        if (!validation.isValid) {
          del.status = "failed";
          del.error_message = validation.error;
          anyFailed = true;
        } else {
          del.status = "published";
          del.external_post_id = `sim_${del.provider}_${Date.now()}`;
          del.published_at = new Date().toISOString();
        }
      });

      mockPost.status = anyFailed ? "partial_failure" : "completed";
    }, 1200);

    return NextResponse.json({
      success: true,
      postId: newPostId,
      message: "Post queued successfully across all selected channels.",
      post: mockPost,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
