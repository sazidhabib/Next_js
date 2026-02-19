import Link from "next/link";
import {
  Sparkles,
  Palette,
  Code2,
  TrendingUp,
  Megaphone,
  Headphones,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: Sparkles,
    title: "Brand Strategy",
    description:
      "We define your brand's core identity, positioning, and messaging to create a compelling market presence.",
    link: "/services/brand-strategy",
  },
  {
    icon: Palette,
    title: "Creative Design",
    description:
      "From logos to complete visual identities, we craft designs that capture your brand essence.",
    link: "/services/creative-design",
  },
  {
    icon: Code2,
    title: "Web Development",
    description:
      "Custom websites and web applications built with cutting-edge technologies for optimal performance.",
    link: "/services/web-development",
  },
  {
    icon: TrendingUp,
    title: "Digital Marketing",
    description:
      "Data-driven campaigns across SEO, PPC, and social media to maximize your digital reach.",
    link: "/services/digital-marketing",
  },
  {
    icon: Megaphone,
    title: "Content Strategy",
    description:
      "Strategic content creation that engages audiences and drives meaningful conversions.",
    link: "/services/content-strategy",
  },
  {
    icon: Headphones,
    title: "Creative Concept & Execution",
    description:
      "End-to-end creative development from initial concept to flawless execution across all channels.",
    link: "/creative_concept",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
            What We Do
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Comprehensive digital solutions tailored to transform your brand and
            drive measurable business growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link
              key={index}
              href={service.link}
              className="group p-8 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <service.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
              </div>

              <h3 className="text-xl font-semibold text-zinc-900 mb-3 group-hover:text-primary transition-colors">
                {service.title}
              </h3>

              <p className="text-zinc-600 mb-4">{service.description}</p>

              <div className="flex items-center gap-2 text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Learn More
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
