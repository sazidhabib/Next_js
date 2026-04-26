"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Facebook, Linkedin, Youtube, Instagram, Loader2 } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(data.data);
        }
      })
      .catch(err => console.error("Footer settings fetch error:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setName("");
    }
  };

  const socials = [
    { name: "Facebook", icon: Facebook, href: settings?.facebook_url || "#" },
    { name: "LinkedIn", icon: Linkedin, href: settings?.linkedin_url || "#" },
    { name: "Youtube", icon: Youtube, href: settings?.youtube_url || "#" },
    { name: "Instagram", icon: Instagram, href: settings?.instagram_url || "#" },
  ];

  const services = [
    { name: "Creative Concept & Execution", href: "/protfolio?category_id=17" },
    { name: "Digital Media Buying", href: "/protfolio?category_id=15" },
    { name: "Social Media Marketing", href: "/protfolio?category_id=16" },
    { name: "Brand Identity", href: "/protfolio?category_id=19" },
    { name: "Web Design & Development", href: "/protfolio?category_id=18" },
    { name: "Event and Activation", href: "/protfolio?category_id=22" },
  ];

  const usefulLinks = [
    { name: "Our Team", href: "/our-team" },
    { name: "Insights", href: "/insights" },
    { name: "Blog", href: "/blog" },
    { name: "Webinar", href: "/webinar" },
    { name: "News & Events", href: "/news-and-events" },
    { name: "Career", href: "/career" },
    { name: "Privacy Policy", href: "/privacy-policy" },
  ];

  return (
    <footer className="bg-[#1a1a1a] text-white relative">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link href="/" className="inline-block mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">Next Idea
                <span className="text-primary">Solution</span>
              </h2>
            </Link>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                {settings?.footer_about || "Your 360-degree digital-first advertising agency in Bangladesh."}
            </p>
            <div className="space-y-4 text-sm text-zinc-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                <span>{settings?.address || "Mirpur, Dhaka, Bangladesh"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{settings?.contact_email || "support@nextideasolution.com"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{settings?.contact_phone || "+8801714787250"}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider text-sm">Useful Links</h4>
            <ul className="space-y-2 text-sm">
              {usefulLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-primary transition-colors hover:pl-2"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider text-sm">Popular Services</h4>
            <ul className="space-y-2 text-sm">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-zinc-400 hover:text-primary transition-colors hover:pl-2"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider text-sm">Join Our Newsletter</h4>
            <p className="text-zinc-400 mb-4 text-sm">
              Stay up-to-date with latest media insights and updates
            </p>
            {subscribed ? (
              <div className="bg-primary/20 text-primary px-4 py-3 rounded-sm text-sm">
                Thanks for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary text-sm"
                  required
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors uppercase font-bold text-sm tracking-wider"
                >
                  Subscribe Now
                </button>
              </form>
            )}
            <div className="flex gap-4 mt-6">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-800">
          <p className="text-zinc-500 text-sm text-center">
            &copy; {new Date().getFullYear()} {settings?.site_name || "Next Idea Solution"}. {settings?.copyright_text || "All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
