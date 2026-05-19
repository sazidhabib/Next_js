"use client";

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    // Fetch site settings from backend
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success) {
          setSettings(data.data);
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary-dark">Contact Us</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        {settings?.siteDescription || 'Get in touch with us. We are here to help and answer any question you might have.'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6">Our Information</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <Mail className="w-6 h-6 text-primary mt-1 mr-4" />
              <div>
                <h3 className="font-medium text-gray-900">Email</h3>
                <p className="text-gray-600">{settings?.contactEmail || 'support@hullotech.com'}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="w-6 h-6 text-primary mt-1 mr-4" />
              <div>
                <h3 className="font-medium text-gray-900">Phone</h3>
                <p className="text-gray-600">{settings?.contactPhone || '+880 1234 567890'}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="w-6 h-6 text-primary mt-1 mr-4" />
              <div>
                <h3 className="font-medium text-gray-900">Address</h3>
                <p className="text-gray-600">{settings?.contactAddress || 'Dhaka, Bangladesh'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-primary" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-primary" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea rows="4" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-primary" placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition flex items-center justify-center">
              <Send className="w-4 h-4 mr-2" /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
