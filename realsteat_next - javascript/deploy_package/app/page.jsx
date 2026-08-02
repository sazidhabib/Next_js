"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { HeroSlider } from "@/components/ui/HeroSlider";
import { ArrowRight, Trophy, Users, Building, ShieldCheck } from "lucide-react";
import { LocationsSection } from "@/components/ui/LocationsSection";
import { TopPropertiesSection } from "@/components/ui/TopPropertiesSection";
import { TestimonialsSection } from "@/components/ui/TestimonialsSection";
import { SearchSection } from "@/components/ui/SearchSection";
import { useState, useEffect } from "react";

const IconMap = {
  Trophy: Trophy,
  Building: Building,
  Users: Users,
  ShieldCheck: ShieldCheck
};

export default function Home() {
  const [settings, setSettings] = useState(null);
  const [heroImages, setHeroImages] = useState([]);
  const [aboutData, setAboutData] = useState(null);

  let stats = [];
  try {
    stats = settings?.homepage_statistics
      ? (typeof settings.homepage_statistics === 'string' ? JSON.parse(settings.homepage_statistics) : settings.homepage_statistics)
      : [];
  } catch (e) { }
  if (!stats || stats.length === 0) {
    stats = [
      { value: "25+", label: "Years of Experience", icon: "Trophy" },
      { value: "150+", label: "Projects Delivered", icon: "Building" },
      { value: "8k+", label: "Happy Families", icon: "Users" },
      { value: "100%", label: "Handover Accuracy", icon: "ShieldCheck" }
    ];
  }

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/settings`);
        if (res.ok) {
          const data = await res.json();
          setSettings(data);

          if (data.hero_images) {
            try {
              const imgs = typeof data.hero_images === 'string'
                ? JSON.parse(data.hero_images)
                : data.hero_images;
              setHeroImages(Array.isArray(imgs) ? imgs : []);
            } catch (e) {
              setHeroImages([]);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };

    const fetchAboutData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/pages/about_us`);
        if (res.ok) {
          const data = await res.json();
          setAboutData(data);
        }
      } catch (err) {
        console.error("Failed to fetch about data", err);
      }
    };

    fetchSettings();
    fetchAboutData();
  }, []);

  const [featuredProjects, setFeaturedProjects] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
        const res = await fetch(`${apiUrl}/frames`);
        if (res.ok) {
          const data = await res.json();
          const active = data
            .filter(p => (p.status === "active" || p.status === "pending") && (p.is_featured === 1 || p.is_featured === true))
            .sort((a, b) => new Date(b.featured_clicked_at) - new Date(a.featured_clicked_at))
            .slice(0, 6);
          const mapped = active.map(p => {
            let img = p.image_url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80";
            if (p.images) {
              try {
                const parsed = typeof p.images === "string" ? JSON.parse(p.images) : p.images;
                if (Array.isArray(parsed) && parsed.length > 0) {
                  img = parsed[0];
                }
              } catch (e) { }
            }
            return {
              id: String(p.id),
              title: p.title,
              location: p.location,
              image: img,
              price: p.price || "Contact for Price",
              beds: p.bedrooms,
              baths: p.bathrooms,
              sqft: p.sqft,
              status: p.status === "active" ? "Ready" : "Ongoing",
            };
          });
          setFeaturedProjects(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch featured projects:", err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <HeroSlider images={heroImages} />

        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center flex flex-col items-center">
          <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-6 block border-b border-primary/30 pb-2">
            Welcome to {settings?.site_name || "PRESIDENT PROPERTIES"}
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground leading-tight mb-8">
            {settings?.hero_title ? (
              <span dangerouslySetInnerHTML={{ __html: settings.hero_title.replace(/\n/g, '<br />') }} />
            ) : (
              <>Elevating <span className="text-primary italic">Luxury</span> <br /> Living</>
            )}
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-12 font-light tracking-wide leading-relaxed">
            {settings?.hero_description || "Discover a curated selection of exquisite residences and commercial spaces, designed for those who appreciate the extraordinary."}
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Button size="lg" className="px-12"><Link href="/projects">Explore Projects</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-12"><Link href="/contact">Contact Us</Link>
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
              <span className="text-primary font-bold tracking-[0.15em] uppercase text-sm mb-4 block">
                {aboutData?.subtitle || "The Legacy"}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-8 leading-tight">
                {aboutData?.title || "Crafting Architectural Masterpieces Since 1995"}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {aboutData?.content ? aboutData.content.split("\n\n")[0] : "PRESIDENT PROPERTIES is synonymous with innovation, quality, and architectural brilliance in the real estate sector. With over two decades of experience, we have transformed city skylines and delivered premium lifestyles."}
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-10">
                {aboutData?.content ? aboutData.content.split("\n\n")[1] : "Our uncompromising commitment to perfection, use of high-end materials, and dedication to timely delivery make us the most trusted name in luxury real estate."}
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 text-primary font-semibold uppercase tracking-widest hover:text-foreground transition-colors duration-300">
                Discover Our Story <ArrowRight size={18} />
              </Link>
            </div>

            <div className="relative h-[600px] w-full hidden lg:block border border-border dark:border-white/10 p-2">
              <Image
                src={aboutData?.image_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1083&q=80"}
                alt="Corporate Building"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <SearchSection />

      {/* Featured Projects */}
      <section className="py-24 lg:py-32 bg-background relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <span className="text-primary font-bold tracking-[0.15em] uppercase text-sm mb-4 block">Portfolio</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                Featured Projects
              </h2>
              <p className="text-muted-foreground text-lg">
                Explore our signature developments combining elegant design with state-of-the-art amenities.
              </p>
            </div>
            <Button variant="outline" className="shrink-0">
              <Link href="/projects">View All Projects</Link>

            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <PropertyCard key={project.id} {...project} />
            ))}
          </div>
        </div>
      </section>

      <LocationsSection />


      {/* Statistics / Trust Indicators */}
      <section className="py-24 bg-background border-y border-border dark:border-white/10 relative overflow-hidden">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
            {stats.map((stat, idx) => {
              const IconComponent = IconMap[stat.icon] || Trophy;
              return (
                <div key={idx} className="flex flex-col items-center justify-center p-8 border border-border dark:border-white/5 bg-background/40 backdrop-blur-sm">
                  <IconComponent className="text-primary mb-6" size={40} />
                  <h4 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-4">{stat.value}</h4>
                  <p className="text-muted-foreground uppercase tracking-wider text-sm font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <TopPropertiesSection />
      <TestimonialsSection />

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
