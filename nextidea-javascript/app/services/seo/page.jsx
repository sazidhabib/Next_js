"use client";

import { Search, BarChart2, Code, MapPin, ShoppingCart, Smartphone, Youtube, Mic, MessageSquare, FileText, TrendingUp, Award, Zap, Target, CheckCircle, Star } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import PackagesSection from "../../components/PackagesSection";
import CTASection from "../../components/CTASection";
import FAQSection from "../../components/FAQSection";
import BlogsSection from "../../components/BlogsSection";
import SEOProcess from "../../components/SEOProcess";
import SEOTabbedServices from "../../components/SEOTabbedServices";
import ClientsSection from "../../components/ClientsSection";


export default function SEOPage() {
  return (
    <>
      <ServiceHero
        icon={<Search />}
        title="SEO Services"
        tagline="Future-Proof Your Visibility With The Best SEO Agency in Bangladesh"
        description="At Next Idea solution, we specialize in turning concepts into remarkable SEO strategies that leave a lasting impression on your visibility ensuring your brand stands out in search results."
        image="/SEO-Services.jpg"
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
                <div key={index} className="px-6 py-3 border border-primary/40 rounded-full text-primary  font-bold hover:border-primary transition-colors flex items-center gap-2">
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
        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll {
            animation: scroll 40s linear infinite;
          }
        `}</style>
      </section>

      <ServiceContent
        overview={{
          title: "Your Customers Are Searching For You On Google, But You Don't Know",
          description: "In this age where customers search online to gather information and then make a purchase decision, you're losing sales if you're not present in front of their eyes when they're searching. Our SEO strategies are built to align with search engine priorities: helpfulness, authority, and relevance.",
        }}
        relatedServices={[
          { title: "SEO Audit", link: "/services/seo/seo-audit", icon: <FileText /> },
          { title: "Local SEO", link: "/services/seo/local-seo", icon: <MapPin /> },
          { title: "E-commerce SEO", link: "/services/seo/e-commerce-seo", icon: <ShoppingCart /> },
        ]}
      />

      <SEOProcess />




      {/* Stay Visible Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-zinc-900 mb-6">Stay Visible In A Search Landscape Shaped By AI</h2>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                Search is evolving faster than ever. With AI-powered results and personalization, ranking on Google is no longer just about keywords. It's about delivering real value and being visible where your customers search.
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
              <img src="/SEO-Services.jpg" alt="Stay Visible" className="w-full rounded-2xl shadow-2xl" />
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

      <SEOTabbedServices />


      {/* Hire The Best SEO Agency Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900 mb-4">Hire The Best SEO Agency in Bangladesh</h2>
            <p className="text-lg text-zinc-600">Trusted by leading brands and startups alike, we've helped hundreds of businesses achieve top search rankings and drive sustainable growth.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                company: "Clutch",
                rating: 5,
                reviews: 15,
                feedback: "Next Idea solution is one of the top-rated SEO agencies. Their team delivered exceptional results and maintained great communication throughout.",
              },
              {
                company: "Google",
                rating: 4.9,
                reviews: 42,
                feedback: "Consistent quality in delivering SEO results. Their AI-powered approach to modern search is what sets them apart from competitors.",
              },
              {
                company: "Upwork",
                rating: 5,
                reviews: 28,
                feedback: "The best SEO partner we've worked with. They understood our business goals and delivered measurable results within the timeline.",
              },
            ].map((item, index) => (
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

      {/* Case Studies Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900 mb-4">See Next Idea Has Helped Clients</h2>
            <p className="text-lg text-zinc-600">Our portfolio showcases successful SEO projects across various industries with measurable results.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "E-commerce SEO",
                description: "Increased organic traffic by 270% for e-commerce platforms",
                image: "/E-commerce-SEO.jpg",
                stats: "270% Traffic Growth",
              },
              {
                title: "Local SEO",
                description: "Improved local search rankings and customer acquisition",
                image: "/Local-SEO.jpg",
                stats: "Top Local Rankings",
              },
              {
                title: "SEO Audit & Strategy",
                description: "Comprehensive audits leading to strategic optimization",
                image: "/SEO-Audit.jpg",
                stats: "40% Higher Rankings",
              },
            ].map((project, index) => (
              <div key={index} className="rounded-xl overflow-hidden border border-zinc-200 hover:shadow-xl transition-all group">
                <div className="h-64 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden flex items-center justify-center">
                  {project.image && (
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  )}
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">{project.title}</h3>
                  <p className="text-zinc-600 mb-4">{project.description}</p>
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    {project.stats}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900 mb-4">Why Choose Us As Your SEO Company in Bangladesh</h2>
            <p className="text-lg text-zinc-600">We combine expertise, innovation, and proven results to deliver SEO strategies that drive sustainable growth for your business.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <TrendingUp />, title: "Proven Results", description: "Next Idea helped Dhgate with a 270% increase in organic traffic, leading to lower cost per acquisition (CPA) within 6 months." },
              { icon: <Target />, title: "Strategic Approach", description: "Our meticulous planning and execution guarantees flawless strategies that resonate with your target audience." },
              { icon: <Award />, title: "Industry Expertise", description: "With years of experience, our team understands the evolving search landscape and AI-powered search algorithms." },
              { icon: <Zap />, title: "AI-Ready Solutions", description: "We build SEO strategies optimized for the AI-powered search era, ensuring long-term visibility." },
            ].map((item, index) => (
              <div key={index} className="p-6 bg-white rounded-xl border border-zinc-200 hover:border-primary/50 hover:shadow-lg transition-all text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                  {item.icon}
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
            <h2 className="text-4xl font-bold text-zinc-900 mb-4">What's Unique About Next Idea's SEO? As An SEO Agency in Bangladesh?</h2>
            <p className="text-lg text-zinc-600">We leverage cutting-edge tools and strategies to ensure your business thrives in the AI-powered search landscape.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "AI-Optimized SEO Strategy", description: "We optimize for both traditional search and AI-powered results like SGE, ensuring your content is discovered through all search methods." },
              { title: "End-To-End SEO Services", description: "From technical SEO to content optimization and link building, we handle every aspect of your SEO needs under one roof." },
              { title: "Transparent Reporting", description: "Monthly detailed reports with clear metrics, actionable insights, and transparent communication about your SEO performance." },
            ].map((item, index) => (
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
