import { Sparkles, Code2, Megaphone, Headphones } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import CTASection from "../../components/CTASection";

export const metadata = {
  title: "Video Production & Photography | Next Idea Solutions",
  description: "We provide engaging and high-end video and photography services for your business. Professional content that tells your story.",
};

export default function VideoProductionPhotographyPage() {
  return (
    <>
      <ServiceHero
        icon={Headphones}
        title="Video Production & Photography"
        tagline="Professional Content That Tells Your Story"
        description="We provide engaging, high-end video and photography services that capture your brand's essence and communicate your message effectively."
      />
      <ServiceContent
        overview={{
          title: "About This Service",
          description: "Our Video Production & Photography service delivers professional visual content that elevates your brand and engages your audience. Whether you need compelling video campaigns, stunning product photography, corporate videos, or social media content, our team of creative professionals uses state-of-the-art equipment and techniques to produce content that exceeds expectations and achieves your marketing objectives.",
        }}
        features={{
          title: "What&apos;s Included",
          items: [
            "Video Production (Commercials, Campaigns)",
            "Corporate Video Production",
            "Product Photography",
            "Event Coverage",
            "Social Media Content Creation",
            "Post-production & Editing",
            "Motion Graphics & Animation",
            "Drone Aerial Photography/Videography",
          ],
        }}
        process={{
          title: "Our Process",
          steps: [
            {
              title: "Pre-production",
              description: "We develop concepts, scripts, storyboards, and plan all logistics before the shoot.",
            },
            {
              title: "Production",
              description: "Our professional crew captures high-quality footage and photographs using industry-standard equipment.",
            },
            {
              title: "Post-production",
              description: "We edit, color grade, add motion graphics, and polish the content to perfection.",
            },
            {
              title: "Delivery",
              description: "We deliver final assets in all required formats optimized for your intended platforms.",
            },
          ],
        }}
        relatedServices={[
          { title: "Creative Concept", link: "/services/creative-concept-execution", icon: Sparkles },
          { title: "Event & Activation", link: "/services/event-and-activation", icon: Megaphone },
          { title: "Web Development", link: "/services/web-design-development", icon: Code2 },
        ]}
      />
      <CTASection />
    </>
  );
}
