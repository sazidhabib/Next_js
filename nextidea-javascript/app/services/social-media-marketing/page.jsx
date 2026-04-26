import { Share2, Users, TrendingUp, Target, Megaphone, Globe, Sparkles, Calendar, Palette } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import PackagesSection from "../../components/PackagesSection";
import ClientsSection from "../../components/ClientsSection";
import FAQSection from "../../components/FAQSection";
import CTASection from "../../components/CTASection";

export const metadata = {
  title: "Social Media Marketing | Next Idea Solutions",
  description: "Strategic social media marketing that builds brand awareness, drives engagement, and generates results. Connect with your audience through compelling content.",
};

export default function SocialMediaMarketingPage() {
  return (
    <>
      <ServiceHero
        icon={<Share2 />}
        title="Social Media Marketing"
        tagline="Every 6 people out of 11 use social media to research products before making any purchase decision."

        image="/Social-Media.png"
      />
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                About This <span className="text-primary">Service</span>
              </h2>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                Social media marketing is the new word-of-mouth. Staying on top of social media is an effective way to build people's trust and can help you establish as a prominent brand over time. We take a results-oriented approach to generate more engagement, increase your reach, drive more website traffic, and support your broader business objectives through social media. Connect with your audience with strategic social media marketing. Develop a social media marketing strategy that will build your brand, boost your exposure, amplify your SEO, and help you grow your business.
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
          title: "What's Included",
          items: [
            {
              icon: <Target className="w-6 h-6" />,
              title: "Strategy Development",
              description: "Comprehensive social media strategy tailored to your business goals."
            },
            {
              icon: <Calendar className="w-6 h-6" />,
              title: "Content Calendar",
              description: "Planned out content for consistent posting and engagement."
            },
            {
              icon: <Megaphone className="w-6 h-6" />,
              title: "Media Buying & Ads",
              description: "Running and optimizing paid campaigns for maximum ROI."
            },
            {
              icon: <TrendingUp className="w-6 h-6" />,
              title: "Sales Funnel Monitoring",
              description: "Continuous tracking and optimizing to drive more conversions."
            },
            {
              icon: <Palette className="w-6 h-6" />,
              title: "Design & Video",
              description: "Engaging visuals, animations, and video content strategies."
            },
            {
              icon: <Users className="w-6 h-6" />,
              title: "Community Management",
              description: "Active engagement with your followers to build brand loyalty."
            },
          ],
        }}
        relatedServices={[
          { title: "Digital Media Buying", link: "/services/digital-media-buying", icon: <TrendingUp /> },
          { title: "Creative Concept", link: "/services/creative-concept-execution", icon: <Target /> },
          { title: "Brand Identity", link: "/services/brand-identity", icon: <Users /> },
        ]}
      />
      <PackagesSection
        title="Let's Engage and Grow Together"
        subtitle="Choose the social media strategy that fits your growth goals"
        footerText="*Media budget is not included in the plan"
        packages={[
          {
            name: "Organic",
            buttonText: "Schedule A Call",
            features: [
              { name: "Monthly Strategy Development", included: true },
              { name: "Monthly Content Calendar", included: true },
              { name: "Media Buying (Paid Ads)", included: false },
              { name: "Sales Funnel Development", included: false },
            ],
          },
          {
            name: "Optimal",
            buttonText: "Schedule A Call",
            features: [
              { name: "Monthly Strategy Development", included: true },
              { name: "Monthly Content Calendar", included: true },
              { name: "Media Buying (Paid Ads)", included: true },
              { name: "Sales Funnel Development", included: false },
            ],
          },
          {
            name: "Turbo",
            buttonText: "Schedule A Call",
            features: [
              { name: "Monthly Strategy Development", included: true },
              { name: "Monthly Content Calendar", included: true },
              { name: "Media Buying (Paid Ads)", included: true },
              { name: "Sales Funnel Development", included: true },
            ],
          },
        ]}
      />
      <ClientsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
