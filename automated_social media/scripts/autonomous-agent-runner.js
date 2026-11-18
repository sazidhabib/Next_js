#!/usr/bin/env node
/**
 * Autonomous Social Agent Runner
 * Executes the Hermes Social Content Creator workflow.
 * 
 * Can run via:
 * - OpenRouter (default for Nous Hermes models: e.g. 'nousresearch/hermes-3-llama-3.1-70b')
 * - OpenAI / Groq / DeepSeek
 * - Local Ollama (e.g. 'http://localhost:11434/v1')
 * 
 * Usage:
 *   node scripts/autonomous-agent-runner.js [--topic "AI agents in 2026"] [--dry-run]
 */

const fs = require("fs");
const path = require("path");

// Automatically load .env if present
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"](.*)['"]$/, "$1");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}
loadEnv();

const APP_URL = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const LLM_API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY || "";
const LLM_BASE_URL = process.env.LLM_BASE_URL || (process.env.OPENROUTER_API_KEY ? "https://openrouter.ai/api/v1" : "https://api.openai.com/v1");

// Support comma-separated model list for automatic fallback
const rawModels = process.env.LLM_MODELS || process.env.LLM_MODEL || (process.env.OPENROUTER_API_KEY ? "meta-llama/llama-3.3-70b-instruct:free,qwen/qwen-2.5-72b-instruct:free,openrouter/free" : "gpt-4o-mini");
const MODEL_LIST = rawModels.split(",").map((m) => m.trim()).filter(Boolean);
const LLM_MODEL = MODEL_LIST[0] || "meta-llama/llama-3.3-70b-instruct:free";

function parseFlags() {
  const args = process.argv.slice(2);
  const flags = { dryRun: false, topic: null };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--dry-run") flags.dryRun = true;
    if (args[i] === "--topic" && args[i + 1]) flags.topic = args[++i];
  }
  return flags;
}

async function callLocalHub(endpoint, options = {}) {
  const res = await fetch(`${APP_URL.replace(/\/$/, "")}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(`Social Hub Error: ${errorData.error || res.statusText}`);
  }
  return res.json();
}

async function main() {
  const flags = parseFlags();
  console.log("🤖 Initializing Hermes Autonomous Social Creator...");

  // 1. Load Persona, Memory, and Skill
  const userMd = fs.existsSync("USER.md") ? fs.readFileSync("USER.md", "utf-8") : "";
  const memoryMd = fs.existsSync("MEMORY.md") ? fs.readFileSync("MEMORY.md", "utf-8") : "";
  const skillMd = fs.existsSync("skills/social-content-creator/SKILL.md")
    ? fs.readFileSync("skills/social-content-creator/SKILL.md", "utf-8")
    : "";

  // 2. Fetch Active Social Accounts
  console.log("📡 Fetching active social accounts from Social Hub...");
  let accountsData;
  try {
    accountsData = await callLocalHub("/api/accounts");
  } catch (err) {
    console.error(`❌ Could not connect to Social Hub at ${APP_URL}. Please ensure 'npm run dev' is running.`);
    process.exit(1);
  }

  const activeAccounts = (accountsData.accounts || []).filter((a) => a.is_active);
  if (activeAccounts.length === 0) {
    console.error("❌ No active accounts found. Connect accounts in the dashboard or enable mock accounts.");
    process.exit(1);
  }

  const activeProviders = [...new Set(activeAccounts.map((a) => a.provider))];
  console.log(`✅ Active channels: ${activeProviders.join(", ")}`);

  // 3. Formulate Prompt
  const prompt = `
You are the Hermes Social Media AI Agent for TechPulse.
Your task is to research, formulate, and craft a high-impact multi-channel social media release for today.

Available channels: ${JSON.stringify(activeProviders)}
${flags.topic ? `Specific topic requested: "${flags.topic}"` : "Choose a trending, high-signal topic in AI engineering, developer productivity, or modern cloud architecture."}

Relevant guidelines from USER.md:
${userMd}

Historical Context & Rules from MEMORY.md:
${memoryMd}

Skill Instructions from SKILL.md:
${skillMd}

CRITICAL RULES:
1. Twitter/X content MUST be <= 280 characters. Include 1-2 hashtags and a strong hook.
2. LinkedIn content must be structured with 1-2 sentence paragraphs and end with an open question.
3. Supply an 'imagePrompt': a concise, vivid visual prompt (15-25 words) for Flux AI image generation (e.g. isometric 3D render of AI queues, cyberpunk neon lighting, dark sleek theme).
4. Output ONLY valid JSON matching this exact structure with no markdown backticks, no markdown code fence, and no extra prose:
{
  "topic": "<short summary of the topic>",
  "imagePrompt": "<vivid 3D visual prompt for Flux image generator>",
  "contentText": "<universal summary post>",
  "platformCustomizations": {
    "twitter": { "text": "<max 280 chars tweet>" },
    "linkedin": { "text": "<linkedin formatted post>" },
    "facebook": { "text": "<facebook caption>" },
    "instagram": { "text": "<instagram caption with hashtags>" }
  }
}
`;

  // 4. Generate Content via LLM
  console.log(`🧠 Calling LLM (${LLM_MODEL}) to research and draft content...`);
  let generatedData;

  if (!LLM_API_KEY && !process.env.LLM_BASE_URL) {
    console.warn("⚠️ No OPENROUTER_API_KEY or OPENAI_API_KEY detected.");
    console.log("Generating a simulated high-signal post for testing...");
    generatedData = {
      topic: "Autonomous Multi-Agent Queues in Modern Web Architecture",
      contentText: "Moving from synchronous request-response to autonomous agent-driven queues allows applications to decouple human review from background automation.",
      mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
      platformCustomizations: {
        twitter: {
          text: "🚀 AI agents shouldn't block your UI. Decouple execution with async queues, background retries, and token auto-refresh. The future of SaaS is autonomous. 🧵👇 #buildinpublic #WebDev",
        },
        linkedin: {
          text: "The transition from prompt-response wrappers to persistent agentic loops is reshaping developer tooling.\n\nWhen we built our social automation pipeline, standard API timeouts were the biggest bottleneck. Switching to an event-driven queue with isolated error boundaries reduced delivery failures to zero.\n\nKey takeaways:\n1. Isolate channel failures so one down provider doesn't block others.\n2. Automate token refresh transparently before dispatch.\n3. Log trajectories for model alignment.\n\nHow is your team handling background agent execution?",
        },
      },
    };
  } else {
    let lastError = null;
    let successfulModel = null;

    for (let i = 0; i < MODEL_LIST.length; i++) {
      const candidateModel = MODEL_LIST[i];
      console.log(`🧠 Attempting generation with: ${candidateModel} (Attempt ${i + 1}/${MODEL_LIST.length})...`);

      try {
        const response = await fetch(`${LLM_BASE_URL}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LLM_API_KEY}`,
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Social Hub Agent",
          },
          body: JSON.stringify({
            model: candidateModel,
            models: MODEL_LIST, // OpenRouter native fallback support
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const json = await response.json();
        const rawContent = json.choices[0].message.content.trim();
        const cleaned = rawContent.replace(/^```json/i, "").replace(/^```/i, "").replace(/```$/, "").trim();
        generatedData = JSON.parse(cleaned);
        successfulModel = candidateModel;
        console.log(`✅ Generation succeeded with: ${successfulModel}`);
        break;
      } catch (err) {
        lastError = err;
        console.warn(`⚠️ Model "${candidateModel}" hit limit or error: ${err.message}`);
        if (i < MODEL_LIST.length - 1) {
          console.log(`🔄 Automatically falling back to: ${MODEL_LIST[i + 1]}...`);
        }
      }
    }

    if (!generatedData) {
      throw new Error(`All configured models failed. Last error: ${lastError?.message}`);
    }

    if (!generatedData.mediaUrl && generatedData.imagePrompt) {
      const promptEncoded = encodeURIComponent(generatedData.imagePrompt);
      generatedData.mediaUrl = `https://image.pollinations.ai/prompt/${promptEncoded}?width=1200&height=675&nologo=true&model=flux`;
    }
  }

  console.log("\n--- Generated Draft ---");
  console.log(`📌 Topic: ${generatedData.topic}`);
  console.log(`🔗 Media: ${generatedData.mediaUrl}`);
  console.log("\n[Twitter / X] (Length: " + (generatedData.platformCustomizations?.twitter?.text?.length || 0) + " chars):");
  console.log(generatedData.platformCustomizations?.twitter?.text);
  console.log("\n[LinkedIn]:");
  console.log(generatedData.platformCustomizations?.linkedin?.text);

  if (flags.dryRun) {
    console.log("\n🔍 Dry run enabled. Post not dispatched to Social Hub.");
    return;
  }

  // 5. Submit to Social Hub
  console.log("\n🚀 Dispatching post to Social Hub /api/posts...");
  const payload = {
    contentText: generatedData.contentText,
    mediaUrl: generatedData.mediaUrl,
    targetAccounts: activeAccounts.map((a) => ({ id: a.id, provider: a.provider })),
    platformCustomizations: generatedData.platformCustomizations,
  };

  const dispatchResult = await callLocalHub("/api/posts", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  console.log(`✅ Success! Post ID: ${dispatchResult.postId}`);
  console.log(`📢 ${dispatchResult.message}`);

  // 6. Update MEMORY.md ledger
  const today = new Date().toISOString().split("T")[0];
  const newRow = `| ${today} | ${dispatchResult.postId} | ${generatedData.topic.slice(0, 40)} | ${activeProviders.join(", ")} | Completed |\n`;

  if (fs.existsSync("MEMORY.md")) {
    let memoryContent = fs.readFileSync("MEMORY.md", "utf-8");
    if (memoryContent.includes("| Date (UTC) | Post ID |")) {
      memoryContent = memoryContent.replace(
        /(\| Date \(UTC\) \| Post ID \|[^\n]*\n\|[^\n]*\n)/,
        `$1${newRow}`
      );
      fs.writeFileSync("MEMORY.md", memoryContent, "utf-8");
      console.log("📝 Updated MEMORY.md post ledger.");
    }
  }
}

main().catch((err) => {
  console.error("❌ Execution error:", err.message);
  process.exit(1);
});
