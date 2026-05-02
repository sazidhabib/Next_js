import { Sparkles, Code2, Megaphone, Headphones } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import ClientsSection from "../../components/ClientsSection";
import FAQSection from "../../components/FAQSection";
import CTASection from "../../components/CTASection";
import { getSettings } from "../../lib/getSettings";

export const metadata = {
  title: "Video Production & Photography | Next Idea Solutions",
  description: "We provide engaging and high-end video and photography services for your business. Professional content that tells your story.",
};

export default async function VideoProductionPhotographyPage() {
  const settings = await getSettings();

  return (
    <>
      <ServiceHero
        icon={<Sparkles />}
        title={settings.service_video_production_photography_hero_title}
        tagline={settings.service_video_production_photography_hero_tagline}
        buttonText="Explore Our Service"
        image={settings.service_video_production_photography_hero_image || "/Video-Production.png"}
      />
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                {settings.service_video_production_photography_about_title}
              </h2>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                {settings.service_video_production_photography_about_desc}
              </p>
              <button className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                GET A FREE QUOTE
              </button>
            </div>
            <div className="md:w-1/2">
              <img
                src={settings.service_video_production_photography_about_image || "/video_photography.jpeg"}
                alt="Video Production Photography"
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
      <ServiceContent
        overview={{
          title: "",
          description: "",
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
          { title: "Creative Concept", link: "/services/creative-concept-execution", icon: <Headphones /> },
          { title: "Event & Activation", link: "/services/event-and-activation", icon: <Megaphone /> },
          { title: "Web Development", link: "/services/web-design-development", icon: <Code2 /> },
        ]}
      />
      <ClientsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
