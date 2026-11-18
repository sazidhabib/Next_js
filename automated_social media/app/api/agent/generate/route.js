import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { initDB, SocialAccount } from "@/lib/db";
import { getSupportedProviders } from "@/lib/social/registry";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const userTopic = body?.topic?.trim() || "";

    // 1. Fetch available platforms
    let activeProviders = ["twitter", "linkedin", "facebook", "instagram", "youtube"];
    try {
      const dbStatus = await initDB();
      if (dbStatus.isConnected) {
        const accounts = await SocialAccount.findAll({ where: { is_active: true } });
        if (accounts.length > 0) {
          activeProviders = [...new Set(accounts.map((a) => a.provider))];
        }
      }
    } catch (e) {
      console.warn("Could not load accounts from DB, using defaults:", e.message);
    }

    // 2. Read Persona & Memory Guidelines
    let userMd = "";
    let memoryMd = "";
    try {
      const cwd = process.cwd();
      const userMdPath = path.join(cwd, "USER.md");
      const memoryMdPath = path.join(cwd, "MEMORY.md");
      if (fs.existsSync(userMdPath)) userMd = fs.readFileSync(userMdPath, "utf-8");
      if (fs.existsSync(memoryMdPath)) memoryMd = fs.readFileSync(memoryMdPath, "utf-8");
    } catch (err) {
      console.warn("Could not read USER.md or MEMORY.md:", err.message);
    }

    // 3. Configure LLM API parameters
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || "";
    const baseUrl = process.env.LLM_BASE_URL || (process.env.OPENROUTER_API_KEY ? "https://openrouter.ai/api/v1" : "https://api.openai.com/v1");

    const rawModels = process.env.LLM_MODELS || process.env.LLM_MODEL || (process.env.OPENROUTER_API_KEY ? "meta-llama/llama-3.3-70b-instruct:free,qwen/qwen-2.5-72b-instruct:free,openrouter/free" : "gpt-4o-mini");
    const modelList = rawModels.split(",").map((m) => m.trim()).filter(Boolean);

    let generatedData = null;

    if (!apiKey && !process.env.LLM_BASE_URL) {
      // High-signal fallback when no API key is configured
      const defaultTopic = userTopic || "Autonomous Multi-Agent Queues in Modern Web Architecture";
      const imagePrompt = `Sleek 3D isometric render of autonomous AI agents communicating across glowing cloud queues, dark theme with vibrant purple and cyan neon lights, 8k octane render, cinematic lighting`;
      const mediaUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1200&height=675&nologo=true&model=flux`;

      generatedData = {
        topic: defaultTopic,
        imagePrompt,
        mediaUrl,
        contentText: `Moving from synchronous request-response to autonomous agent-driven queues allows modern web apps to decouple long-running AI tasks from UI responsiveness.\n\nKey advantages:\n- Isolated error boundaries per provider\n- Automatic token refresh before dispatch\n- Guaranteed delivery retries without blocking users`,
        platformCustomizations: {
          twitter: {
            text: `🚀 AI agents shouldn't block your UI. Decouple execution with async queues, background retries, and token auto-refresh. The future of SaaS is autonomous. 🧵👇 #buildinpublic #WebDev`,
          },
          linkedin: {
            text: `The transition from prompt-response wrappers to persistent agentic loops is reshaping developer tooling.\n\nWhen building multi-channel social automation, standard API timeouts were our biggest bottleneck. Switching to an event-driven queue with isolated error boundaries reduced delivery failures to zero.\n\nKey takeaways:\n1. Isolate channel failures so one down provider doesn't block others.\n2. Automate token refresh transparently before dispatch.\n3. Log trajectories for model alignment.\n\nHow is your team handling background agent execution?`,
          },
          facebook: {
            text: `Modern software is shifting from simple CRUD apps to autonomous agent systems. Here is a look behind the scenes at how our background queues handle multi-channel publishing with automated retries!`,
          },
          instagram: {
            text: `Behind the scenes of our autonomous social automation engine. 🚀\n\nDecoupled queues, background token management, and instant multi-platform broadcasting.\n\n#SoftwareEngineering #AIAgents #WebDev #BuildInPublic #Nextjs`,
          },
          youtube: {
            text: `In this update, we break down how to architect robust multi-agent background queues with automated error handling and token refresh in Next.js.`,
          },
        },
      };
    } else {
      const prompt = `
You are the Hermes Social Media AI Agent for TechPulse.
Generate a high-impact, multi-channel social media release and a matching AI image prompt.

Active platforms: ${JSON.stringify(activeProviders)}
${userTopic ? `Requested Topic: "${userTopic}"` : "Choose a trending, high-signal topic in AI engineering, developer productivity, open-source models, or cloud architecture."}

Brand Guidelines from USER.md:
${userMd}

Memory Guidelines & Rules from MEMORY.md:
${memoryMd}

STRICT INSTRUCTIONS:
1. Twitter copy MUST be <= 280 characters. Include a strong hook and 1-2 hashtags.
2. LinkedIn copy must have short 1-2 sentence paragraphs with blank lines between, 3-4 bulleted takeaways, and end with an open question.
3. Formulate an 'imagePrompt': a concise, vivid English prompt (15-25 words) for a Flux AI image generator creating a clean, modern 3D tech/architectural visual (e.g. isometric server racks, glowing neural connections, dark background, cinematic purple/blue lights).
4. Return ONLY valid JSON with no markdown formatting, no code fences:
{
  "topic": "<short summary of topic>",
  "imagePrompt": "<vivid visual prompt for Flux image generator>",
  "contentText": "<universal summary post>",
  "platformCustomizations": {
    "twitter": { "text": "<max 280 chars tweet>" },
    "linkedin": { "text": "<linkedin formatted post>" },
    "facebook": { "text": "<facebook caption>" },
    "instagram": { "text": "<instagram caption with hashtags>" },
    "youtube": { "text": "<youtube post/teaser>" }
  }
}
`;

      let lastError = null;
      for (const candidateModel of modelList) {
        try {
          const res = await fetch(`${baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
              "HTTP-Referer": "http://localhost:3000",
              "X-Title": "Social Hub Agent",
            },
            body: JSON.stringify({
              model: candidateModel,
              messages: [{ role: "user", content: prompt }],
              temperature: 0.7,
            }),
          });

          if (!res.ok) {
            const errText = await res.text();
            throw new Error(`HTTP ${res.status}: ${errText}`);
          }

          const json = await res.json();
          const rawContent = json.choices[0].message.content.trim();
          const cleaned = rawContent.replace(/^```json/i, "").replace(/^```/i, "").replace(/```$/, "").trim();
          generatedData = JSON.parse(cleaned);
          break;
        } catch (err) {
          lastError = err;
          console.warn(`Model ${candidateModel} failed in /api/agent/generate:`, err.message);
        }
      }

      if (!generatedData) {
        throw new Error(`Failed to generate post using configured models: ${lastError?.message}`);
      }

      // Build Pollinations Flux image URL from imagePrompt
      const promptEncoded = encodeURIComponent(generatedData.imagePrompt || generatedData.topic);
      generatedData.mediaUrl = `https://image.pollinations.ai/prompt/${promptEncoded}?width=1200&height=675&nologo=true&model=flux`;
    }

    return NextResponse.json({
      success: true,
      topic: generatedData.topic,
      imagePrompt: generatedData.imagePrompt,
      mediaUrl: generatedData.mediaUrl,
      contentText: generatedData.contentText,
      platformCustomizations: generatedData.platformCustomizations,
    });
  } catch (err) {
    console.error("API /api/agent/generate error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate AI post." },
      { status: 500 }
    );
  }
}
