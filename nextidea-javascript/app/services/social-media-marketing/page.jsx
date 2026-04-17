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
        description="Staying on top of social media is an effective way to build people's trust and help you establish as a prominent brand over time. We help brands tell their story with strategic, creative social media posts, videos, stories, and reels."
        image="/Social-Media.png"
      />
      <ServiceContent
        overview={{
          title: "About This Service",
          description: "Social media marketing is the new word-of-mouth. Staying on top of social media is an effective way to build people's trust and can help you establish as a prominent brand over time. We take a results-oriented approach to generate more engagement, increase your reach, drive more website traffic, and support your broader business objectives through social media. Connect with your audience with strategic social media marketing. Develop a social media marketing strategy that will build your brand, boost your exposure, amplify your SEO, and help you grow your business.",
        }}
        features={{
          title: "What's Included",
          items: [
            { icon: <Target className="w-4 h-4" />, text: "Monthly Strategy Development" },
            { icon: <Calendar className="w-4 h-4" />, text: "Monthly Content Calendar" },
            { icon: <Megaphone className="w-4 h-4" />, text: "Media Buying (Running & Optimizing Paid Ads)" },
            { icon: <TrendingUp className="w-4 h-4" />, text: "Sales Funnel Development & Monitoring" },
            { icon: <Palette className="w-4 h-4" />, text: "Design, Video & Animation Strategies" },
            { icon: <Users className="w-4 h-4" />, text: "Community Engagement & Management" },
          ],
        }}
        relatedServices={[
          { title: "Digital Media Buying", link: "/services/digital-media-buying", icon: <TrendingUp /> },
          { title: "Creative Concept", link: "/services/creative-concept-execution", icon: <Target /> },
          { title: "Brand Identity", link: "/services/brand-identity", icon: <Users /> },
        ]}
      />
      <ClientsSection />
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
      <FAQSection 
        items={[
          {
            question: "Why use social media advertising?",
            answer: "Investing in social media advertising can help your company in several ways, including: 1. Reach your target audience effectively where they spend 30% of their time. 2. Generate brand awareness through smart funnel strategies. 3. Promote products or services with seasonal campaigns that drive immediate revenue."
          },
          {
            question: "What is Social Media Marketing?",
            answer: "Social media marketing is the use of social media platforms to connect with your audience to build your brand, increase sales, and drive website traffic. This involves publishing great content on your social media profiles, listening to and engaging your followers, analyzing your results, and running social media advertisements."
          },
          {
            question: "Which social media channel has the most users?",
            answer: "Facebook remains the platform with the highest number of active users worldwide and in Bangladesh, followed by platforms like YouTube, Instagram, and LinkedIn depending on the specific demographic target."
          },
          {
            question: "How effective is social media marketing?",
            answer: "It is highly effective for building trust, establishing brand authority, and maintaining a direct line of communication with customers. When combined with paid advertising, it offers one of the highest ROIs in digital marketing."
          },
          {
            question: "What are top social media platforms in Bangladesh?",
            answer: "The top platforms are Facebook, YouTube, Instagram, and LinkedIn. Increasingly, TikTok and Pinterest are also becoming valuable for specific niche markets."
          }
        ]}
      />
      <CTASection />
    </>
  );
}
