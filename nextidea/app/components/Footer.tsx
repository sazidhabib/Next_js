"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, ArrowRight, Twitter, Linkedin, Instagram, Facebook } from "lucide-react";

const services = [
  { name: "Brand Strategy", href: "/services/brand-strategy" },
  { name: "Creative Design", href: "/services/creative-design" },
  { name: "Web Development", href: "/services/web-development" },
  { name: "Digital Marketing", href: "/services/digital-marketing" },
  { name: "Content Strategy", href: "/services/content-strategy" },
  { name: "Creative Concept", href: "/creative_concept" },
];

const socials = [
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Facebook", icon: Facebook, href: "#" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">
              Next<span className="text-primary">Idea</span>
            </h3>
            <p className="text-zinc-400 mb-6">
              We transform creative concepts into powerful digital experiences
              that drive results for ambitious brands.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-zinc-400">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <span>123 Innovation Drive, Tech City, TC 10001</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span>hello@nextidea.agency</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-zinc-400 hover:text-primary transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-zinc-400 hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="text-zinc-400 hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#portfolio"
                  className="text-zinc-400 hover:text-primary transition-colors"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="text-zinc-400 hover:text-primary transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-zinc-400 hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Newsletter</h4>
            <p className="text-zinc-400 mb-4">
              Subscribe to receive updates on industry insights and our latest work.
            </p>
            {subscribed ? (
              <div className="bg-primary/20 text-primary px-4 py-3 rounded-lg">
                Thanks for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-primary"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} NextIdea. All rights reserved.
          </p>

          <div className="flex gap-4">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white transition-colors"
                aria-label={social.name}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
