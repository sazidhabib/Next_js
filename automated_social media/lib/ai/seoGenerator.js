import fs from "fs";
import path from "path";

function cleanTopicFromFilename(filename = "") {
  const base = filename.replace(/\.[^.]+$/, "");
  return base
    .replace(/^\d{4}-\d{2}-\d{2}[_-]?/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildDeterministicSeo({ filename, sidecarData, contentMode }) {
  const rawTopic = sidecarData?.topic || sidecarData?.title || cleanTopicFromFilename(filename) || "Daily Insights & Updates";
  const baseBody = sidecarData?.text?.trim() || "";

  const cleanTitle = sidecarData?.title || rawTopic.replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 95);
  const defaultTags = ["#Automation", "#Productivity", "#DigitalGrowth", "#TechTips", "#ContentCreator"];
  const hashtags = sidecarData?.hashtags?.length
    ? sidecarData.hashtags.map((t) => (t.startsWith("#") ? t : `#${t}`))
    : defaultTags;

  const hashtagLine = hashtags.join(" ");

  const description = baseBody
    ? `${cleanTitle}\n\n${baseBody}\n\n${hashtagLine}`
    : `${cleanTitle}\n\nDiscover practical insights and actionable takeaways around ${rawTopic}. Save this post and share your thoughts below!\n\n${hashtagLine}`;

  return {
    title: cleanTitle,
    description,
    hashtags,
    platformCustomizations: {
      linkedin: {
        isCustomized: true,
        text: `${cleanTitle}\n\n${baseBody || `Key perspective on ${rawTopic} — built for consistency and measurable results.`}\n\nWhat's your take on this?\n\n${hashtags.slice(0, 4).join(" ")}`,
      },
      facebook: {
        isCustomized: true,
        text: `${cleanTitle}\n\n${baseBody || `Sharing today's ${contentMode === "reel" ? "reel" : "update"} on ${rawTopic}! Let us know what you think in the comments.`}\n\n${hashtags.slice(0, 6).join(" ")}`,
      },
      youtube: {
        isCustomized: true,
        text: `${baseBody || `Watch this quick breakdown on ${rawTopic}.`}\n\n${hashtagLine}`,
      },
      instagram: {
        isCustomized: true,
        text: `${cleanTitle}\n\n${baseBody || `Daily highlight: ${rawTopic}`}\n\n.\n${hashtags.join(" ")}`,
      },
    },
  };
}

/**
 * Generates SEO-friendly Title, Description, Hashtags, and platform-specific copy
 * for automated Google Drive posts.
 */
export async function generateSeoPostCopy({ filename, sidecarData, contentMode = "image" }) {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || "";
  const baseUrl =
    process.env.LLM_BASE_URL ||
    (process.env.OPENROUTER_API_KEY ? "https://openrouter.ai/api/v1" : "https://api.openai.com/v1");

  const rawModels =
    process.env.LLM_MODELS ||
    process.env.LLM_MODEL ||
    (process.env.OPENROUTER_API_KEY
      ? "meta-llama/llama-3.3-70b-instruct:free,qwen/qwen-2.5-72b-instruct:free,openrouter/free"
      : "gpt-4o-mini");
  const modelList = rawModels.split(",").map((m) => m.trim()).filter(Boolean);

  if (!apiKey && !process.env.LLM_BASE_URL) {
    return buildDeterministicSeo({ filename, sidecarData, contentMode });
  }

  let userMd = "";
  try {
    const userMdPath = path.join(process.cwd(), "USER.md");
    if (fs.existsSync(userMdPath)) userMd = fs.readFileSync(userMdPath, "utf-8");
  } catch {
    // optional file
  }

  const topicHint = cleanTopicFromFilename(filename);
  const prompt = `
You are an SEO Social Media Strategist.
Create an SEO-friendly Title, engaging Description, and targeted Hashtags for an automated daily ${contentMode} post.

Source Filename: "${filename}"
Topic Hint: "${topicHint}"
${sidecarData?.title ? `Provided Title: "${sidecarData.title}"` : ""}
${sidecarData?.text ? `Provided Notes/Caption:\n"""\n${sidecarData.text}\n"""` : ""}
${userMd ? `Brand Guidelines:\n${userMd.slice(0, 1200)}` : ""}

REQUIREMENTS:
1. "title": SEO-optimized, catchy, <= 95 characters (also suitable as a YouTube Shorts title).
2. "description": Universal SEO description with hook, clear value, and call-to-action.
3. "hashtags": Array of 5-8 relevant hashtags starting with "#".
4. "platformCustomizations":
   - "linkedin": Professional tone, short paragraphs, 3-4 hashtags.
   - "facebook": Conversational, engaging, 4-6 hashtags.
   - "youtube": Video/Shorts description with keywords + hashtags.
   - "instagram": Punchy caption + hashtags.
5. Return ONLY valid JSON with no markdown code fences:
{
  "title": "...",
  "description": "...",
  "hashtags": ["#Tag1", "#Tag2"],
  "platformCustomizations": {
    "linkedin": { "text": "..." },
    "facebook": { "text": "..." },
    "youtube": { "text": "..." },
    "instagram": { "text": "..." }
  }
}
`;

  for (const candidateModel of modelList) {
    try {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "OmniPost Automated SEO",
        },
        body: JSON.stringify({
          model: candidateModel,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.6,
        }),
      });

      if (!res.ok) continue;

      const json = await res.json();
      const rawContent = json.choices?.[0]?.message?.content?.trim() || "";
      const cleaned = rawContent
        .replace(/^```json/i, "")
        .replace(/^```/i, "")
        .replace(/```$/i, "")
        .trim();

      const parsed = JSON.parse(cleaned);
      const hashtags = Array.isArray(parsed.hashtags)
        ? parsed.hashtags.map((t) => (t.startsWith("#") ? t : `#${t}`))
        : [];

      const custom = {};
      for (const provider of ["linkedin", "facebook", "youtube", "instagram"]) {
        if (parsed.platformCustomizations?.[provider]?.text) {
          custom[provider] = {
            isCustomized: true,
            text: parsed.platformCustomizations[provider].text,
          };
        }
      }

      return {
        title: parsed.title || topicHint || "Daily Update",
        description: parsed.description || sidecarData?.text || topicHint,
        hashtags,
        platformCustomizations: custom,
      };
    } catch (err) {
      console.warn(`SEO generator fallback for model ${candidateModel}:`, err.message);
    }
  }

  return buildDeterministicSeo({ filename, sidecarData, contentMode });
}
