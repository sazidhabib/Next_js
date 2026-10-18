import { Post, PostDelivery, SocialAccount } from "../db";
import { getAdapter } from "../social/registry";

/**
 * Dispatches a post to all pending platform deliveries asynchronously.
 * @param {string} postId - The Post UUID
 */
export async function dispatchPost(postId) {
  try {
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: PostDelivery,
          as: "deliveries",
          include: [{ model: SocialAccount, as: "socialAccount" }],
        },
      ],
    });

    if (!post) {
      throw new Error(`Post ${postId} not found.`);
    }

    await post.update({ status: "processing" });

    const pendingDeliveries = post.deliveries.filter((d) => d.status === "pending");

    // Execute across all channels concurrently with isolated error boundaries
    const results = await Promise.allSettled(
      pendingDeliveries.map((delivery) => processSingleDelivery(delivery, post))
    );

    // Re-query deliveries to determine overall post status
    const allDeliveries = await PostDelivery.findAll({ where: { post_id: postId } });
    const hasFailed = allDeliveries.some((d) => d.status === "failed");
    const hasPublished = allDeliveries.some((d) => d.status === "published");

    let finalStatus = "completed";
    if (hasFailed && hasPublished) {
      finalStatus = "partial_failure";
    } else if (hasFailed && !hasPublished) {
      finalStatus = "failed";
    }

    await post.update({ status: finalStatus });

    return {
      postId,
      status: finalStatus,
      deliveries: allDeliveries,
    };
  } catch (error) {
    console.error("Queue Dispatch Error:", error);
    throw error;
  }
}

/**
 * Executes delivery to a single social platform account.
 */
export async function processSingleDelivery(delivery, post) {
  const account = delivery.socialAccount;
  const adapter = getAdapter(delivery.provider);

  try {
    await delivery.update({ status: "in_progress", error_message: null });

    // Validate account presence
    if (!account || !account.is_active) {
      throw new Error(`Connected account for ${delivery.provider} is inactive or disconnected.`);
    }

    // 1. Auto token refresh check
    if (account.isTokenExpired && account.isTokenExpired()) {
      try {
        const refreshed = await adapter.refreshToken(account);
        await account.update({
          encrypted_access_token: refreshed.accessToken,
          encrypted_refresh_token: refreshed.refreshToken || account.encrypted_refresh_token,
          token_expires_at: refreshed.expiresIn
            ? new Date(Date.now() + refreshed.expiresIn * 1000)
            : null,
        });
      } catch (refreshErr) {
        throw new Error(`Token refresh failed: ${refreshErr.message}`);
      }
    }

    const { accessToken } = account.getDecryptedTokens();

    // 2. Validate platform constraints
    const validation = adapter.validate(post.content_text, post.media_url);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // 3. Publish to platform API
    const publishResult = await adapter.publish({
      text: post.content_text,
      mediaUrl: post.media_url,
      accessToken,
      socialAccount: account,
    });

    // 4. Record success
    await delivery.update({
      status: "published",
      external_post_id: publishResult.externalPostId || publishResult.url,
      published_at: new Date(),
    });

    return { success: true, deliveryId: delivery.id };
  } catch (err) {
    console.error(`Delivery failed for ${delivery.provider}:`, err.message);
    await delivery.update({
      status: "failed",
      error_message: err.message,
      retry_count: (delivery.retry_count || 0) + 1,
    });
    throw err;
  }
}

/**
 * Retries an individual failed delivery.
 */
export async function retryDelivery(deliveryId) {
  const delivery = await PostDelivery.findByPk(deliveryId, {
    include: [
      { model: SocialAccount, as: "socialAccount" },
      { model: Post, as: "post" },
    ],
  });

  if (!delivery) {
    throw new Error(`Delivery ${deliveryId} not found`);
  }

  const result = await processSingleDelivery(delivery, delivery.post);

  // Update parent post status
  const allDeliveries = await PostDelivery.findAll({ where: { post_id: delivery.post_id } });
  const hasFailed = allDeliveries.some((d) => d.status === "failed");
  const hasPublished = allDeliveries.some((d) => d.status === "published");

  let postStatus = "completed";
  if (hasFailed && hasPublished) postStatus = "partial_failure";
  else if (hasFailed && !hasPublished) postStatus = "failed";

  await delivery.post.update({ status: postStatus });

  return { delivery, postStatus };
}
