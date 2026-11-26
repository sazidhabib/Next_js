import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "ffmpeg-static",
    "ffprobe-static",
    "@huggingface/transformers",
    "onnxruntime-node",
  ],
};

export default nextConfig;
