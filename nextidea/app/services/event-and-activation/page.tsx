import { Sparkles, TrendingUp, Megaphone, Headphones } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import CTASection from "../../components/CTASection";

export const metadata = {
  title: "Event & Activation | Next Idea Solutions",
  description: "We have the power to create happening events that guarantee maximum footfall. Create memorable brand experiences.",
};

export default function EventAndActivationPage() {
  return (
    <>
      <ServiceHero
        icon={Megaphone}
        title="Event & Activation"
        tagline="Creating Unforgettable Brand Experiences"
        description="We have the power to create impactful events and activations that drive maximum engagement and create lasting brand memories."
      />
      <ServiceContent
        overview={{
          title: "About This Service",
          description: "Our Event & Activation service brings your brand to life through immersive experiences that engage audiences on a deeper level. From corporate events to product launches and experiential marketing activations, we handle every aspect of planning and execution. Our team creates memorable moments that not only generate immediate buzz but also build long-term brand loyalty and advocacy.",
        }}
        features={{
          title: "What&apos;s Included",
          items: [
            "Event Strategy & Planning",
            "Venue Selection & Management",
            "Event Design & Production",
            "Brand Activation Experiences",
            "Experiential Marketing",
            "Event Marketing & Promotion",
            "On-site Management",
            "Post-event Analysis & Reporting",
          ],
        }}
        process={{
          title: "Our Process",
          steps: [
            {
              title: "Event Strategy",
              description: "We define clear objectives and develop a strategic approach aligned with your brand goals.",
            },
            {
              title: "Creative Concept",
              description: "Our team develops innovative concepts that will create memorable experiences for attendees.",
            },
            {
              title: "Planning & Production",
              description: "We handle all logistics, vendor management, and production details.",
            },
            {
              title: "Execution & Management",
              description: "Our team ensures flawless on-site execution and guest experience.",
            },
          ],
        }}
        relatedServices={[
          { title: "Creative Concept", link: "/services/creative-concept-execution", icon: Sparkles },
          { title: "Video Production", link: "/services/video-production-photography", icon: Headphones },
          { title: "Digital Media Buying", link: "/services/digital-media-buying", icon: TrendingUp },
        ]}
      />
      <CTASection />
    </>
  );
}
