"use client";

import { useState } from "react";
import { Mail, Phone, User, MessageSquare } from "lucide-react";

export default function ServiceContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    device: "",
    issue: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to backend API
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", device: "", issue: "" });
    }, 3000);
  };

  return (
    <section
      id="contact"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side - Contact Info */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Get in Touch
          </h2>
          <p className="text-gray-600 mb-8">
            Have questions about our services? Need to schedule a repair?
            Contact us today and our team will be happy to help.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-star-blue" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Phone</h3>
                <p className="text-gray-600">+880-2-XXXX-XXXX</p>
                <p className="text-sm text-gray-500">
                  Available Mon-Sat, 10AM-8PM
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-star-blue" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Email</h3>
                <p className="text-gray-600">service@hullotech.com</p>
                <p className="text-sm text-gray-500">
                  We respond within 24 hours
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-star-blue rounded-lg p-4 mt-8">
              <p className="text-sm text-gray-700">
                <strong>Warranty Support:</strong> If your device is under
                warranty, bring your purchase receipt for faster processing.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div>
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-star-gray rounded-lg p-6"
          >
            {submitted && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-800 rounded-lg text-sm">
                ✓ Thank you! We'll contact you shortly.
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-star-blue focus:border-transparent outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-star-blue focus:border-transparent outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+880-1XXX-XXXXXX"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-star-blue focus:border-transparent outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Device Type *
              </label>
              <select
                name="device"
                value={formData.device}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-star-blue focus:border-transparent outline-none"
              >
                <option value="">Select device</option>
                <option value="laptop">Laptop</option>
                <option value="smartphone">Smartphone</option>
                <option value="desktop">Desktop</option>
                <option value="monitor">Monitor</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Description *
              </label>
              <textarea
                name="issue"
                value={formData.issue}
                onChange={handleChange}
                required
                placeholder="Describe the problem..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-star-blue focus:border-transparent outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-star-blue text-white rounded-lg font-bold hover:bg-star-dark-blue transition-colors"
            >
              Submit Service Request
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
