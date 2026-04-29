import { TrendingUp, Code2, Megaphone, Sparkles, Target, Layers, Zap, Filter, BarChart, Wallet, Check, ArrowRight } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import PackagesSection from "../../components/PackagesSection";
import CaseStudySection from "../../components/CaseStudySection";
import ClientsSection from "../../components/ClientsSection";
import PartnerSection from "../../components/PartnerSection";
import FAQSection from "../../components/FAQSection";
import CTASection from "../../components/CTASection";
import { query } from "@/app/lib/db";
import { notFound } from "next/navigation";

export default async function DigitalMediaBuyingPage() {
  return (
    <>
      <ServiceHero
        icon={<TrendingUp />}
        title="Digital Media Buying"
        tagline="Funnel-driven media buying solutions that generate higher ROI."

        image="/Digital-Media.png"
      />
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                About Digital Media <span className="text-primary">Buying</span>
              </h2>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                We specialize in data-driven media buying solutions that maximize your ROI. Our strategic approach ensures your message reaches the right audience at the right time through advanced funnel optimization.
                Digital media buying is an important and very performant marketing strategy. It's the most effective way to reach your target audience and generate conversions. Through the use of funnel-based media buying, we are able to target the right sort of audience more effectively. By analyzing their behavior and identifying key traits such as demographic profiles, psychographics, and past purchasing behavior, we are able to reach out to them and grow your brand. This results in higher ROI.
              </p>
              <button className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                GET A FREE QUOTE
              </button>
            </div>
            <div className="md:w-1/2">
              <img
                src="/digitalmedia.jpeg"
                alt="Local SEO Illustration"
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
      <ServiceContent
        overview={{

        }}
        features={{
          title: "Why Choose Us",
          items: [
            {
              title: "Data-driven Targeting",
              description: "We reach your exact ideal audience using advanced data points.",
              icon: <Target className="w-6 h-6" />
            },
            {
              title: "Multi-channel Mgmt",
              description: "Seamless campaign execution across multiple platforms.",
              icon: <Layers className="w-6 h-6" />
            },
            {
              title: "Real-time Optimization",
              description: "Continuous adjustment to maximize performance and ROI.",
              icon: <Zap className="w-6 h-6" />
            },
            {
              title: "Advanced Funnel",
              description: "Building pathways that convert visitors into loyal customers.",
              icon: <Filter className="w-6 h-6" />
            },
            {
              title: "Comprehensive Analytics",
              description: "Transparent reporting on all key performance indicators.",
              icon: <BarChart className="w-6 h-6" />
            },
            {
              title: "Strategic Budget",
              description: "Smart allocation of your ad spend to prevent wastage.",
              icon: <Wallet className="w-6 h-6" />
            },
          ],
        }}
        relatedServices={[
          { title: "Creative Concept", link: "/services/creative-concept-execution", icon: <TrendingUp /> },
          { title: "Web Development", link: "/services/web-design-development", icon: <Code2 /> },
          { title: "Event & Activation", link: "/services/event-and-activation", icon: <Megaphone /> },
        ]}
      />
      <PackagesSection />
      <CaseStudySection />
      <ClientsSection />
      <PartnerSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
