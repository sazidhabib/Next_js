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
  if (!data) return downloads;

  // Direct properties on response object (btch-downloader youtube format)
  if (data.mp4) {
    downloads.push({
      quality: "HD Video (MP4)",
      url: data.mp4,
      format: "mp4",
      type: "video",
    });
  }
  if (data.mp3) {
    downloads.push({
      quality: "Audio (MP3)",
      url: data.mp3,
      format: "mp3",
      type: "audio",
    });
  }

  // Handle case if data.video or data.audio is array or string
  if (Array.isArray(data.video)) {
    data.video.forEach((v, i) => {
      downloads.push({
        quality: v.quality || (i === 0 ? "HD Video (MP4)" : "SD Video (MP4)"),
        url: typeof v === "string" ? v : v.url,
        format: "mp4",
        type: "video",
      });
    });
  } else if (typeof data.video === "string") {
    downloads.push({
      quality: "HD Video (MP4)",
      url: data.video,
      format: "mp4",
      type: "video",
    });
  }

  if (Array.isArray(data.audio)) {
    data.audio.forEach((a) => {
      downloads.push({
        quality: a.quality || "Audio (MP3)",
        url: typeof a === "string" ? a : a.url,
        format: "mp3",
        type: "audio",
      });
    });
  } else if (typeof data.audio === "string") {
    downloads.push({
      quality: "Audio (MP3)",
      url: data.audio,
      format: "mp3",
      type: "audio",
    });
  }

  // Handle case if data is array: [ { video, audio, mp4, mp3, ... } ]
  if (Array.isArray(data) && data.length > 0) {
    const video = data[0];
    if (video?.video && Array.isArray(video.video)) {
      video.video.forEach((v, i) => {
        downloads.push({
          quality: v.quality || (i === 0 ? "HD Video (MP4)" : "SD Video (MP4)"),
          url: typeof v === "string" ? v : v.url,
          format: "mp4",
          type: "video",
        });
      });
    }
    if (video?.audio && Array.isArray(video.audio)) {
      video.audio.forEach((a) => {
        downloads.push({
          quality: a.quality || "Audio (MP3)",
          url: typeof a === "string" ? a : a.url,
          format: "mp3",
          type: "audio",
        });
      });
    }
    if (video?.mp4) {
      downloads.push({
        quality: "HD Video (MP4)",
        url: video.mp4,
        format: "mp4",
        type: "video",
      });
    }
    if (video?.mp3) {
      downloads.push({
        quality: "Audio (MP3)",
        url: video.mp3,
        format: "mp3",
        type: "audio",
      });
    }
  }

  // Handle case if data.result exists
  if (data.result) {
    const res = data.result;
    if (res.mp4) {
      downloads.push({
        quality: "HD Video (MP4)",
        url: res.mp4,
        format: "mp4",
        type: "video",
      });
    }
    if (res.mp3) {
      downloads.push({
        quality: "Audio (MP3)",
        url: res.mp3,
        format: "mp3",
        type: "audio",
      });
    }
  }

  return downloads;
}

function normalizeFacebookData(data) {
  const downloads = [];
  if (!data) return downloads;

  const normalVideo = data.Normal_video || data.result?.Normal_video || data.normal;
  const hdVideo = data.HD || data.result?.HD || data.hd;

  if (hdVideo) {
    downloads.push({
      quality: "HD Video (MP4)",
      url: typeof hdVideo === "string" ? hdVideo : hdVideo.url,
      format: "mp4",
      type: "video",
    });
  }
  if (normalVideo) {
    downloads.push({
      quality: "SD Video (MP4)",
      url: typeof normalVideo === "string" ? normalVideo : normalVideo.url,
      format: "mp4",
      type: "video",
    });
  }
  return downloads;
}

function normalizeTikTokData(data) {
  const downloads = [];
  if (!data) return downloads;

  const videoData = data.video || data.result?.video;
  if (videoData) {
    const videos = Array.isArray(videoData) ? videoData : [videoData];
    videos.forEach((v, i) => {
      downloads.push({
        quality: i === 0 ? "HD Video (No Watermark)" : "SD Video",
        url: typeof v === "string" ? v : v.url,
        format: "mp4",
        type: "video",
      });
    });
  }
  const audioData = data.audio || data.result?.audio;
  if (audioData) {
    const audios = Array.isArray(audioData) ? audioData : [audioData];
    audios.forEach((a) => {
      const audioUrl = typeof a === "string" ? a : a?.url;
      if (audioUrl) {
        downloads.push({
          quality: "Audio (MP3)",
          url: audioUrl,
          format: "mp3",
          type: "audio",
        });
      }
    });
  }
  return downloads;
}

function normalizeInstagramData(data) {
  const downloads = [];
  if (!data) return downloads;

  const items = Array.isArray(data)
    ? data
    : Array.isArray(data?.result)
    ? data.result
    : data?.url
    ? [data]
    : [];

  items.forEach((item) => {
    const videoUrl = typeof item === "string" ? item : item?.url;
    if (videoUrl) {
      downloads.push({
        quality: "HD Video (MP4)",
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
  if (!data) return downloads;

  const urlField = data.url || data.result?.url;
  if (urlField) {
    const urls = Array.isArray(urlField) ? urlField : [urlField];
    urls.forEach((u) => {
      downloads.push({
        quality: "HD Video (MP4)",
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
    if (!data || data.status === false) {
      throw new Error(data?.message || "Could not extract YouTube video");
    }
    return {
      title: data.title || (Array.isArray(data) ? data[0]?.title : null) || "YouTube Video",
      thumbnail: data.thumbnail || (Array.isArray(data) ? data[0]?.thumbnail : null) || null,
      downloads: normalizeYouTubeData(data),
    };
  },
  facebook: async (url) => {
    const data = await fbdown(url);
    if (!data || data.status === false) {
      throw new Error(data?.message || "Could not extract Facebook video");
    }
    return {
      title: data?.title || "Facebook Video",
      thumbnail: data?.thumbnail || null,
      downloads: normalizeFacebookData(data),
    };
  },
  tiktok: async (url) => {
    const data = await ttdl(url);
    if (!data || data.status === false) {
      throw new Error(data?.message || "Could not extract TikTok video");
    }
    return {
      title: data?.title || "TikTok Video",
      thumbnail: data?.thumbnail || null,
      downloads: normalizeTikTokData(data),
    };
  },
  instagram: async (url) => {
    const data = await igdl(url);
    if (!data || data.status === false) {
      throw new Error(data?.message || "Could not extract Instagram video");
    }
    const thumbnail = Array.isArray(data?.result) && data.result[0]?.thumbnail ? data.result[0].thumbnail : null;
    return {
      title: "Instagram Video",
      thumbnail,
      downloads: normalizeInstagramData(data),
    };
  },
  twitter: async (url) => {
    const data = await twitter(url);
    if (!data || data.status === false) {
      throw new Error(data?.message || "Could not extract Twitter/X video");
    }
    return {
      title: data?.title || "Twitter/X Video",
      thumbnail: data?.thumbnail || null,
      downloads: normalizeTwitterData(data),
    };
  },
  douyin: async (url) => {
    const data = await douyin(url);
    if (!data || data.status === false) {
      throw new Error(data?.message || "Could not extract Douyin video");
    }
    return {
      title: data?.result?.title || data?.title || "Douyin Video",
      thumbnail: data?.result?.thumbnail || data?.thumbnail || null,
      downloads: normalizeDouyinData(data),
    };
  },
  pinterest: async (url) => {
    const data = await pinterest(url);
    if (!data || data.status === false) {
      throw new Error(data?.message || "Could not extract Pinterest media");
    }
    return {
      title: data?.result?.title || data?.title || "Pinterest Media",
      thumbnail: data?.result?.image || data?.thumbnail || null,
      downloads: normalizePinterestData(data),
    };
  },
  kuaishou: async (url) => {
    const data = await kuaishou(url);
    if (!data || data.status === false) {
      throw new Error(data?.message || "Could not extract Kuaishou video");
    }
    return {
      title: data?.result?.title || data?.title || "Kuaishou Video",
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

async function fetchFileSize(url) {
  if (!url || typeof url !== "string") return null;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    clearTimeout(timeoutId);

    let bytes = res.headers.get("content-length");
    const contentRange = res.headers.get("content-range");
    if (contentRange) {
      const parts = contentRange.split("/");
      if (parts.length > 1 && parts[1] && !isNaN(parts[1])) {
        bytes = parts[1];
      }
    }

    // If HEAD didn't return content-length, try Range GET
    if (!bytes && res.status !== 404) {
      const getController = new AbortController();
      const getTimeoutId = setTimeout(() => getController.abort(), 5000);
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: getController.signal,
        headers: {
          Range: "bytes=0-0",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      clearTimeout(getTimeoutId);

      const rangeH = res.headers.get("content-range");
      if (rangeH) {
        const total = rangeH.split("/")[1];
        if (total && !isNaN(total)) bytes = total;
      } else {
        bytes = res.headers.get("content-length");
      }
    }

    if (bytes) {
      const num = parseInt(bytes, 10);
      if (num >= 10240) { // Only format genuine media payloads (at least 10 KB)
        if (num >= 1024 * 1024) {
          return `${(num / (1024 * 1024)).toFixed(2)} MB`;
        }
        return `${(num / 1024).toFixed(2)} KB`;
      }
    }
  } catch {
    // Timeout or network error - skip gracefully
  }
  return null;
}

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

    // Fetch real file sizes in parallel using fast HEAD requests
    await Promise.allSettled(
      result.downloads.map(async (item) => {
        if (!item.size && item.url) {
          item.size = await fetchFileSize(item.url);
        }
      })
    );

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
      { error: error?.message || "Failed to process the URL. Please try again." },
      { status: 500 }
    );
  }
}


