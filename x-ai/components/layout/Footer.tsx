"use client";

import { XaiLogo } from "@/components/icons";

const footerLinks = ["Privacy", "Terms", "Security", "Status", "Docs"];

export default function Footer() {
  return (
    <footer className="px-12 py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
      <div>
        <XaiLogo />
        <p className="font-mono text-[10px] text-[#3F3F46] mt-3 tracking-wide">
          Intelligence infrastructure for the enterprise.
        </p>
      </div>
      <div className="flex items-center gap-8">
        {footerLinks.map((l) => (
          <a
            key={l}
            href="#"
            className="font-mono text-[10px] text-[#52525B] hover:text-[#A1A1AA] transition-colors tracking-wide"
          >
            {l}
          </a>
        ))}
      </div>
      <div className="font-mono text-[9px] text-[#2D2D31] tracking-wide">
        © 2025 Xai Systems, Inc.
      </div>
    </footer>
  );
}
