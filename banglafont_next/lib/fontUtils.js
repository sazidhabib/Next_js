/**
 * Helper to resolve font and static asset URLs considering the Next.js basePath
 * e.g., if basePath is "/next-type", "/uploads/fonts/Atma.ttf" -> "/next-type/uploads/fonts/Atma.ttf"
 */
export function resolveFontUrl(url) {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (basePath && url.startsWith("/") && !url.startsWith(basePath)) {
    return `${basePath}${url}`;
  }
  return url;
}

export default resolveFontUrl;
