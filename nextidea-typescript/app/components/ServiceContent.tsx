import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ServiceContentProps {
  overview: {
    title: string;
    description: string;
  };
  features: {
    title: string;
    items: string[];
  };
  process?: {
    title: string;
    steps: { title: string; description: string }[];
  };
  relatedServices?: {
    title: string;
    link: string;
    icon: LucideIcon;
  }[];
}

export default function ServiceContent({
  overview,
  features,
  process,
  relatedServices,
}: ServiceContentProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Overview */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-zinc-900 mb-6">
            {overview.title}
          </h2>
          <p className="text-lg text-zinc-600 leading-relaxed">
            {overview.description}
          </p>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-zinc-900 mb-8">
            {features.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.items.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-zinc-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        {process && (
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-zinc-900 mb-8">
              {process.title}
            </h2>
            <div className="space-y-6">
              {process.steps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-6 p-6 rounded-2xl bg-zinc-50"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-zinc-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Services */}
        {relatedServices && relatedServices.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-zinc-900 mb-8 text-center">
              Related Services
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedServices.map((service, index) => (
                <Link
                  key={index}
                  href={service.link}
                  className="group p-6 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors border border-zinc-200 hover:border-primary/50"
                >
                  <service.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-lg font-bold text-zinc-900 mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <div className="flex items-center text-primary text-sm font-medium">
                    Learn More <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
