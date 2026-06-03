"use client";

import ServiceCenterNavbar from "../../components/ServiceCenterNavbar";
import ServiceCenterHero from "../../components/ServiceCenterHero";
import ServiceGrid from "../../components/ServiceGrid";
import ServiceLocations from "../../components/ServiceLocations";
import ServicePricing from "../../components/ServicePricing";
import ServiceContactForm from "../../components/ServiceContactForm";
import ServiceTestimonials from "../../components/ServiceTestimonials";
import ServiceFAQs from "../../components/ServiceFAQs";
import Footer from "../../components/Footer";

export default function ServiceCenterPage() {
  return (
    <>
      <ServiceCenterNavbar />

      <main className="bg-white">
        {/* Hero Section */}
        <ServiceCenterHero />

        {/* Services Grid */}
        <ServiceGrid />

        {/* Pricing Table */}
        <ServicePricing />

        {/* Locations */}
        <ServiceLocations />

        {/* Contact Form */}
        <ServiceContactForm />

        {/* Testimonials */}
        <ServiceTestimonials />

        {/* FAQs */}
        <ServiceFAQs />
      </main>

      {/* Footer - Using existing footer component */}
      <Footer />
    </>
  );
}
