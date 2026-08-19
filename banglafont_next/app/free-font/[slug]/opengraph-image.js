import { ImageResponse } from "next/og";
import { prisma } from "../../../lib/prisma";

export const alt = "NextType - বাংলা ফন্ট ডাউনলোড";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function Image({ params }) {
  const { slug } = await params;
  const font = await prisma.font.findUnique({
    where: { slug },
    include: { designer: true },
  });

  if (!font) {
    return new Response("Font Not Found", { status: 404 });
  }

  // Load Noto Sans Bengali font for general Bengali UI text fallback
  let notoBengaliFont = null;
  try {
    const res = await fetch(
      "https://fonts.gstatic.com/s/notosansbengali/v20/Hi_di2wxRzpUjaD02DxzU7OD8-tSg_eE_g.ttf"
    );
    if (res.ok) {
      notoBengaliFont = await res.arrayBuffer();
    }
  } catch (err) {
    console.error("Failed to load Noto Sans Bengali", err);
  }

  // Load the target font dynamically for the main text preview
  let targetFont = null;
  if (font.fontFileUrl) {
    try {
      const res = await fetch(font.fontFileUrl);
      if (res.ok) {
        targetFont = await res.arrayBuffer();
      }
    } catch (err) {
      console.error("Failed to load target font", err);
    }
  }

  const fonts = [];
  if (notoBengaliFont) {
    fonts.push({
      name: "Noto Sans Bengali",
      data: notoBengaliFont,
      style: "normal",
      weight: 700,
    });
  }

  if (targetFont) {
    fonts.push({
      name: font.name,
      data: targetFont,
      style: "normal",
    });
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#090a0f",
          backgroundImage: "radial-gradient(circle at 75% 25%, #181c35 0%, #090a0f 70%)",
          padding: "80px",
          fontFamily: "Noto Sans Bengali, sans-serif",
        }}
      >
        {/* Top Header Row */}
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#00e599",
              }}
            />
            <span
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-0.5px",
              }}
            >
              NextType
            </span>
          </div>
          <span
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#00e599",
              backgroundColor: "rgba(0, 229, 153, 0.1)",
              border: "1px solid rgba(0, 229, 153, 0.2)",
              padding: "6px 16px",
              borderRadius: "20px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {font.fontType === "PREMIUM" ? "💎 PREMIUM FONT" : "✨ FREE DOWNLOAD"}
          </span>
        </div>

        {/* Main Content Area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "20px",
            marginTop: "40px",
            marginBottom: "40px",
            width: "100%",
          }}
        >
          {/* Dynamic Font Preview Rendering */}
          <div
            style={{
              fontSize: "80px",
              color: "#ffffff",
              fontFamily: targetFont ? font.name : "Noto Sans Bengali",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "100%",
            }}
          >
            {font.banglaName || font.name}
          </div>

          <div
            style={{
              fontSize: "24px",
              color: "#a1a1aa",
              fontFamily: "Noto Sans Bengali",
            }}
          >
            {font.banglaName ? `${font.name} — ` : ""}আকর্ষক বাংলা টাইপোগ্রাফি ফন্ট
          </div>
        </div>

        {/* Footer Details */}
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "30px",
          }}
        >
          <div style={{ display: "flex", gap: "40px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "14px", color: "#71717a" }}>DESIGNER</span>
              <span style={{ fontSize: "18px", color: "#ffffff", fontWeight: 700 }}>
                {font.designer?.name || "NextType"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "14px", color: "#71717a" }}>STYLE</span>
              <span style={{ fontSize: "18px", color: "#ffffff", fontWeight: 700 }}>
                {font.style || "General"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "14px", color: "#71717a" }}>FORMATS</span>
              <span style={{ fontSize: "18px", color: "#ffffff", fontWeight: 700 }}>
                {font.formats || "TTF, OTF, WOFF2"}
              </span>
            </div>
          </div>
          <span style={{ fontSize: "16px", color: "#71717a" }}>nexttype.com</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts.length > 0 ? fonts : undefined,
    }
  );
}
