"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function ServiceContactForm({ 
  title = "Ready To Bring Traffic And Conversions?", 
  description = "Partner with Next Idea, the leading SEO agency in Bangladesh. We're dedicated to scaling your business with proven, data-driven strategies that deliver measurable ROI." 
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted", formData);
  };

  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center gap-12 bg-primary text-white rounded-3xl p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              {title}
            </h2>
            <p className="text-white/90 text-lg mb-8">
              {description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-2xl shadow-2xl space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:border-primary text-black placeholder:text-zinc-400"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:border-primary text-black placeholder:text-zinc-400"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone No"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:border-primary text-black placeholder:text-zinc-400"
                  />
                </div>
                <div>
                  <input
                    type="url"
                    name="website"
                    placeholder="Your Website Url"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:border-primary text-black placeholder:text-zinc-400"
                  />
                </div>
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="How can we help?"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:border-primary text-black placeholder:text-zinc-400 resize-none"
                  required
                ></textarea>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <input type="checkbox" id="robot" className="rounded text-primary focus:ring-primary" required />
                <label htmlFor="robot" className="text-sm text-zinc-500">I'm not a robot</label>
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Submit
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
