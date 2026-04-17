import { Target, Cpu, Settings, Trophy, FileText, Star, Palette, TrendingUp, Headphones, Sparkles } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import CTASection from "../../components/CTASection";
import CaseStudySection from "../../components/CaseStudySection";

export const metadata = {
  title: "Creative Concept & Execution | Next Idea Solutions",
  description: "Elevate your brand with Next Idea Solutions' creative service that blends strategy, design, and technology to bring your concept to life.",
};

export default function CreativeConceptExecutionPage() {
  return (
    <>
      <ServiceHero
        icon={<Sparkles />}
        title="Creative Concept & Execution"
        tagline="Elevate your brand with Next Idea Solutions' creative service that blends strategy, design, and technology to bring your concept to life."
        description="At Next Idea Solutions, we believe in the power of creativity to transform brands. Our Creative Concept & Execution service is tailored to craft innovative, impactful, and memorable campaigns that resonate with your audience."
        image="/creative-concepth.png"
      />
      <ServiceContent
        overview={{
          title: "About This Service",
          description: "At Next Idea Solutions, we believe in the power of creativity to transform brands. Our Creative Concept & Execution service is tailored to craft innovative, impactful, and memorable campaigns that resonate with your audience. We merge creativity with strategic insights to develop concepts that align with your brand's goals and values.",
        }}
        features={{
          title: "WHAT SETS US APART",
          items: [
            {
              icon: <Target className="w-4 h-4" />,
              text: "Strategic Creativity: We merge creativity with strategic insights to develop concepts that align with your brand's goals and values."
            },
            {
              icon: <Cpu className="w-4 h-4" />,
              text: "Holistic Approach: From ideation to execution, our team ensures a seamless creative process, encompassing diverse media channels and platforms."
            },
            {
              icon: <Settings className="w-4 h-4" />,
              text: "Tailored Solutions: Every brand is unique, and we customize our creative strategies to meet your specific needs and capture your audience's attention."
            },
          ],
        }}
        process={{
          title: "WHAT WE OFFER",
          steps: [
            {
              title: "Creative Campaigns",
              description: "Our team designs captivating campaigns that engage your audience across digital and traditional platforms.",
              icon: <Trophy className="w-6 h-6" />,
            },
            {
              title: "Content Creation",
              description: "We craft compelling content, including visuals, copy, and multimedia, to convey your brand's story effectively.",
              icon: <FileText className="w-6 h-6" />,
            },
            {
              title: "Brand Messaging",
              description: "We refine your brand's messaging to deliver a clear, consistent, and impactful narrative.",
              icon: <Star className="w-6 h-6" />,
            },
          ],
        }}
        relatedServices={[
          { title: "Brand Identity", link: "/services/brand-identity", icon: <Palette /> },
          { title: "Digital Media Buying", link: "/services/digital-media-buying", icon: <TrendingUp /> },
          { title: "Video Production", link: "/services/video-production-photography", icon: <Headphones /> },
        ]}
      />
      <CaseStudySection />
      <CTASection
        title="Embark on a creative journey with Next Idea Solutions."
        description="Let's craft a narrative that captivates and converts."
        buttonText="Ask for A Proposal"
      />
    </>
  );
}
