"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Shield, Clock, FileText, Lock } from "lucide-react";

export default function PrivacyPolicyPage() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(data.data);
        }
      })
      .catch(err => console.error("Privacy Policy settings fetch error:", err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              Legal Information
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-zinc-500">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>

          <div className="prose prose-zinc max-w-none space-y-8 text-zinc-600 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                1. Introduction
              </h2>
              <p>
                Welcome to {settings?.site_name || "Next Idea Solution"}. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-primary" />
                2. Data Collection
              </h2>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" />
                3. How We Use Your Data
              </h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To register you as a new customer.</li>
                <li>To process and deliver your orders.</li>
                <li>To manage our relationship with you.</li>
                <li>To improve our website, products/services, marketing or customer relationships.</li>
              </ul>
            </section>

            <section className="bg-zinc-50 p-8 rounded-2xl border border-zinc-100">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this privacy policy or our privacy practices, please contact us:
              </p>
              <div className="space-y-2 font-medium text-zinc-900">
                <p>Email: {settings?.contact_email || "support@nextideasolution.com"}</p>
                <p>Phone: {settings?.contact_phone || "+8801714787250"}</p>
                <p>Address: {settings?.address || "Mirpur, Dhaka, Bangladesh"}</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
