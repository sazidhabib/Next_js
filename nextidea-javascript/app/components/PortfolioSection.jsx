"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PortfolioSection({ pageId, title: initialTitle, subtitle: initialSubtitle }) {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState(initialTitle || "");
  const [subtitle, setSubtitle] = useState(initialSubtitle || "");
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1] || 'home';
    const derivedId = pageId || (pathname === '/' ? 'home' : lastSegment);
    const settingKey = `${derivedId}_work`;

    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const workData = data.data[settingKey];
          if (workData) {
            setItems(JSON.parse(workData));
          } else if (derivedId !== 'home') {
            // Fallback to home work if service-specific one doesn't exist
            if (data.data.home_work) {
              setItems(JSON.parse(data.data.home_work));
            } else if (data.data.global_work) {
              setItems(JSON.parse(data.data.global_work));
            }
          } else if (data.data.global_work) {
            setItems(JSON.parse(data.data.global_work));
          }

          // Handle titles
          const titleKey = `${derivedId}_portfolio_title`;
          const subKey = `${derivedId}_portfolio_subtitle`;
          if (data.data[titleKey]) setTitle(data.data[titleKey]);
          else if (data.data.home_portfolio_title) setTitle(data.data.home_portfolio_title);
          
          if (data.data[subKey]) setSubtitle(data.data[subKey]);
          else if (data.data.home_portfolio_subtitle) setSubtitle(data.data.home_portfolio_subtitle);
        }
      })
      .catch(err => console.error("Portfolio fetch error:", err))
      .finally(() => setLoading(false));
  }, [pageId, pathname]);

  if (loading || items.length === 0) return null;

  return (
    <section id="portfolio" className="py-24 bg-white text-zinc-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-800 mb-4 uppercase tracking-wider">
            {title || "Our Work"}
          </h2>
          {subtitle && (
            <p className="text-zinc-500 max-w-2xl mx-auto mb-4">{subtitle}</p>
          )}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-24 h-1 bg-primary mx-auto rounded-full origin-center"
          />
        </motion.div>

        {/* Top items (larger) */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {items.slice(0, 2).map((category, index) => (
            <motion.div
              key={category.id || index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
            >
              <Link
                href={category.link || "#"}
                className="group relative h-[300px] md:h-[400px] rounded-sm overflow-hidden block"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color || "from-zinc-900/50 to-zinc-900/20"} opacity-50`} />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-md">{category.title}</h3>
                  <div className="w-12 h-1 bg-white/50 rounded-full mt-2 group-hover:w-20 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom items (smaller) */}
        <div className="grid md:grid-cols-3 gap-8">
          {items.slice(2).map((category, index) => (
            <motion.div
              key={category.id || index + 2}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (index + 2) * 0.1, ease: "easeOut" }}
            >
              <Link
                href={category.link || "#"}
                className="group relative h-[250px] md:h-[300px] rounded-sm overflow-hidden block"
                onMouseEnter={() => setHoveredIndex(index + 2)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color || "from-zinc-900/50 to-zinc-900/20"} opacity-50`} />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">{category.title}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
