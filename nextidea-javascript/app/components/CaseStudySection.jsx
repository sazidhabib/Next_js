"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function CaseStudySection({ pageId, title: initialTitle, description: initialDescription }) {
  const [studies, setStudies] = useState([]);
  const [title, setTitle] = useState(initialTitle || "");
  const [description, setDescription] = useState(initialDescription || "");
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1] || 'home';
    const derivedId = pageId || (pathname === '/' ? 'home' : lastSegment);
    const settingKey = `${derivedId}_case_studies`;

    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const caseData = data.data[settingKey];
          if (caseData) {
            setStudies(JSON.parse(caseData));
          } else if (derivedId !== 'home') {
            // Fallback to home case studies if service-specific one doesn't exist
            if (data.data.home_case_studies) {
              setStudies(JSON.parse(data.data.home_case_studies));
            } else if (data.data.global_case_studies) {
              setStudies(JSON.parse(data.data.global_case_studies));
            }
          } else if (data.data.global_case_studies) {
            setStudies(JSON.parse(data.data.global_case_studies));
          }

          // Handle titles
          const titleKey = `${derivedId}_case_title`;
          const descKey = `${derivedId}_case_desc`;
          if (data.data[titleKey]) setTitle(data.data[titleKey]);
          if (data.data[descKey]) setDescription(data.data[descKey]);
        }
      })
      .catch(err => console.error("Case studies fetch error:", err))
      .finally(() => setLoading(false));
  }, [pageId, pathname]);

  if (loading || studies.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
            {title || "Case Studies"}
          </h2>
          <p className="text-lg text-zinc-600">
            {description || "Results that speak for themselves"}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {studies.map((study, index) => (
            <motion.div
              key={study.id || index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
            >
              <Link
                href={study.link || "#"}
                className="group block"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 border border-zinc-100">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${study.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  {study.category && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 rounded-full text-sm font-medium text-zinc-900">
                      {study.category}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-primary transition-colors line-clamp-2">
                  {study.title}
                </h3>
                {study.stats && (
                  <div className="mt-2 text-primary font-bold text-sm">
                    {study.stats}
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/case-study"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors"
          >
            See More Case Studies
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
