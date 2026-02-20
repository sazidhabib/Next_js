import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { HeroSlider } from "@/components/ui/HeroSlider";
import { ArrowRight, Trophy, Users, Building, ShieldCheck } from "lucide-react";

export default function Home() {
  const featuredProjects = [
    {
      id: "1",
      title: "The Oasis Residences",
      location: "Gulshan, Dhaka",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
      price: "Start from $1,200,000",
      beds: 4,
      baths: 4,
      sqft: 3500,
      status: "Ongoing" as const,
    },
    {
      id: "2",
      title: "Azure Commercial Skyline",
      location: "Banani, Dhaka",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      price: "Contact for Details",
      status: "Ready" as const,
    },
    {
      id: "3",
      title: "Crescent Lake Villas",
      location: "Bashundhara R/A",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      price: "Sold Out",
      beds: 5,
      baths: 6,
      sqft: 4800,
      status: "Ready" as const,
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <HeroSlider />

        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center flex flex-col items-center">
          <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-6 block border-b border-primary/30 pb-2">
            Welcome to EstatePro
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground leading-tight mb-8">
            Elevating <span className="text-primary italic">Luxury</span> <br /> Living
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-12 font-light tracking-wide leading-relaxed">
            Discover a curated selection of exquisite residences and commercial spaces, designed for those who appreciate the extraordinary.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Button size="lg" className="px-12">
              Explore Projects
            </Button>
            <Button size="lg" variant="outline" className="px-12">
              Contact Us
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center animate-bounce">
          <span className="text-xs text-foreground uppercase tracking-widest mb-2 font-medium">Scroll</span>
          <div className="w-[1px] h-12 bg-primary"></div>
        </div>
      </section>

      {/* About Company Summary */}
      <section className="py-24 lg:py-32 bg-background relative border-t border-border dark:border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary font-bold tracking-[0.15em] uppercase text-sm mb-4 block">The Legacy</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-8 leading-tight">
                Crafting Architectural Masterpieces Since 1995
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                EstatePro is synonymous with innovation, quality, and architectural brilliance in the real estate sector. With over two decades of experience, we have transformed city skylines and delivered premium lifestyles.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-10">
                Our uncompromising commitment to perfection, use of high-end materials, and dedication to timely delivery make us the most trusted name in luxury real estate.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 text-primary font-semibold uppercase tracking-widest hover:text-foreground transition-colors duration-300">
                Discover Our Story <ArrowRight size={18} />
              </Link>
            </div>

            <div className="relative h-[600px] w-full hidden lg:block border border-border dark:border-white/10 p-2">
              <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1083&q=80"
                alt="Corporate Building"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 lg:py-32 bg-background relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <span className="text-primary font-bold tracking-[0.15em] uppercase text-sm mb-4 block">Portfolio</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                Featured Properties
              </h2>
              <p className="text-muted-foreground text-lg">
                Explore our signature developments combining elegant design with state-of-the-art amenities.
              </p>
            </div>
            <Button variant="outline" className="shrink-0">
              View All Projects
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <PropertyCard key={project.id} {...project} />
            ))}
          </div>
        </div>
      </section>

      {/* Statistics / Trust Indicators */}
      <section className="py-24 bg-background border-y border-border dark:border-white/10 relative overflow-hidden">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
            <div className="flex flex-col items-center justify-center p-8 border border-border dark:border-white/5 bg-background/40 backdrop-blur-sm">
              <Trophy className="text-primary mb-6" size={40} />
              <h4 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-4">25+</h4>
              <p className="text-muted-foreground uppercase tracking-wider text-sm font-medium">Years of Experience</p>
            </div>

            <div className="flex flex-col items-center justify-center p-8 border border-border dark:border-white/5 bg-background/40 backdrop-blur-sm">
              <Building className="text-primary mb-6" size={40} />
              <h4 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-4">150+</h4>
              <p className="text-muted-foreground uppercase tracking-wider text-sm font-medium">Projects Delivered</p>
            </div>

            <div className="flex flex-col items-center justify-center p-8 border border-border dark:border-white/5 bg-background/40 backdrop-blur-sm">
              <Users className="text-primary mb-6" size={40} />
              <h4 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-4">8k+</h4>
              <p className="text-muted-foreground uppercase tracking-wider text-sm font-medium">Happy Families</p>
            </div>

            <div className="flex flex-col items-center justify-center p-8 border border-border dark:border-white/5 bg-background/40 backdrop-blur-sm">
              <ShieldCheck className="text-primary mb-6" size={40} />
              <h4 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-4">100%</h4>
              <p className="text-muted-foreground uppercase tracking-wider text-sm font-medium">Handover Accuracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-primary/20"></div>
        <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-8">
            Ready to Find Your Dream Masterpiece?
          </h2>
          <p className="text-xl text-foreground/80 mb-10 font-light leading-relaxed">
            Get in touch with our expert consultants today to schedule an exclusive viewing of our premium properties.
          </p>
          <Button size="lg" className="px-16" variant="primary">
            Schedule a Consultation
          </Button>
        </div>
      </section>
    </div>
  );
}
