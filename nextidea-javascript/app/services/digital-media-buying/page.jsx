import { TrendingUp, Code2, Megaphone, Sparkles } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import PackagesSection from "../../components/PackagesSection";
import CaseStudySection from "../../components/CaseStudySection";
import ClientsSection from "../../components/ClientsSection";
import PartnerSection from "../../components/PartnerSection";
import FAQSection from "../../components/FAQSection";
import CTASection from "../../components/CTASection";

export const metadata = {
  title: "Digital Media Buying | Next Idea Solutions",
  description: "Funnel-driven media buying solutions that generate higher ROI. We optimize your ad spend across all digital platforms.",
};

export default function DigitalMediaBuyingPage() {
  return (
    <>
      <ServiceHero
        icon={<TrendingUp />}
        title="Digital Media Buying"
        tagline="Funnel-driven media buying solutions that generate higher ROI."
        description="We specialize in data-driven media buying solutions that maximize your ROI. Our strategic approach ensures your message reaches the right audience at the right time through advanced funnel optimization."
        image="/Digital-Media.png"
      />
      <ServiceContent
        overview={{
          title: "About Digital Media Buying",
          description: "Digital media buying is an important and very performant marketing strategy. It's the most effective way to reach your target audience and generate conversions. Through the use of funnel-based media buying, we are able to target the right sort of audience more effectively. By analyzing their behavior and identifying key traits such as demographic profiles, psychographics, and past purchasing behavior, we are able to reach out to them and grow your brand. This results in higher ROI.",
        }}
        features={{
          title: "Why Choose Us",
          items: [
            "Data-driven Audience Targeting",
            "Multi-channel Campaign Management",
            "Real-time Performance Optimization",
            "Advanced Funnel Development",
            "Comprehensive Analytics & Reporting",
            "Strategic Budget Allocation",
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
      <FAQSection 
        items={[
          {
            question: "What is digital media buying?",
            answer: "Digital media buying is the process of purchasing placements for advertisements on websites, apps and other digital platforms. In Bangladesh by Digital Media Buying we mostly refer to Facebook boosting & paid ads in Google or youtube."
          },
          {
            question: "What are the benefits of digital media buying?",
            answer: "Digital media buying allows for precise targeting, measurable results, and cost-effective scaling. It helps brands reach their specific audience based on demographics, interests, and behaviors, leading to higher conversion rates."
          },
          {
            question: "How does digital media buying work?",
            answer: "The process involves identifying campaign goals, selecting the right platforms, setting up advanced targeting, and continuous optimization of ad creative and spend to maximize performance."
          },
          {
            question: "What are most used digital media buying platforms in Bangladesh?",
            answer: "In Bangladesh, the most widely used platforms are Facebook, Google (Search & Display), YouTube, Instagram, and LinkedIn. Programmatic platforms like Eskimi are also popular for local reach."
          }
        ]}
      />
      <CTASection />
    </>
  );
}
