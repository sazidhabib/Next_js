import { LucideIcon } from "lucide-react";

interface ServiceHeroProps {
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
}

export default function ServiceHero({
  icon: Icon,
  title,
  tagline,
  description,
}: ServiceHeroProps) {
  return (
    <section className="relative py-24 md:py-32 bg-surface-dark overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 text-primary mb-8">
            <Icon className="w-10 h-10" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {title}
          </h1>

          <p className="text-xl md:text-2xl text-primary font-medium mb-6">
            {tagline}
          </p>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
