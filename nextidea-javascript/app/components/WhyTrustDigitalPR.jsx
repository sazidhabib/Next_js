"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";

const deliverables = [
  "Media Coverage in Top-Tier News Sites",
  "Organic Backlinks to Improve SEO & Brand Trust",
  "Thought Leadership Positioning",
  "Reputation Management",
  "Influencer Features and Brand Mentions",
  "Viral Storytelling and Reactive PR Opportunities",
];

export default function WhyTrustDigitalPR() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 w-full flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-square">
               <Image 
                src="/Digital-PR.png" 
                alt="Why Trust Next Idea" 
                fill
                className="object-contain"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-black mb-6">
              Why Trust Next Idea as Your Digital PR Agency?
            </h2>
            <div className="space-y-4 text-zinc-600 text-lg mb-8">
              <p>
                You don't want to hire a digital PR agency that struggles to gain placement in reputed media sites. Our digital PR specialists know what editors and journalists want.
              </p>
              <p>
                Our digital PR agency builds long-lasting relationships with top journalists, bloggers, and online publications.
              </p>
            </div>

            <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
              <h3 className="text-xl font-bold text-black mb-6">
                Here's what we deliver:
              </h3>
              <ul className="space-y-4">
                {deliverables.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 bg-primary/10 rounded-full p-1 text-primary">
                      <Check className="w-4 h-4" strokeWidth={3} />
                    </div>
                    <span className="text-zinc-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
