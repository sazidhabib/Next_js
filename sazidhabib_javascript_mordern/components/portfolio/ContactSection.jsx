"use client";

import { useState } from "react";
import { FiMail, FiCopy, FiCheck, FiArrowUpRight, FiMessageSquare } from "react-icons/fi";
import { FaWhatsapp, FaGithub, FaLinkedin } from "react-icons/fa6";
import { portfolioConfig } from "@/config/portfolio.config";

export default function ContactSection() {
  const { contact, profile } = portfolioConfig;
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="py-24 border-t border-white/5 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-t from-cyan-600/10 via-indigo-600/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <span className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-medium">
          06 · Let's Collaborate
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2 mb-4">
          Have an ambitious project in mind?
        </h2>
        <p className="text-base sm:text-lg text-zinc-300 max-w-xl mx-auto leading-relaxed mb-10">
          Whether you need a full Next.js web application, a dynamic CMS, or an engineering sprint, let's talk.
        </p>

        {/* Email Copy Card */}
        <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-2 sm:p-2.5 rounded-2xl bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-2xl mb-10 max-w-md w-full justify-between">
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-200 font-mono truncate">
            <FiMail className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="truncate">{contact.email}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyEmail}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors cursor-pointer active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <FiCopy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center justify-center p-2 rounded-xl text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              title="Open Mail Client"
            >
              <FiArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Channels Grid */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/40 transition-colors cursor-pointer"
          >
            <FaWhatsapp className="w-4 h-4 text-emerald-400" />
            <span>Direct WhatsApp</span>
          </a>

          <a
            href="https://github.com/sazidhabib"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-zinc-900 text-zinc-300 border border-white/10 hover:border-white/20 hover:text-white transition-colors"
          >
            <FaGithub className="w-4 h-4" />
            <span>GitHub Profile</span>
          </a>

          <a
            href="https://linkedin.com/in/sazidhabib"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-zinc-900 text-zinc-300 border border-white/10 hover:border-white/20 hover:text-white transition-colors"
          >
            <FaLinkedin className="w-4 h-4 text-sky-400" />
            <span>LinkedIn Network</span>
          </a>
        </div>
      </div>
    </section>
  );
}

