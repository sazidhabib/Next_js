"use client";

import { motion } from "framer-motion";
import { BookOpen, Calendar, FileText, Gift, Bookmark } from "lucide-react";
import Image from "next/image";

const showcaseItems = [
  {
    title: "Diaries",
    description: "Elegant and functional, our custom corporate diaries are perfect for elevating your brand during meetings, conferences, or as premium corporate giveaways.",
    icon: <BookOpen className="w-6 h-6" />,
    image: "/diaries.jpeg", // Fallback image
  },
  {
    title: "Calendars\n(Desk & Wall)",
    description: "Keep your brand top-of-mind 365 days a year with beautifully designed desk and wall calendars. Customized with your company's aesthetic to leave a lasting impression.",
    icon: <Calendar className="w-6 h-6" />,
    image: "/calender.jpeg", // Fallback image
  },
  {
    title: "Notebooks",
    description: "High-quality custom notebooks tailored to reflect your company's identity. From classic leather-bound styles to modern minimalist designs.",
    icon: <Bookmark className="w-6 h-6" />,
    image: "/notebook.jpeg", // Fallback image
  },
  {
    title: "Annual Reports",
    description: "Present your company's achievements in a comprehensive and visually appealing annual report. We ensure your data is communicated clearly and elegantly.",
    icon: <FileText className="w-6 h-6" />,
    image: "/annual-report.jpeg", // Fallback image
  },
  {
    title: "Customized Corporate Gifts",
    description: "Show appreciation to your clients and employees with premium corporate gifts. We offer a wide range of customized items, from tech accessories to luxury gift sets, designed to leave a lasting impression.",
    icon: <Gift className="w-6 h-6" />,
    image: "/coeporategift.jpeg", // Fallback image
  },
];

export default function DesignPrintingShowcase() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Intro Section */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">
              Why Choose <span className="text-primary">Next Idea</span> for Your Corporate Printing Needs?
            </h2>
            <p className="text-lg text-zinc-600">
              We understand that your brand's image is crucial. That's why we offer top-notch designing and printing services that not only meet but exceed your expectations. From elegant diaries and professional calendars to bespoke corporate gifts, we ensure that every product reflects your brand's identity with precision and creativity.
            </p>
          </motion.div>
        </div>

        <div className="text-center mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-black mb-4"
          >
            Premium <span className="text-primary">Designs.</span> Premium <span className="text-primary">Printing.</span>
          </motion.h3>
          <p className="text-zinc-500 uppercase tracking-widest text-sm font-semibold">
            Explore our curated corporate printing items
          </p>
        </div>

        {/* Zigzag Layout */}
        <div className="space-y-12 md:space-y-24 max-w-6xl mx-auto">
          {showcaseItems.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center gap-12 bg-zinc-50 rounded-3xl p-8 md:p-12 ${isEven ? "" : "md:flex-row-reverse"
                  }`}
              >
                {/* Image Side */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="flex-1 w-full"
                >
                  <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={item.image}
                      alt={item.title.replace("\n", " ")}
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>

                {/* Text Side */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="flex-1"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                    {item.icon}
                  </div>
                  <h4 className="text-3xl font-bold text-black mb-6 whitespace-pre-line">
                    {item.title}
                  </h4>
                  <p className="text-lg text-zinc-600 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <a
              href="#contact"
              className="inline-block bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-primary/30"
            >
              Get A Quote
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
