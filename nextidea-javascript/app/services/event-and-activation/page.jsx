import { Sparkles, TrendingUp, Megaphone, Headphones, Palette, Target, CheckCircle } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import ClientsSection from "../../components/ClientsSection";
import FAQSection from "../../components/FAQSection";
import CTASection from "../../components/CTASection";

export const metadata = {
  title: "Event & Activation | Next Idea Solution",
  description: "Next Idea Solution is the power to create happening events to guarantee you the maximum footfall. Experience unforgettable events with our comprehensive event & activation service.",
};

export default function EventAndActivationPage() {
  return (
    <>
      <ServiceHero
        icon={<Megaphone />}
        title="Event & Activation"
        tagline="Next Idea Solution is the power to create happening events to guarantee you the maximum footfall"

        image="/Event-Activation.png"
      />
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                About Event & <span className="text-primary">Activation</span>
              </h2>
              <p className="text-lg font-bold text-zinc-600 mb-8 leading-relaxed">
                Experience Unforgettable Events with Next Idea Solution's Event & Activation Service.
              </p>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                At Next Idea Solution, we specialize in turning concepts into remarkable events and activations that leave a lasting impression on your audience ensuring your brand stands out in the crowd.
              </p>
              <button className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                GET A FREE QUOTE
              </button>
            </div>
            <div className="md:w-1/2">
              <img
                src="/event2.jpeg"
                alt="Local SEO Illustration"
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
          title: "Why Choose Us",
          items: [
            {
              icon: <Palette className="w-6 h-6" />,
              title: "Creative Approach",
              description: "We infuse creativity into every event, ensuring it aligns with your brand's identity and goals.",
            },
            {
              icon: <Target className="w-6 h-6" />,
              title: "Strategic Planning",
              description: "Our meticulous planning and execution guarantees flawless events that resonate with your audience.",
            },
            {
              icon: <CheckCircle className="w-6 h-6" />,
              title: "Diverse Offerings",
              description: "From product launches to brand activations, we cater to a wide range of event needs.",
            },
          ],
        }}
        process={{
          title: "What We Bring to the Table",
          steps: [
            {
              title: "Strategic Planning",
              description: "We plan every detail with your objectives in mind, ensuring seamless execution.",
            },
            {
              title: "Engagement Strategies",
              description: "From product launches to brand activations, we design experiences that captivate your audience.",
            },
            {
              title: "Measurable Impact",
              description: "We track and analyze event performance, providing valuable insights for future strategies.",
            },
          ],
        }}
        relatedServices={[
          { title: "Creative Concept", link: "/services/creative-concept-execution", icon: <Headphones /> },
          { title: "Video Production", link: "/services/video-production-photography", icon: <Sparkles /> },
          { title: "Digital Media Buying", link: "/services/digital-media-buying", icon: <TrendingUp /> },
        ]}
      />
      <ClientsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
