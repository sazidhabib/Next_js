import crypto from "crypto";
import { NextResponse } from "next/server";
import { Op } from "sequelize";
import { initDB, Post, PostDelivery, SocialAccount, User } from "@/lib/db";
import { dispatchPost } from "@/lib/queue/publisher";
import { moveFileToPosted, pickNextQueueItem } from "@/lib/drive/driveClient";
import { generateSeoPostCopy } from "@/lib/ai/seoGenerator";

function parseProviders(raw, fallback) {
  if (!raw) return fallback;
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function getSlotConfig(slotName) {
  const slots = {
    "1000_text": {
      name: "1000_text",
      label: "10:00 AM Daily Text Post",
      mode: "text",
      isReel: false,
      queueFolderId: process.env.DRIVE_SLOT_1000_QUEUE_ID,
      postedFolderId: process.env.DRIVE_SLOT_1000_POSTED_ID,
      providers: parseProviders(process.env.DRIVE_SLOT_1000_PROVIDERS, ["linkedin", "facebook"]),
    },
    "1530_reels": {
      name: "1530_reels",
      label: "3:30 PM Daily Reel / Short",
      mode: "reel",
      isReel: true,
      queueFolderId: process.env.DRIVE_SLOT_1530_QUEUE_ID,
      postedFolderId: process.env.DRIVE_SLOT_1530_POSTED_ID,
      providers: parseProviders(process.env.DRIVE_SLOT_1530_PROVIDERS, ["facebook", "youtube"]),
    },
    "1900_images": {
      name: "1900_images",
      label: "7:00 PM Daily Image + SEO Post",
      mode: "image",
      isReel: false,
      queueFolderId: process.env.DRIVE_SLOT_1900_QUEUE_ID,
      postedFolderId: process.env.DRIVE_SLOT_1900_POSTED_ID,
      providers: parseProviders(process.env.DRIVE_SLOT_1900_PROVIDERS, ["facebook", "linkedin"]),
    },
  };

  return slots[slotName] || null;
}

function verifyCronSecret(req) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return { ok: false, status: 503, error: "CRON_SECRET is not configured on the server." };
  }

  const authHeader = req.headers.get("authorization") || "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  const headerToken = req.headers.get("x-cron-secret") || "";
  const provided = bearerToken || headerToken;

  if (!provided) {
    return { ok: false, status: 401, error: "Missing cron authorization token." };
  }

  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, status: 403, error: "Invalid cron authorization token." };
  }

  return { ok: true };
}

async function handleCronPublish(req) {
  const auth = verifyCronSecret(req);
  if (!auth.ok) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const slotParam = searchParams.get("slot") || "1000_text";
  const dryRun = searchParams.get("dryRun") === "true";
  const providersOverride = searchParams.get("providers");

  const slotConfig = getSlotConfig(slotParam);
  if (!slotConfig) {
    return NextResponse.json(
      {
        success: false,
        error: `Unknown slot '${slotParam}'. Valid slots: 1000_text, 1530_reels, 1900_images`,
      },
      { status: 400 }
    );
  }

  if (!slotConfig.queueFolderId) {
    return NextResponse.json(
      {
        success: false,
        error: `Queue folder ID is not set for slot '${slotConfig.name}'. Configure its DRIVE_SLOT_*_QUEUE_ID env var.`,
      },
      { status: 400 }
    );
  }

  const targetProviders = providersOverride
    ? parseProviders(providersOverride, slotConfig.providers)
    : slotConfig.providers;

  try {
    const dbStatus = await initDB();
    if (!dbStatus.isConnected) {
      return NextResponse.json(
        {
          success: false,
          error: "MySQL database must be connected for automated Drive publishing.",
        },
        { status: 503 }
      );
    }

    // Load active connected social accounts matching this slot's providers
    const targetAccounts = await SocialAccount.findAll({
      where: {
        is_active: true,
        provider: { [Op.in]: targetProviders },
      },
    });

    if (targetAccounts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `No active connected accounts found for providers: ${targetProviders.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Collect already-posted Drive file IDs from recent posts to prevent duplicates
    const recentPosts = await Post.findAll({
      attributes: ["id", "platform_customizations"],
      order: [["created_at", "DESC"]],
      limit: 250,
    });

    const alreadyPostedIds = new Set();
    for (const p of recentPosts) {
      const fileId = p.platform_customizations?._driveMeta?.driveFileId;
      if (fileId) alreadyPostedIds.add(fileId);
    }

    // Pick oldest unposted file from Drive Queue folder
    const queueItem = await pickNextQueueItem(
      slotConfig.queueFolderId,
      slotConfig.mode,
      alreadyPostedIds
    );

    if (!queueItem) {
      return NextResponse.json({
        success: true,
        skipped: true,
        slot: slotConfig.name,
        message: "No unposted files found in Google Drive Queue folder.",
      });
    }

    // Generate SEO-friendly title, description, hashtags & per-platform copy
    const seo = await generateSeoPostCopy({
      filename: queueItem.primaryFile.name,
      sidecarData: queueItem.sidecarData,
      contentMode: slotConfig.mode,
    });

    if (dryRun) {
      return NextResponse.json({
        success: true,
        dryRun: true,
        slot: slotConfig.name,
        driveFile: {
          id: queueItem.primaryFile.id,
          name: queueItem.primaryFile.name,
          mediaType: queueItem.mediaType,
          sidecarFile: queueItem.sidecarFile?.name || null,
        },
        targetAccounts: targetAccounts.map((a) => ({
          id: a.id,
          provider: a.provider,
          accountName: a.account_name,
        })),
        generatedSeo: seo,
      });
    }

    let [user] = await User.findOrCreate({
      where: { email: "demo@antigravity.dev" },
      defaults: { name: "Demo User", password_hash: "demo_hash" },
    });

    const platformCustomizations = {
      ...seo.platformCustomizations,
      _seoTitle: seo.title,
      _driveMeta: {
        source: "google_drive",
        slot: slotConfig.name,
        driveFileId: queueItem.primaryFile.id,
        driveFileName: queueItem.primaryFile.name,
        hashtags: seo.hashtags,
      },
    };

    const post = await Post.create({
      user_id: user.id,
      content_text: seo.description,
      media_url: null,
      platform_customizations: platformCustomizations,
      status: "processing",
      scheduled_at: new Date(),
    });

    await Promise.all(
      targetAccounts.map((acc) => {
        const customText = seo.platformCustomizations?.[acc.provider]?.text || null;
        return PostDelivery.create({
          post_id: post.id,
          social_account_id: acc.id,
          provider: acc.provider,
          custom_text: customText,
          status: "pending",
        });
      })
    );

    const dispatchResult = await dispatchPost(post.id, {
      mediaBuffer: queueItem.mediaBuffer,
      mediaMimeType: queueItem.mediaMimeType,
      mediaType: queueItem.mediaType,
      title: seo.title,
      isReel: slotConfig.isReel,
    });

    // Move files from Queue/ to Posted/ if at least one delivery published
    let movedToPosted = false;
    if (
      (dispatchResult.status === "completed" || dispatchResult.status === "partial_failure") &&
      slotConfig.postedFolderId
    ) {
      await moveFileToPosted(
        queueItem.primaryFile.id,
        slotConfig.queueFolderId,
        slotConfig.postedFolderId
      );
      if (queueItem.sidecarFile) {
        await moveFileToPosted(
          queueItem.sidecarFile.id,
          slotConfig.queueFolderId,
          slotConfig.postedFolderId
        );
      }
      movedToPosted = true;
    }

    return NextResponse.json({
      success: true,
      slot: slotConfig.name,
      postId: post.id,
      status: dispatchResult.status,
      driveFile: queueItem.primaryFile.name,
      movedToPosted,
      deliveries: dispatchResult.deliveries.map((d) => ({
        id: d.id,
        provider: d.provider,
        status: d.status,
        external_post_id: d.external_post_id,
        error_message: d.error_message,
      })),
    });
  } catch (err) {
    console.error(`Cron publish error (${slotParam}):`, err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  return handleCronPublish(req);
}

export async function GET(req) {
  return handleCronPublish(req);
}
