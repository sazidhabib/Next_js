import { youtube, fbdown, ttdl, igdl, twitter, douyin, pinterest, kuaishou } from "btch-downloader";

const PLATFORM_PATTERNS = {
  youtube: /(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)/i,
  facebook: /(facebook\.com\/(watch|reel|videos|posts)|fb\.watch)/i,
  instagram: /(instagram\.com\/(reel|p\/|stories|tv))/i,
  tiktok: /(tiktok\.com\/|vm\.tiktok\.com|vt\.tiktok\.com)/i,
  twitter: /(twitter\.com\/\w+\/status|x\.com\/\w+\/status)/i,
  douyin: /(douyin\.com\/|v\.douyin\.com)/i,
  pinterest: /(pinterest\.com\/pin\/|pin\.it)/i,
  kuaishou: /(kuaishou\.com\/|v\.kuaishou\.com)/i,
  linkedin: /(linkedin\.com\/(posts|feed\/update|video\/event|in|school|company)\/)/i,
  quora: /(quora\.com\/)/i,
  discord: /(discordapp\.com\/attachments|cdn\.discordapp\.com\/attachments|media\.discordapp\.net\/attachments)/i,
  tencent: /(v\.qq\.com\/x\/cover\/|v\.qq\.com\/x\/page\/|film\.qq\.com\/cover\/)/i,
};

function detectPlatform(url) {
  for (const [platform, pattern] of Object.entries(PLATFORM_PATTERNS)) {
    if (pattern.test(url)) return platform;
  }
  return null;
}

function normalizeYouTubeData(data) {
  const downloads = [];
  if (data?.length > 0) {
    const video = data[0];
    if (video?.video) {
      video.video.forEach((v) => {
        downloads.push({
          quality: v.quality || "HD",
          url: v.url,
          format: "mp4",
          type: "video",
        });
      });
    }
    if (video?.audio) {
      video.audio.forEach((a) => {
        downloads.push({
          quality: a.quality || "128kbps",
          url: a.url,
          format: "mp3",
          type: "audio",
        });
      });
    }
  }
  return downloads;
}

function normalizeFacebookData(data) {
  const downloads = [];
  if (data?.Normal_video) {
    downloads.push({
      quality: "SD",
      url: data.Normal_video,
      format: "mp4",
      type: "video",
    });
  }
  if (data?.HD) {
    downloads.push({
      quality: "HD",
      url: data.HD,
      format: "mp4",
      type: "video",
    });
  }
  return downloads;
}

function normalizeTikTokData(data) {
  const downloads = [];
  if (data?.video) {
    data.video.forEach((v, i) => {
      downloads.push({
        quality: i === 0 ? "HD" : "SD",
        url: typeof v === "string" ? v : v.url,
        format: "mp4",
        type: "video",
      });
    });
  }
  if (data?.audio) {
    const audioUrl = typeof data.audio === "string" ? data.audio : data.audio?.url;
    if (audioUrl) {
      downloads.push({
        quality: "Audio",
        url: audioUrl,
        format: "mp3",
        type: "audio",
      });
    }
  }
  return downloads;
}

function normalizeInstagramData(data) {
  const downloads = [];
  const items = Array.isArray(data) ? data : data?.url ? [data] : [];
  items.forEach((item) => {
    const videoUrl = typeof item === "string" ? item : item?.url;
    if (videoUrl) {
      downloads.push({
        quality: "HD",
        url: videoUrl,
        format: "mp4",
        type: "video",
      });
    }
  });
  return downloads;
}

function normalizeTwitterData(data) {
  const downloads = [];
  if (data?.url) {
    const urls = Array.isArray(data.url) ? data.url : [data.url];
    urls.forEach((u) => {
      downloads.push({
        quality: "HD",
        url: typeof u === "string" ? u : u.url,
        format: "mp4",
        type: "video",
      });
    });
  }
  return downloads;
}

function normalizeDouyinData(data) {
  const downloads = [];
  const res = data?.result;
  if (!res) return downloads;

  const links = res.links || [];
  links.forEach((link) => {
    downloads.push({
      quality: link.quality || "HD Video",
      url: link.url,
      format: "mp4",
      type: "video",
    });
  });

  if (downloads.length === 0) {
    if (res.video) {
      const urls = Array.isArray(res.video) ? res.video : [res.video];
      urls.forEach((v, i) => {
        downloads.push({
          quality: i === 0 ? "HD" : "SD",
          url: typeof v === "string" ? v : v.url,
          format: "mp4",
          type: "video",
        });
      });
    }
  }
  return downloads;
}

function normalizePinterestData(data) {
  const downloads = [];
  const res = data?.result;
  if (!res) return downloads;

  if (res.video_url) {
    downloads.push({
      quality: "HD Video",
      url: res.video_url,
      format: "mp4",
      type: "video",
    });
  }

  if (res.videos) {
    for (const [key, val] of Object.entries(res.videos)) {
      if (val?.url) {
        downloads.push({
          quality: key || "HD Video",
          url: val.url,
          format: "mp4",
          type: "video",
        });
      }
    }
  }

  if (downloads.length === 0) {
    if (res.image) {
      downloads.push({
        quality: "Image",
        url: res.image,
        format: "jpg",
        type: "image",
      });
    } else if (res.images) {
      for (const [key, val] of Object.entries(res.images)) {
        if (val?.url) {
          downloads.push({
            quality: key || "Image",
            url: val.url,
            format: "jpg",
            type: "image",
          });
        }
      }
    }
  }
  return downloads;
}

function normalizeKuaishouData(data) {
  const downloads = [];
  const res = data?.result;
  if (res?.videoUrl) {
    downloads.push({
      quality: "HD Video",
      url: res.videoUrl,
      format: "mp4",
      type: "video",
    });
  }
  return downloads;
}

async function extractLinkedInVideo(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    const html = await response.text();
    const videoUrlMatch = html.match(/(https:\/\/video\.licdn\.com\/dms\/[^\s"'>]+)/);
    if (videoUrlMatch) {
      const decodedUrl = videoUrlMatch[1].replace(/&amp;/g, "&");
      return {
        title: "LinkedIn Video",
        thumbnail: null,
        downloads: [{
          quality: "HD",
          url: decodedUrl,
          format: "mp4",
          type: "video",
        }],
      };
    }
    const metaMatch = html.match(/<meta\s+property="og:video"\s+content="([^"]+)"/i) ||
                      html.match(/<meta\s+name="twitter:player:stream"\s+content="([^"]+)"/i);
    if (metaMatch) {
      return {
        title: "LinkedIn Video",
        thumbnail: null,
        downloads: [{
          quality: "HD",
          url: metaMatch[1].replace(/&amp;/g, "&"),
          format: "mp4",
          type: "video",
        }],
      };
    }
  } catch (error) {
    console.error("LinkedIn extraction error:", error);
  }
  return null;
}

async function extractQuoraVideo(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    const html = await response.text();
    const videoUrlMatch = html.match(/(https:\/\/video\.quora\.com\/[^\s"'>]+)/i) ||
                          html.match(/"videoUrl"\s*:\s*"([^"]+)"/i);
    if (videoUrlMatch) {
      const decodedUrl = videoUrlMatch[1].replace(/\\u002F/g, "/").replace(/&amp;/g, "&");
      return {
        title: "Quora Video",
        thumbnail: null,
        downloads: [{
          quality: "HD",
          url: decodedUrl,
          format: "mp4",
          type: "video",
        }],
      };
    }
  } catch (error) {
    console.error("Quora extraction error:", error);
  }
  return null;
}

async function extractTencentVideo(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
      },
    });
    const html = await response.text();
    const streamMatch = html.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/i);
    if (streamMatch) {
      return {
        title: "Tencent QQ Video",
        thumbnail: null,
        downloads: [{
          quality: "Standard",
          url: streamMatch[0],
          format: "mp4",
          type: "video",
        }],
      };
    }
  } catch (error) {
    console.error("Tencent extraction error:", error);
  }
  return {
    title: "Tencent Video",
    thumbnail: null,
    downloads: [{
      quality: "Direct Web Link",
      url: url,
      format: "mp4",
      type: "video",
    }],
  };
}

const EXTRACTORS = {
  youtube: async (url) => {
    const data = await youtube(url);
    return {
      title: data?.[0]?.title || "YouTube Video",
      thumbnail: data?.[0]?.thumbnail || null,
      downloads: normalizeYouTubeData(data),
    };
  },
  facebook: async (url) => {
    const data = await fbdown(url);
    return {
      title: "Facebook Video",
      thumbnail: null,
      downloads: normalizeFacebookData(data),
    };
  },
  tiktok: async (url) => {
    const data = await ttdl(url);
    return {
      title: data?.title || "TikTok Video",
      thumbnail: data?.thumbnail || null,
      downloads: normalizeTikTokData(data),
    };
  },
  instagram: async (url) => {
    const data = await igdl(url);
    return {
      title: "Instagram Video",
      thumbnail: null,
      downloads: normalizeInstagramData(data),
    };
  },
  twitter: async (url) => {
    const data = await twitter(url);
    return {
      title: data?.title || "Twitter/X Video",
      thumbnail: data?.thumbnail || null,
      downloads: normalizeTwitterData(data),
    };
  },
  douyin: async (url) => {
    const data = await douyin(url);
    return {
      title: data?.result?.title || "Douyin Video",
      thumbnail: data?.result?.thumbnail || null,
      downloads: normalizeDouyinData(data),
    };
  },
  pinterest: async (url) => {
    const data = await pinterest(url);
    return {
      title: data?.result?.title || "Pinterest Media",
      thumbnail: data?.result?.image || null,
      downloads: normalizePinterestData(data),
    };
  },
  kuaishou: async (url) => {
    const data = await kuaishou(url);
    return {
      title: data?.result?.title || "Kuaishou Video",
      thumbnail: null,
      downloads: normalizeKuaishouData(data),
    };
  },
  linkedin: async (url) => {
    const data = await extractLinkedInVideo(url);
    if (!data) throw new Error("Could not extract LinkedIn video");
    return data;
  },
  quora: async (url) => {
    const data = await extractQuoraVideo(url);
    if (!data) throw new Error("Could not extract Quora video");
    return data;
  },
  discord: async (url) => {
    const parts = url.split("/");
    const filename = parts[parts.length - 1].split("?")[0] || "Discord Video";
    const extension = url.match(/\.([^./?]+)($|\?)/)?.[1] || "mp4";
    return {
      title: filename,
      thumbnail: null,
      downloads: [{
        quality: "Direct Download",
        url: url,
        format: extension,
        type: "video",
      }],
    };
  },
  tencent: async (url) => {
    return await extractTencentVideo(url);
  },
};

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    const trimmedUrl = url.trim();
    const platform = detectPlatform(trimmedUrl);

    if (!platform) {
      return Response.json(
        { error: "Unsupported platform or invalid URL" },
        { status: 400 }
      );
    }

    const extractor = EXTRACTORS[platform];
    if (!extractor) {
      return Response.json(
        { error: `Download for ${platform} is not yet supported` },
        { status: 400 }
      );
    }

    const result = await extractor(trimmedUrl);

    if (!result.downloads || result.downloads.length === 0) {
      return Response.json(
        { error: "Could not extract download links. The URL may be invalid or the content may be private." },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      platform,
      title: result.title,
      thumbnail: result.thumbnail,
      downloads: result.downloads,
    });
  } catch (error) {
    console.error("Download error:", error);
    return Response.json(
      { error: "Failed to process the URL. Please try again." },
      { status: 500 }
    );
  }
}

