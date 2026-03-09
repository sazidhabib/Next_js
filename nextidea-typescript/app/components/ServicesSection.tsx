import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  Megaphone,
  Palette,
  Code2,
  Headphones,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: Sparkles,
    title: "Creative Concept & Execution",
    description:
      "Expert Conceptualization and Impeccable Execution for Your Brand.",
    link: "/services/creative-concept-execution",
  },
  {
    icon: TrendingUp,
    title: "Media Buying",
    description:
      "We offer funnel driven media buying solution that generates higher ROI for your company.",
    link: "/services/digital-media-buying",
  },
  {
    icon: Palette,
    title: "Brand Identity",
    description:
      "We help creating strong brand identity that will separate you from the noise.",
    link: "/services/brand-identity",
  },
  {
    icon: Code2,
    title: "Web Design & Development",
    description:
      "We excel in creating user friendly high converting landing page, website, or app.",
    link: "/services/web-design-development",
  },
  {
    icon: Megaphone,
    title: "Event & Activation",
    description:
      "We have the power to create happening events to guarantee you the maximum footfall.",
    link: "/services/event-and-activation",
  },
  {
    icon: Headphones,
    title: "Video Production & Photography",
    description:
      "We provide engaging and high-end video & photography services for your business.",
    link: "/services/video-production-photography",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-surface-dark text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-widest text-[#Eaeaea]">
            What We Do
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-[#27272a] hover:bg-[#3f3f46] transition-all duration-300 border border-zinc-800 hover:border-primary/50 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <service.icon className="w-24 h-24 text-white" />
              </div>

              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <service.icon className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors">
                {service.title}
              </h3>

              <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                {service.description}
              </p>

              <Link
                href={service.link}
                className="inline-flex items-center text-primary text-sm font-semibold group-hover:tracking-wider transition-all"
              >
                View Details <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
