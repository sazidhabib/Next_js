#!/usr/bin/env node
/**
 * Social Hub MCP Server (Model Context Protocol)
 * Designed for Hermes Agent and MCP-compatible AI systems.
 * 
 * Provides tools to:
 * - List connected social media accounts & platform constraints
 * - Automatically generate and schedule multi-platform posts
 * - Inspect publishing status & retry failed deliveries
 */

const readline = require("readline");

const APP_URL = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Helper for making API calls to local Next.js server
async function callApi(endpoint, options = {}) {
  const url = `${APP_URL.replace(/\/$/, "")}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      ...options,
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: `Failed to connect to Social Hub at ${url}. Ensure the Next.js app is running ('npm run dev'). Details: ${err.message}`,
    };
  }
}

// Tool definitions schema
const TOOLS = [
  {
    name: "get_social_accounts",
    description: "Get all connected social media accounts (LinkedIn, Twitter/X, Facebook, Instagram, YouTube) and their platform constraints (char limits, media requirements).",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "create_social_post",
    description: "Publish or queue a post across selected social media platforms with optional per-platform customized text/media.",
    inputSchema: {
      type: "object",
      properties: {
        contentText: {
          type: "string",
          description: "The primary content text of the post.",
        },
        mediaUrl: {
          type: "string",
          description: "Optional URL of an image or video to attach to the post.",
        },
        targetProviders: {
          type: "array",
          items: { type: "string" },
          description: "Optional list of providers to post to (e.g. ['linkedin', 'twitter', 'facebook', 'instagram', 'youtube']). If omitted, all active accounts are targeted.",
        },
        platformCustomizations: {
          type: "object",
          description: "Optional platform-specific overrides. Format: { twitter: { text: '...', mediaUrl: '...' }, linkedin: { text: '...' } }",
        },
      },
      required: ["contentText"],
    },
  },
  {
    name: "get_posts_history",
    description: "Retrieve recently published and queued posts along with delivery status across each channel (published, pending, failed).",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "retry_failed_post",
    description: "Retry failed deliveries for a specific post.",
    inputSchema: {
      type: "object",
      properties: {
        postId: {
          type: "string",
          description: "The UUID of the post to retry.",
        },
        deliveryId: {
          type: "string",
          description: "Optional specific delivery ID to retry. If omitted, all failed channels for this post will be retried.",
        },
      },
      required: ["postId"],
    },
  },
];

// Tool Execution Handlers
async function handleToolCall(name, args) {
  switch (name) {
    case "get_social_accounts": {
      const res = await callApi("/api/accounts");
      if (!res.ok) {
        throw new Error(res.error || res.data?.error || `HTTP ${res.status}`);
      }

      const { accounts = [], supportedProviders = [] } = res.data;
      const providerConstraints = Object.fromEntries(
        supportedProviders.map((p) => [
          p.id,
          {
            name: p.name,
            charLimit: p.charLimit,
            requiresMedia: p.requiresMedia,
          },
        ])
      );

      const accountsWithRules = accounts.map((acc) => ({
        id: acc.id,
        provider: acc.provider,
        accountName: acc.account_name,
        handle: acc.metadata?.handle || "N/A",
        isActive: acc.is_active,
        rules: providerConstraints[acc.provider] || {},
      }));

      return {
        totalAccounts: accountsWithRules.length,
        activeAccounts: accountsWithRules.filter((a) => a.isActive),
        supportedProviders: providerConstraints,
      };
    }

    case "create_social_post": {
      const { contentText, mediaUrl, targetProviders, platformCustomizations } = args;

      // 1. Fetch available accounts to map targets
      const accRes = await callApi("/api/accounts");
      if (!accRes.ok) {
        throw new Error(accRes.error || accRes.data?.error || `HTTP ${accRes.status}`);
      }

      let activeAccounts = (accRes.data.accounts || []).filter((a) => a.is_active);

      if (targetProviders && targetProviders.length > 0) {
        const lowerProviders = targetProviders.map((p) => p.toLowerCase());
        activeAccounts = activeAccounts.filter((a) => lowerProviders.includes(a.provider.toLowerCase()));
      }

      if (activeAccounts.length === 0) {
        throw new Error("No active social accounts found matching the requested target providers.");
      }

      // 2. Format platform customizations
      const formattedCustomizations = {};
      if (platformCustomizations && typeof platformCustomizations === "object") {
        for (const [prov, config] of Object.entries(platformCustomizations)) {
          formattedCustomizations[prov.toLowerCase()] = {
            isCustomized: true,
            text: config.text || contentText,
            mediaUrl: config.mediaUrl !== undefined ? config.mediaUrl : (mediaUrl || null),
          };
        }
      }

      // 3. Dispatch to POST /api/posts
      const payload = {
        contentText,
        mediaUrl: mediaUrl || null,
        targetAccounts: activeAccounts.map((a) => ({ id: a.id, provider: a.provider })),
        platformCustomizations: formattedCustomizations,
      };

      const postRes = await callApi("/api/posts", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!postRes.ok) {
        throw new Error(postRes.error || postRes.data?.error || `HTTP ${postRes.status}`);
      }

      return {
        success: true,
        postId: postRes.data.postId,
        message: postRes.data.message || "Post created and queued successfully.",
        targetedChannels: activeAccounts.map((a) => a.provider),
      };
    }

    case "get_posts_history": {
      const res = await callApi("/api/posts");
      if (!res.ok) {
        throw new Error(res.error || res.data?.error || `HTTP ${res.status}`);
      }

      const posts = (res.data.posts || []).map((p) => ({
        id: p.id,
        contentText: p.content_text,
        mediaUrl: p.media_url,
        status: p.status,
        createdAt: p.createdAt || p.created_at,
        deliveries: (p.deliveries || []).map((d) => ({
          id: d.id,
          provider: d.provider,
          status: d.status,
          externalId: d.external_post_id,
          error: d.error_message,
        })),
      }));

      return {
        totalPosts: posts.length,
        posts,
      };
    }

    case "retry_failed_post": {
      const { postId, deliveryId } = args;
      const res = await callApi(`/api/posts/${postId}/retry`, {
        method: "POST",
        body: JSON.stringify({ deliveryId }),
      });

      if (!res.ok) {
        throw new Error(res.error || res.data?.error || `HTTP ${res.status}`);
      }

      return res.data;
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// Stdio JSON-RPC MCP Server Protocol Implementation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

function sendResponse(id, result, error = null) {
  const response = {
    jsonrpc: "2.0",
    id,
  };
  if (error) {
    response.error = {
      code: error.code || -32603,
      message: error.message || "Internal error",
      data: error.data,
    };
  } else {
    response.result = result;
  }
  process.stdout.write(JSON.stringify(response) + "\n");
}

rl.on("line", async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  let request;
  try {
    request = JSON.parse(trimmed);
  } catch (err) {
    sendResponse(null, null, { code: -32700, message: "Parse error: Invalid JSON" });
    return;
  }

  const { id, method, params } = request;

  try {
    switch (method) {
      case "initialize":
        sendResponse(id, {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: "social-hub-mcp",
            version: "1.0.0",
          },
        });
        break;

      case "notifications/initialized":
        // Notification, no response needed
        break;

      case "ping":
        sendResponse(id, {});
        break;

      case "tools/list":
        sendResponse(id, { tools: TOOLS });
        break;

      case "tools/call": {
        const { name, arguments: toolArgs = {} } = params || {};
        try {
          const result = await handleToolCall(name, toolArgs);
          sendResponse(id, {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
            isError: false,
          });
        } catch (toolErr) {
          sendResponse(id, {
            content: [
              {
                type: "text",
                text: JSON.stringify({ error: toolErr.message }, null, 2),
              },
            ],
            isError: true,
          });
        }
        break;
      }

      default:
        if (id !== undefined && id !== null) {
          sendResponse(id, null, {
            code: -32601,
            message: `Method not found: ${method}`,
          });
        }
        break;
    }
  } catch (err) {
    if (id !== undefined && id !== null) {
      sendResponse(id, null, { code: -32603, message: err.message });
    }
  }
});
