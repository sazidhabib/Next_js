import { Code2, Smartphone, Shield, Zap, Layout, ShoppingCart, Building2, Target, Sparkles, Palette, TrendingUp } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import PackagesSection from "../../components/PackagesSection";
import ProjectGrid from "../../components/ProjectGrid";
import BlogsSection from "../../components/BlogsSection";
import CTASection from "../../components/CTASection";

export const metadata = {
  title: "Web Design & Development | Next Idea Solutions",
  description: "We excel in creating user-friendly, high-converting landing pages, websites, and apps. Modern design meets powerful functionality.",
};

export default function WebDesignDevelopmentPage() {
  return (
    <>
      <ServiceHero
        icon={<Code2 />}
        title="Web Design & Development"
        tagline="Strong marketing your brand with high-converting landing page, website or app."
        description="Our Web Design & Development service combines creativity, functionality, and cutting-edge technology to create digital experiences that resonate with your audience."
        image="/Web-Design.png"
      />
      <ServiceContent
        overview={{
          title: "Our Web Design & Development service combines creativity, functionality, and cutting-edge technology to create digital experiences that resonate with your audience.",
          description: "If the stage of your website is small, we decide to customize it with our amazing custom web app development, the resulting development will make your business look like the next leading business.",
        }}
        features={{
          title: "OUR APPROACH",
          items: [
            {
              title: "User-Centric Design",
              description: "Focus on creating intuitive and visually appealing interfaces that prioritize user experience.",
              icon: <Layout />,
            },
            {
              title: "Innovative Development",
              description: "Build websites and apps that are functionally robust and technologically advanced.",
              icon: <Smartphone />,
            },
            {
              title: "Scalable Solutions",
              description: "Develop solutions that grow with your business, ensuring long-term success and adaptability.",
              icon: <Zap />,
            },
          ],
        }}
        gridCols={3}
      />

      <div className="bg-zinc-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 uppercase tracking-widest">WHAT WE OFFER</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Ecommerce Solutions</h3>
              <p className="text-zinc-600 text-sm">Empower your business with robust and scalable online stores that drive sales and provide a seamless shopping experience.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Corporate Website Development</h3>
              <p className="text-zinc-600 text-sm">Establish a professional and impactful online presence for your corporation with a custom-designed website.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Landing page creation</h3>
              <p className="text-zinc-600 text-sm">Drive higher conversions for your marketing campaigns with high-impact and optimized landing pages.</p>
            </div>
          </div>
        </div>
      </div>

      <ProjectGrid categoryId={4} title="OUR DESIGNED WEBSITES" />

      <PackagesSection 
        title="OUR WEBSITE PACKAGES"
        subtitle="Choose the perfect web solution to scale your online presence"
        footerText="*Prices are subject to project complexity and specific requirements"
        packages={[
          {
            name: "Starter Site",
            setupCost: "৳ 60,000",
            features: [
              { name: "Modern design & development", included: true },
              { name: "Responsive across all devices", included: true },
              { name: "Up to 5 pages", included: true },
              { name: "Basic SEO optimization", included: true },
              { name: "Contact form integration", included: true },
              { name: "Speed optimization", included: true },
              { name: "Social media integration", included: true },
              { name: "20 days support after delivery", included: true },
            ],
          },
          {
            name: "Business Website",
            setupCost: "৳ 80,000",
            features: [
              { name: "Custom design & Unique UI/UX", included: true },
              { name: "Up to 10 pages", included: true },
              { name: "Advanced SEO optimization", included: true },
              { name: "Content Management System (CMS)", included: true },
              { name: "Google Analytics & Search Console", included: true },
              { name: "Performance optimization", included: true },
              { name: "45 days support after delivery", included: true },
            ],
          },
          {
            name: "Ecommerce Solution",
            setupCost: "৳ 100,000",
            features: [
              { name: "Product catalog & Checkout", included: true },
              { name: "Payment gateway integration", included: true },
              { name: "Order & Inventory management", included: true },
              { name: "User accounts & Login", included: true },
              { name: "Discount coupons & Promos", included: true },
              { name: "All features of Business Site", included: true },
              { name: "60 days support after delivery", included: true },
            ],
          },
        ]}
      />

      <CTASection 
        title="Ready to create your online presence?"
        description="Let's build a website that leaves a lasting impression and grows your business."
        buttonText="Contact Us"
      />
      <BlogsSection />
    </>
  );
}
