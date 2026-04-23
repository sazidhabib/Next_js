import { ClipboardList, Search, MapPin, ShoppingCart, CheckCircle2 } from "lucide-react";
import ServiceHero from "../../../components/ServiceHero";
import ServiceContent from "../../../components/ServiceContent";
import PackagesSection from "../../../components/PackagesSection";
import CTASection from "../../../components/CTASection";
import SEOProcess from "../../../components/SEOProcess";

export const metadata = {
  title: "SEO Audit Service | Next Idea Solution",
  description: "Identify and fix what's holding your website back from ranking on the 1st page of Google. Get a comprehensive, human-led SEO audit and roadmap.",
};

export default function SEOAuditPage() {
  const auditPackages = [
    {
      name: "Starter (Basic)",
      features: [
        { name: "Up to 40 Web pages", included: true },
        { name: "Technical Audit", included: true },
        { name: "On-Page Audit", included: true },
        { name: "Off-Page (Backlink) Audit", included: true },
        { name: "Core Web Vitals Assessment", included: true },
        { name: "Prioritized Action Plan", included: true },
        { name: "Competitor Comparison (1)", included: true },
      ],
      mediaSpending: "Small Websites",
      setupCost: "One-time Payment",
      managementFee: "৳ 20,000",
    },
    {
      name: "Growth Hacker (Standard)",
      features: [
        { name: "40 to 100 Web Pages", included: true },
        { name: "Full Technical Deep-Dive", included: true },
        { name: "Content Gap Analysis", included: true },
        { name: "Conversion Rate Review", included: true },
        { name: "Mobile Usability Audit", included: true },
        { name: "Detailed Roadmap (3 Months)", included: true },
        { name: "Competitor Comparison (3)", included: true },
      ],
      mediaSpending: "Medium Businesses",
      setupCost: "Most Popular",
      managementFee: "৳ 50,000",
    },
    {
      name: "Progressive (Custom)",
      features: [
        { name: "More than 100 Pages", included: true },
        { name: "Enterprise-Scale Audit", included: true },
        { name: "Log File Analysis", included: true },
        { name: "JavaScript SEO Review", included: true },
        { name: "International SEO Audit", included: true },
        { name: "Custom Implementation Support", included: true },
        { name: "Full Competitor Landscape", included: true },
      ],
      mediaSpending: "Enterprise & E-commerce",
      setupCost: "Bespoke Solution",
      managementFee: "Custom Pricing",
    },
  ];

  const auditSteps = [
    {
      number: "1",
      title: "Discovery & Analysis",
      description: "We start by crawling your site using industry-leading tools and manually reviewing your Google Search Console data to identify critical errors and indexing issues.",
      color: "red",
    },
    {
      number: "2",
      title: "Technical & On-Page Review",
      description: "Our experts dive deep into your site's code, structure, and content to find issues that hinder search engine understanding and user satisfaction.",
      color: "black",
    },
    {
      number: "3",
      title: "Off-Page & Competitor Audit",
      description: "We analyze your external authority and compare your profile with 3-5 top competitors to find opportunities for growth and authority building.",
      color: "red",
    },
    {
      number: "4",
      title: "Actionable Roadmap",
      description: "You receive a detailed report with prioritized recommendations, categorized into 'Quick Wins' and 'Strategic Improvements' for immediate impact.",
      color: "black",
    },
  ];

  return (
    <>
      <ServiceHero
        icon={<ClipboardList className="w-12 h-12 text-primary" />}
        title="SEO Audit Service"
        tagline="Uncover What's Holding Your Website Back from Ranking"
        description="Is your website struggling to generate organic traffic or leads? Our SEO Audit Service helps you identify exactly what's wrong and gives you a clear roadmap to fix it fast. No automated reports—you get human-led insights and actionable steps."
        image="/SEO-Audit.png"
      />
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                SEO Audit Service In <span className="text-primary">Bangladesh</span>
              </h2>
              <p className="text-xl text-zinc-600 mb-6 font-medium">
                Uncover What's Holding Your Website Back from Ranking on 1st page of Google.
              </p>
              <p className="text-lg text-zinc-500 mb-8 leading-relaxed">
                Is your website struggling to generate organic traffic or leads? Our 100% human-led SEO audit helps you identify exactly what's wrong and gives you a clear roadmap to fix it fast. We don't just give you a PDF; we give you a roadmap to success.
              </p>
              <button className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                GET A FREE QUOTE
              </button>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/seo-audit-hero.png" 
                alt="SEO Audit Illustration" 
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-zinc-50">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-8">What Is An SEO Audit?</h2>
          <div className="space-y-6 text-lg text-zinc-600 leading-relaxed">
            <p>
              An SEO audit is a comprehensive analysis of your website's technical health, content relevance, backlink authority, and user experience. It's the most essential step before starting any SEO campaign.
            </p>
            <p>
              At Next Idea Solution, we follow a rigorous 200+ point checklist to ensure we find every hidden bottleneck, from indexing issues to content gaps. We don't just find problems; we provide a prioritized roadmap for 'Quick Wins' and long-term growth.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="/who-needs-audit.png" 
                alt="Who needs SEO Audit" 
                className="w-full rounded-2xl shadow-xl"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-8">Who Needs An SEO Audit?</h2>
              <ul className="space-y-4">
                {[
                  "Small and medium businesses struggling for visibility",
                  "E-commerce websites with low conversion rates",
                  "Blogs and niche websites wanting to scale traffic",
                  "Companies launching a new website or rebranding",
                  "Any business that wants to grow organic search revenue"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <span className="text-lg text-zinc-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">What's Included In Our SEO Audit Checklist</h2>
            <p className="text-lg text-zinc-600">
              We leave no stone unturned. Our manual audit covers everything from server-side issues to the quality of your content.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "On-Page SEO",
                items: ["Title & Meta Tags", "URL Structure", "Heading Tags (H1-H6)", "Content Quality", "Keyword Optimization", "Internal Linking", "Image Alt Text", "Mobile-Friendliness"]
              },
              {
                title: "Technical SEO",
                items: ["Site Crawlability", "XML Sitemap", "Robots.txt", "Page Speed Audit", "SSL & HTTPS", "Schema Markup", "404 Errors & Redirects", "Core Web Vitals"]
              },
              {
                title: "Off-Page SEO",
                items: ["Backlink Profile", "Toxic Link Review", "Competitor Comparison", "Local Citation Audit", "Social Signals", "Brand Mentions", "Domain Authority", "Spam Score Check"]
              }
            ].map((col, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-primary mb-6 pb-4 border-b border-zinc-100">{col.title}</h3>
                <ul className="space-y-3">
                  {col.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-zinc-600">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PackagesSection 
        title="SEO Audit Packages"
        subtitle="Transparent pricing for websites of all sizes. Choose the audit that fits your scale."
        packages={auditPackages}
        footerText="*All audits are human-led and typically delivered within 7-10 business days."
      />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-[2rem] p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 text-white">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Not Sure Where To Start? Get A FREE Consultation</h2>
              <p className="text-lg text-white/80 leading-relaxed mb-8">
                If you are still confused about your website performance and what to do next, feel free to reach us out. We will identify the issues for you and then we can talk about how we can help your business reach its desired outcomes.
              </p>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Name" className="w-full p-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary" />
                    <input type="email" placeholder="Email" className="w-full p-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Phone" className="w-full p-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary" />
                    <input type="text" placeholder="Website URL" className="w-full p-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <select className="w-full p-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary text-zinc-500">
                    <option>Select Service</option>
                    <option>SEO Audit</option>
                    <option>Full SEO Management</option>
                  </select>
                  <textarea placeholder="Message" rows="4" className="w-full p-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
                  <button className="w-full py-4 bg-zinc-900 text-white font-bold rounded-lg hover:bg-black transition-colors uppercase tracking-widest">
                    Request For Service
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
