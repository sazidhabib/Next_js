import { Search, BarChart2, Code, MapPin, ShoppingCart, Smartphone, Zap, Check, ArrowRight, CheckCircle, Star, TrendingUp, Target, Award, FileText } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import PackagesSection from "../../components/PackagesSection";
import CTASection from "../../components/CTASection";
import FAQSection from "../../components/FAQSection";
import BlogsSection from "../../components/BlogsSection";
import SEOProcess from "../../components/SEOProcess";
import SEOTabbedServices from "../../components/SEOTabbedServices";
import CaseStudySection from "../../components/CaseStudySection";
import ClientsSection from "../../components/ClientsSection";
import { getSettings } from "../../lib/getSettings";
import { notFound } from "next/navigation";

// Icon mapping for rendering
const ICON_MAP = {
  Search: <Search />,
  BarChart2: <BarChart2 />,
  Code: <Code />,
  MapPin: <MapPin />,
  ShoppingCart: <ShoppingCart />,
  Smartphone: <Smartphone />,
  Zap: <Zap />,
  Check: <Check />,
  TrendingUp: <TrendingUp />,
  Target: <Target />,
  Award: <Award />,
  FileText: <FileText />,
};

export async function generateMetadata() {
  const settings = await getSettings();
  
  return {
    title: settings.service_seo_meta_title || "SEO Services | Next Idea Solutions",
    description: settings.service_seo_meta_description || settings.service_seo_hero_tagline || "Future-Proof Your Visibility With The Best SEO Agency in Bangladesh",
  };
}

export default async function SEOPage() {
  const settings = await getSettings();

  if (!settings) return notFound();

  // Helper for parsing JSON safely
  const parseJson = (val, fallback = []) => {
    if (!val) return fallback;
    try {
      return typeof val === 'string' ? JSON.parse(val) : val;
    } catch (e) {
      console.error("Error parsing JSON setting:", e);
      return fallback;
    }
  };

  return (
    <>
      <ServiceHero
        icon={<Search />}
        title={settings.service_seo_hero_title || "SEO Services"}
        tagline={settings.service_seo_hero_tagline || "Future-Proof Your Visibility With The Best SEO Agency in Bangladesh"}
        description={settings.service_seo_hero_desc || "At Next Idea solution, we specialize in turning concepts into remarkable SEO strategies that leave a lasting impression on your visibility ensuring your brand stands out in search results."}
        image={settings.service_seo_hero_image || "/SEO-Services.jpg"}
      />

      {/* Marquee Services Section */}
      <section className="py-12 bg-white text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-8 text-lg font-semibold text-zinc-400">OUR SEO SERVICES</h2>
          <div className="flex overflow-hidden">
            <div className="flex gap-8 animate-scroll whitespace-nowrap">
              {[
                { icon: <Search className="w-6 h-6" />, text: "SEO Audits & Analysis" },
                { icon: <BarChart2 className="w-6 h-6" />, text: "Keyword Research" },
                { icon: <Code className="w-6 h-6" />, text: "On-Page SEO Optimization" },
                { icon: <TrendingUp className="w-6 h-6" />, text: "Off-Page SEO & Link Building" },
                { icon: <Zap className="w-6 h-6" />, text: "Technical SEO" },
                { icon: <MapPin className="w-6 h-6" />, text: "Local SEO" },
                { icon: <ShoppingCart className="w-6 h-6" />, text: "E-commerce SEO" },
                { icon: <Smartphone className="w-6 h-6" />, text: "App Store Optimization (ASO)" },
              ].map((service, index) => (
                <div key={index} className="px-6 py-3 border border-primary/40 rounded-full text-primary font-bold hover:border-primary transition-colors flex items-center gap-2">
                  {service.icon}
                  {service.text}
                </div>
              ))}
              {[
                { icon: <Search className="w-6 h-6" />, text: "SEO Audits & Analysis" },
                { icon: <BarChart2 className="w-6 h-6" />, text: "Keyword Research" },
                { icon: <Code className="w-6 h-6" />, text: "On-Page SEO Optimization" },
                { icon: <TrendingUp className="w-6 h-6" />, text: "Off-Page SEO & Link Building" },
              ].map((service, index) => (
                <div key={`repeat-${index}`} className="px-6 py-3 border border-primary/40 rounded-full text-primary font-medium hover:border-primary transition-colors flex items-center gap-2">
                  {service.icon}
                  {service.text}
                </div>
              ))}
            </div>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll 40s linear infinite;
          }
        `}} />
      </section>

      {/* About SEO Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                {settings.service_seo_about_title || "OUR SEO SERVICES"}
              </h2>
              <p className="text-lg font-bold text-zinc-600 mb-8 leading-relaxed">
                {settings.service_seo_about_subtitle || "Your Customers Are Searching For You On Google, But You Don't Know"}
              </p>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                {settings.service_seo_about_desc || "In this age where customers search online to gather information and then make a purchase decision, you're losing sales if you're not present in front of their eyes when they're searching. Our SEO strategies are built to align with search engine priorities: helpfulness, authority, and relevance."}
              </p>
              <button className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                GET A FREE QUOTE
              </button>
            </div>
            <div className="md:w-1/2">
              <img
                src={settings.service_seo_about_image || "/seo.jpeg"}
                alt="About SEO"
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SEO Process Section */}
      <SEOProcess 
        title={settings.service_seo_process_title || "How We Work?"}
        steps={parseJson(settings.service_seo_process)}
      />

      {/* Stay Visible Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-zinc-900 mb-6">
                {settings.service_seo_stay_visible_title || "Stay Visible In A Search Landscape Shaped By AI"}
              </h2>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                {settings.service_seo_stay_visible_desc || "Search is evolving faster than ever. With AI-powered results and personalization, ranking on Google is no longer just about keywords. It's about delivering real value and being visible where your customers search."}
              </p>
              <ul className="space-y-4">
                {[
                  "AI-driven search optimization for emerging platforms",
                  "Future-ready strategies that adapt to algorithm changes",
                  "Content that ranks in both traditional and AI-powered results",
                  "Competitive analysis in the AI era",
                ].map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <span className="text-zinc-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img src={settings.service_seo_stay_visible_image || "/SEO-Services.jpg"} alt="Stay Visible" className="w-full rounded-2xl shadow-2xl" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur p-6 rounded-xl">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">93%</div>
                  <p className="text-sm text-zinc-700">of online experiences begin with a search engine</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabbed Services Section */}
      <SEOTabbedServices 
        title={settings.service_seo_tabbed_services_title || "End-To-End SEO Services Built For The AI-Powered Search Era"}
        description={settings.service_seo_tabbed_services_desc || "Search isn't just about blue links anymore. With AI Overviews and smarter search algorithms changing how people find answers, your brand needs more than traditional SEO—it needs strategy that's built for how search works now."}
        servicesTabs={parseJson(settings.service_seo_tabbed_services)}
      />

      {/* Hire The Best SEO Agency Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900 mb-4">{settings.service_seo_hire_title || "Hire The Best SEO Agency in Bangladesh"}</h2>
            <p className="text-lg text-zinc-600">{settings.service_seo_hire_desc || "Trusted by leading brands and startups alike, we've helped hundreds of businesses achieve top search rankings and drive sustainable growth."}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {parseJson(settings.service_seo_hire_reviews).map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-zinc-50 to-zinc-100 p-8 rounded-xl border border-zinc-200 hover:border-primary/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-zinc-900">{item.company}</h3>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(item.rating) ? "fill-primary text-primary" : "text-zinc-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-zinc-600 mb-4">{item.reviews} verified reviews</p>
                <p className="text-zinc-700 italic">{item.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CaseStudySection />

      {/* Why Choose Us Section */}
      <section className="py-20 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900 mb-4">{settings.service_seo_why_title || "Why Choose Us As Your SEO Company in Bangladesh"}</h2>
            <p className="text-lg text-zinc-600">{settings.service_seo_why_desc || "We combine expertise, innovation, and proven results to deliver SEO strategies that drive sustainable growth for your business."}</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {parseJson(settings.service_seo_why_choose_us).map((item, index) => (
              <div key={index} className="p-6 bg-white rounded-xl border border-zinc-200 hover:border-primary/50 hover:shadow-lg transition-all text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                  {ICON_MAP[item.icon] || <TrendingUp />}
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Unique Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900 mb-4">{settings.service_seo_unique_title || "What's Unique About Next Idea's SEO? As An SEO Agency in Bangladesh?"}</h2>
            <p className="text-lg text-zinc-600">{settings.service_seo_unique_desc || "We leverage cutting-edge tools and strategies to ensure your business thrives in the AI-powered search landscape."}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {parseJson(settings.service_seo_unique_features).map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-xl border border-primary/20">
                <h3 className="text-2xl font-bold text-zinc-900 mb-3">{item.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PackagesSection title="Let's Grow Your Visibility" subtitle="Choose the SEO strategy that fits your growth goals" />

      <ClientsSection />
      <FAQSection />

      {/* Blog Section */}
      <BlogsSection />

      <CTASection />
    </>
  );
}
