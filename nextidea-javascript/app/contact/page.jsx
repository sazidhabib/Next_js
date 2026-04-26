"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2, Clock, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });
  const [settings, setSettings] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(data.data);
        }
      })
      .catch(err => console.error("Contact settings fetch error:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Form submitted:", formData);
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: "", email: "", phone: "", company: "", service: "", message: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactCards = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Our Office",
      detail: settings?.address || "House# 14 (2nd Floor), Road# 04, Block# A, Section# 11, Mirpur, Dhaka, Bangladesh",
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      detail: settings?.contact_email || "support@nextideasolution.com",
      link: `mailto:${settings?.contact_email || "support@nextideasolution.com"}`,
      color: "from-primary to-blue-400",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      detail: settings?.contact_phone || "+8801714787250",
      link: `tel:${settings?.contact_phone || "+8801714787250"}`,
      color: "from-emerald-500 to-teal-400",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Working Hours",
      detail: "Saturday – Thursday: 10:00 AM – 7:00 PM",
      color: "from-violet-500 to-purple-400",
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section - matching ServiceHero style */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-20 overflow-hidden bg-white">
        {/* Background Waves */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100 200C200 100 400 300 600 250C800 200 1000 400 1200 350C1400 300 1600 100 1600 100" stroke="var(--primary)" strokeWidth="1" />
            <path d="M-100 300C200 200 400 400 600 350C800 300 1000 500 1200 450C1400 400 1600 200 1600 200" stroke="var(--primary)" strokeWidth="1" />
            <path d="M-100 400C200 300 400 500 600 450C800 400 1000 600 1200 550C1400 500 1600 300 1600 300" stroke="var(--primary)" strokeWidth="1" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary mb-8"
          >
            <MessageCircle className="w-10 h-10" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-7xl font-bold text-black mb-6 leading-tight max-w-5xl mx-auto"
          >
            Get In <span className="text-primary">Touch</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-2xl text-zinc-600 font-medium max-w-3xl mx-auto mb-4"
          >
            Have a project in mind? Let&apos;s discuss how we can help grow your business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              href="#contact-form"
              className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-primary/30"
            >
              Start a Conversation
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-zinc-50/50">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {contactCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {card.link ? (
                  <a href={card.link} className="block group">
                    <div className="bg-white rounded-2xl border border-zinc-100 p-6 h-full shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300`}>
                        {card.icon}
                      </div>
                      <h3 className="text-lg font-bold text-zinc-900 mb-2">{card.title}</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed">{card.detail}</p>
                      <div className="mt-4 flex items-center gap-1 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Contact now</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="bg-white rounded-2xl border border-zinc-100 p-6 h-full shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-5`}>
                      {card.icon}
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-2">{card.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">{card.detail}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section id="contact-form" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-6">
                <Send className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">
                Let&apos;s Work <span className="text-primary">Together</span>
              </h2>
              <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
                Fill out the form and our team will get back to you within 24 hours.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-5 gap-12">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-3"
              >
                <div className="bg-white rounded-3xl border border-zinc-200 p-8 md:p-10 shadow-sm">
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl"
                    >
                      <p className="text-emerald-700 font-semibold text-center">
                        ✓ Thank you! Your message has been sent successfully.
                      </p>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-zinc-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-zinc-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-zinc-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                          placeholder="+880 1234 567890"
                        />
                      </div>
                      <div>
                        <label htmlFor="company" className="block text-sm font-semibold text-zinc-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                          placeholder="Your company"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="service" className="block text-sm font-semibold text-zinc-700 mb-2">
                        Service Interested In
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      >
                        <option value="">Select a service</option>
                        <option value="digital-media-buying">Digital Media Buying</option>
                        <option value="social-media-marketing">Social Media Marketing</option>
                        <option value="creative-concept">Creative Concept & Execution</option>
                        <option value="web-development">Web Design & Development</option>
                        <option value="brand-identity">Brand Identity</option>
                        <option value="seo">SEO</option>
                        <option value="video-production">Video Production & Photography</option>
                        <option value="event-activation">Event and Activation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-zinc-700 mb-2">
                        Your Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                        placeholder="Tell us about your project..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>

              {/* Map & Extra Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2 space-y-6"
              >
                {/* Map */}
                <div className="rounded-3xl overflow-hidden border border-zinc-200 shadow-sm h-[300px] lg:h-[320px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.512!2d90.3563!3d23.8041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ4JzE0LjgiTiA5MMKwMjEnMjIuNyJF!5e0!3m2!1sen!2sbd!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Next Idea Solution Office Location"
                  />
                </div>

                {/* Quick Response Card */}
                <div className="bg-gradient-to-br from-primary to-blue-600 rounded-3xl p-8 text-white">
                  <h3 className="text-xl font-bold mb-3">Quick Response Guaranteed</h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-6">
                    Our team typically responds within 2-4 hours during business hours. For urgent inquiries, call us directly.
                  </p>
                  <div className="space-y-3">
                    <a
                      href={`tel:${settings?.contact_phone || "+8801714787250"}`}
                      className="flex items-center gap-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-xl px-4 py-3 transition-all"
                    >
                      <Phone className="w-5 h-5" />
                      <span className="font-semibold text-sm">{settings?.contact_phone || "+8801714787250"}</span>
                    </a>
                    <a
                      href={`mailto:${settings?.contact_email || "support@nextideasolution.com"}`}
                      className="flex items-center gap-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-xl px-4 py-3 transition-all"
                    >
                      <Mail className="w-5 h-5" />
                      <span className="font-semibold text-sm">{settings?.contact_email || "support@nextideasolution.com"}</span>
                    </a>
                  </div>
                </div>

                {/* CTA Card */}
                <div className="bg-zinc-900 rounded-3xl p-8 text-white">
                  <h3 className="text-xl font-bold mb-3">Need Help Deciding?</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    Book a free 30-minute strategy session and we&apos;ll help you choose the right service.
                  </p>
                  <a
                    href={`mailto:${settings?.contact_email || "support@nextideasolution.com"}`}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                  >
                    Book Free Session
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
