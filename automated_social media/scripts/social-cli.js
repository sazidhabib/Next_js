#!/usr/bin/env node
/**
 * Social Hub CLI Companion
 * Quick command-line interface for human users and Hermes Agent's bash/terminal tool.
 *
 * Usage:
 *   node scripts/social-cli.js accounts
 *   node scripts/social-cli.js history
 *   node scripts/social-cli.js post --text "..." [--providers twitter,linkedin] [--mediaUrl "..."]
 *   node scripts/social-cli.js retry <postId> [deliveryId]
 */

const APP_URL = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function callApi(endpoint, options = {}) {
  const url = `${APP_URL.replace(/\/$/, "")}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.error(`❌ Connection error: Could not reach Social Hub at ${url}.`);
    console.error(`Ensure your Next.js application is running ('npm run dev').`);
    process.exit(1);
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const command = args[0];
  const flags = {};

  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].slice(2);
      const val = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : true;
      flags[key] = val;
    } else if (!flags._positionals) {
      flags._positionals = [args[i]];
    } else {
      flags._positionals.push(args[i]);
    }
  }

  return { command, flags };
}

async function main() {
  const { command, flags } = parseArgs();

  switch (command) {
    case "accounts": {
      const res = await callApi("/api/accounts");
      if (!res.ok) {
        console.error("Error fetching accounts:", res.data);
        return;
      }
      console.log("\n📱 Connected Accounts & Platform Constraints:");
      console.table(
        res.data.accounts.map((a) => ({
          ID: a.id,
          Provider: a.provider,
          Name: a.account_name,
          Active: a.is_active ? "✅ Yes" : "❌ No",
          Handle: a.metadata?.handle || "N/A",
        }))
      );
      break;
    }

    case "history": {
      const res = await callApi("/api/posts");
      if (!res.ok) {
        console.error("Error fetching posts:", res.data);
        return;
      }
      console.log("\n📜 Recent Posts History:");
      (res.data.posts || []).forEach((p, idx) => {
        console.log(`\n[${idx + 1}] Post ID: ${p.id} | Status: ${p.status} | Created: ${p.createdAt || p.created_at}`);
        console.log(`Content: ${p.content_text?.slice(0, 80)}...`);
        if (p.deliveries?.length) {
          console.log("  Deliveries:");
          p.deliveries.forEach((d) => {
            console.log(`   - [${d.provider.toUpperCase()}]: ${d.status} ${d.external_post_id ? `(ID: ${d.external_post_id})` : ""}`);
          });
        }
      });
      break;
    }

    case "post": {
      const text = flags.text;
      if (!text) {
        console.error("❌ Error: --text flag is required. Example: node scripts/social-cli.js post --text 'Hello world'");
        process.exit(1);
      }

      const accRes = await callApi("/api/accounts");
      if (!accRes.ok) {
        console.error("Error fetching accounts:", accRes.data);
        return;
      }

      let targetAccounts = (accRes.data.accounts || []).filter((a) => a.is_active);
      if (flags.providers) {
        const selected = flags.providers.split(",").map((s) => s.trim().toLowerCase());
        targetAccounts = targetAccounts.filter((a) => selected.includes(a.provider.toLowerCase()));
      }

      if (targetAccounts.length === 0) {
        console.error("❌ No matching active social accounts found.");
        process.exit(1);
      }

      const payload = {
        contentText: text,
        mediaUrl: flags.mediaUrl || null,
        targetAccounts: targetAccounts.map((a) => ({ id: a.id, provider: a.provider })),
      };

      const res = await callApi("/api/posts", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        console.log(`✅ Success! Post queued with ID: ${res.data.postId}`);
        console.log(`Targeted channels: ${targetAccounts.map((a) => a.provider).join(", ")}`);
      } else {
        console.error("❌ Post creation failed:", res.data);
      }
      break;
    }

    case "retry": {
      const postId = flags._positionals?.[0];
      const deliveryId = flags._positionals?.[1];

      if (!postId) {
        console.error("❌ Error: postId is required. Usage: node scripts/social-cli.js retry <postId> [deliveryId]");
        process.exit(1);
      }

      const res = await callApi(`/api/posts/${postId}/retry`, {
        method: "POST",
        body: JSON.stringify({ deliveryId }),
      });

      if (res.ok) {
        console.log("✅ Retry triggered successfully:", res.data);
      } else {
        console.error("❌ Retry failed:", res.data);
      }
      break;
    }

    default:
      console.log(`
Social Hub CLI
--------------
Usage:
  node scripts/social-cli.js accounts
  node scripts/social-cli.js history
  node scripts/social-cli.js post --text "Your content" [--providers twitter,linkedin] [--mediaUrl "https://..."]
  node scripts/social-cli.js retry <postId> [deliveryId]
      `);
      break;
  }
}

main();
