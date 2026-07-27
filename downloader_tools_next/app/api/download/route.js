import { youtube, fbdown, ttdl, igdl, twitter } from "btch-downloader";

const PLATFORM_PATTERNS = {
  youtube: /(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)/i,
  facebook: /(facebook\.com\/(watch|reel|videos|posts)|fb\.watch)/i,
  instagram: /(instagram\.com\/(reel|p\/|stories|tv))/i,
  tiktok: /(tiktok\.com\/|vm\.tiktok\.com|vt\.tiktok\.com)/i,
  twitter: /(twitter\.com\/\w+\/status| x\.com\/\w+\/status)/i,
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
