import { MapPin, CheckCircle2, Building2, Utensils, Home, Scissors, Wifi, Briefcase, ChevronDown } from "lucide-react";
import ServiceHero from "../../../components/ServiceHero";
import PackagesSection from "../../../components/PackagesSection";
import FAQSection from "../../../components/FAQSection";

export const metadata = {
  title: "Local SEO Services | Next Idea Solutions",
  description: "Dominate local search results and attract high-intent customers nearby. Optimize your Google Business Profile and rank higher in local searches.",
};

export default function LocalSEOPage() {
  const localPackages = [
    {
      name: "Basic",
      price: "৳ 15,000",
      range: "Small Local Business",
      features: [
        { name: "GBP Optimization", included: true },
        { name: "5 Local Keywords", included: true },
        { name: "NAP Consistency", included: true },
        { name: "10 Local Citations", included: true },
        { name: "On-Page SEO", included: true },
        { name: "Review Strategy", included: false },
        { name: "Local Link Building", included: false },
      ]
    },
    {
      name: "Standard",
      price: "৳ 20,000",
      range: "Medium Local Business",
      features: [
        { name: "Full GBP Management", included: true },
        { name: "15 Local Keywords", included: true },
        { name: "NAP Consistency", included: true },
        { name: "25 Local Citations", included: true },
        { name: "On-Page & Geo-Content", included: true },
        { name: "Review Management", included: true },
        { name: "Local Link Building", included: false },
      ]
    },
    {
      name: "Advanced",
      price: "৳ 30,000",
      range: "Competitive Markets",
      features: [
        { name: "Premium GBP Strategy", included: true },
        { name: "30+ Local Keywords", included: true },
        { name: "Advanced Citation Audit", included: true },
        { name: "50+ Local Citations", included: true },
        { name: "Multi-Location Optimization", included: true },
        { name: "Active Review Growth", included: true },
        { name: "Local Link Building", included: true },
      ]
    }
  ];

  return (
    <>
      <ServiceHero
        icon={<MapPin className="w-12 h-12 text-primary" />}
        title="Local SEO"
        tagline="Find Customers Near You Consistently"
        description="Be the first one to show up when your customers search your product or service in your local area. Whether you're a retail store, service provider, or multi-location business, our local SEO strategy is customized to grow your visibility where it matters most."
        image="/Local-SEO.png"
      />

      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                Local SEO Service In <span className="text-primary">Bangladesh</span>
              </h2>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                46% of all Google searches are for local information. If your business isn't showing up in the Local Pack or on Maps, you're losing customers to your competitors every single day. Our Local SEO services ensure you dominate your neighborhood.
              </p>
              <button className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                GET A FREE QUOTE
              </button>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/local-seo-hero.png" 
                alt="Local SEO Illustration" 
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Why Choose Our Local SEO Services?</h2>
            <p className="text-zinc-500">We don't just optimize; we help you dominate the local landscape.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Proven Strategy", desc: "Our localized SEO methods are tested and proven to increase visibility in the Google Map Pack and organic local search results." },
              { title: "Expert GBP Management", desc: "We handle everything from profile setup to ongoing optimization, ensuring your business stays relevant and active." },
              { title: "Growth Tracking", desc: "You'll receive transparent, easy-to-understand reports tracking your rankings, calls, and customer interactions." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-zinc-100 hover:border-primary/30 transition-colors shadow-sm">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 font-bold text-xl">{idx + 1}</div>
                <h3 className="text-xl font-bold text-zinc-900 mb-4">{item.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="/local-seo-include.png" 
                alt="Local SEO Services" 
                className="w-full rounded-2xl shadow-xl"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-8">Our Local SEO Services Include</h2>
              <ul className="grid sm:grid-cols-2 gap-4">
                {[
                  "Google Business Profile Setup",
                  "Local Keyword Research",
                  "NAP Consistency Management",
                  "Local Citation Building",
                  "Reputation Management",
                  "Geo-targeted Content",
                  "Map Pack Optimization",
                  "Monthly Performance Tracking"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-zinc-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-zinc-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Who Needs Local SEO?</h2>
          <p className="text-zinc-500 mb-16">Localized search is essential for businesses serving specific geographic areas.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: <Building2 />, title: "Clinics" },
              { icon: <Utensils />, title: "Restaurants" },
              { icon: <Home />, title: "Real Estate" },
              { icon: <Scissors />, title: "Salons" },
              { icon: <Wifi />, title: "ISPs" },
              { icon: <Briefcase />, title: "B2B Services" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-zinc-100 hover:shadow-md transition-all group text-center">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-bold text-zinc-900">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Package And Pricing</h2>
            <p className="text-zinc-500">Choose the local SEO plan that matches your business goals.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {localPackages.map((pkg, idx) => (
              <div key={idx} className="bg-zinc-50 rounded-2xl border border-zinc-200 overflow-hidden flex flex-col hover:border-primary transition-colors">
                <div className="bg-primary py-4 text-center text-white font-bold uppercase tracking-widest">{pkg.name}</div>
                <div className="p-8 text-center flex-grow">
                  <div className="text-4xl font-bold text-zinc-900 mb-2">{pkg.price}</div>
                  <div className="text-zinc-500 mb-8">{pkg.range}</div>
                  <ul className="text-left space-y-4 mb-8">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        {feature.included ? (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-zinc-300 rounded-full" />
                        )}
                        <span className={feature.included ? "text-zinc-700" : "text-zinc-400"}>{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">Get Started</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection 
        title="Frequently Asked Questions"
        items={[
          { question: "What is Local SEO?", answer: "Local SEO is the process of optimizing your online presence to attract more business from relevant local searches." },
          { question: "Why is Google Business Profile important?", answer: "GBP is the core of local SEO, as it controls your presence on Google Maps and the Local Pack." },
          { question: "How long does it take to see results?", answer: "Local SEO typically shows results within 3-6 months depending on competition and current rankings." },
          { question: "Do you offer multi-location support?", answer: "Yes, we specialize in managing Local SEO for businesses with multiple branches or service areas." }
        ]}
      />

      <section className="py-20 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-[2rem] p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 text-white">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready To Dominate Local Search and Maps?</h2>
              <p className="text-lg text-white/80 leading-relaxed mb-8">
                If you're still confused about your local performance or need a customized strategy for multiple locations, reach out for a free consultation.
              </p>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Name" className="w-full p-3 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-primary outline-none" />
                    <input type="email" placeholder="Email" className="w-full p-3 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Phone" className="w-full p-3 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-primary outline-none" />
                    <input type="text" placeholder="Website URL" className="w-full p-3 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <select className="w-full p-3 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-primary outline-none text-zinc-500">
                    <option>Select Service</option>
                    <option>Local SEO</option>
                    <option>Full SEO Management</option>
                  </select>
                  <textarea placeholder="Message" rows="4" className="w-full p-3 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-primary outline-none"></textarea>
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
