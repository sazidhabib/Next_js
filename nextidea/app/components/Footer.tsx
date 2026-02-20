"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Mail, ArrowRight, Facebook, Linkedin, Youtube, Instagram } from "lucide-react";

const services = [
  { name: "Creative Concept & Execution", href: "/services/creative-concept-execution" },
  { name: "Digital Media Buying", href: "/services/digital-media-buying" },
  { name: "Social Media Marketing", href: "/services/social-media-marketing" },
  { name: "Brand Identity", href: "/services/brand-identity" },
  { name: "Web Design & Development", href: "/services/web-design-development" },
  { name: "Event and Activation", href: "/services/event-and-activation" },
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

const socials = [
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/GEEKYSMM/" },
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/geeky/" },
  { name: "Youtube", icon: Youtube, href: "https://www.youtube.com/channel/UCq_3LDhtuXEcdMedYPAH59w" },
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/geeky.social/" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setName("");
    }
  };

  return (
    <footer className="bg-[#1a1a1a] text-white relative">

      {/* CTA Section - Overlapping or Top Part */}
      <div className="bg-[#242424] py-16 border-b border-zinc-800">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-semibold mb-6">Have Some Projects in Mind?</h3>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider rounded-sm transition-colors"
          >
            Let's Discuss
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link href="/" className="inline-block mb-6">
              {/* Logo Placeholder or Image */}
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-primary">GEEKY</span> Social
              </h2>
            </Link>
            <div className="space-y-4 text-sm text-zinc-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                <span>Road 3, House 62(Level 4) Niketon, Gulshan 1, Dhaka</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span>20 Samuel Wood Way, Etobicoke, ON, M9B 0C8, Canada</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>contact@geekysocial.com</span>
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
            &copy; {new Date().getFullYear()} GEEKY Social. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
