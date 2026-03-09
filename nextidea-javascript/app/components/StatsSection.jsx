import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const stats = [
  {
    value: "80,000",
    label: "Customers acquired through Facebook in 2 years",
    sublabel: "Average CPA $0.50",
    logo: "https://geekysocial.com/wp-content/uploads/2025/01/khaasfood_logo.webp",
  },
  {
    value: "900%",
    label: "Growth in Daily Order Numbers",
    sublabel: "Average CPA $1",
    logo: "https://geekysocial.com/wp-content/uploads/2022/12/logo-26.png",
  },
  {
    value: "370%",
    label: "Monthly Organic Traffic Surged",
    sublabel: "200+ Keywords ranked in Top 3 positions",
    logo: "https://geekysocial.com/wp-content/uploads/2024/05/stygen-logo.png",
  },
  {
    value: "1,700+",
    label: "Merchant Registration in 2 months",
    sublabel: "CPR $2.10",
    logo: "https://geekysocial.com/wp-content/uploads/2022/12/logo-22.png",
  },
];

const clientLogos = [
  { name: "Bangladesh ICT Division", logo: "https://geekysocial.com/wp-content/uploads/2022/09/bangladesh-ict-division-geeky-social.jpg" },
  { name: "Dan Cake", logo: "https://geekysocial.com/wp-content/uploads/2022/09/dan-cake.jpg" },
  { name: "DBL Ceramics", logo: "https://geekysocial.com/wp-content/uploads/2022/09/dbl-ceramics.jpg" },
  { name: "Fresh Cement", logo: "https://geekysocial.com/wp-content/uploads/2022/09/fresh-cement.jpg" },
  { name: "Khaas Food", logo: "https://geekysocial.com/wp-content/uploads/2022/09/khaasfood.jpg" },
  { name: "LG", logo: "https://geekysocial.com/wp-content/uploads/2022/09/lg-logo-geeky-social.jpg" },
  { name: "NRB Bazar", logo: "https://geekysocial.com/wp-content/uploads/2022/09/nrb-bazar.jpg" },
  { name: "Mithai", logo: "https://geekysocial.com/wp-content/uploads/2022/09/mithai.jpg" },
  { name: "Pran Chanachur", logo: "https://geekysocial.com/wp-content/uploads/2022/09/pran-chanachur.gif" },
  { name: "RFL Gas", logo: "https://geekysocial.com/wp-content/uploads/2022/09/rfl-gas.jpg" },
  { name: "Yamaha", logo: "https://geekysocial.com/wp-content/uploads/2022/09/yamaha.jpg" },
  { name: "Fujifilm", logo: "https://geekysocial.com/wp-content/uploads/2022/09/fujifilm-logo-geeky-social.jpg" },
  { name: "Aarong Dairy", logo: "https://geekysocial.com/wp-content/uploads/2022/12/logo-02.png" },
  { name: "ACI", logo: "https://geekysocial.com/wp-content/uploads/2022/12/logo-09.png" },
  { name: "Igloo", logo: "https://geekysocial.com/wp-content/uploads/2022/12/logo-06.png" },
  { name: "Intercontinental", logo: "https://geekysocial.com/wp-content/uploads/2022/12/logo-07.png" },
  { name: "Nagad", logo: "https://geekysocial.com/wp-content/uploads/2022/12/logo-15.png" },
  { name: "Paperfly", logo: "https://geekysocial.com/wp-content/uploads/2022/12/logo-22.png" },
];

export default function StatsSection() {
  return (
    <section className="py-24 bg-zinc-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Case Studies
          </h2>
          <p className="text-lg text-zinc-400">
            Results that speak for themselves
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-zinc-800/50 rounded-2xl">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-zinc-300 text-sm mb-1">{stat.label}</div>
              <div className="text-primary text-sm font-medium">{stat.sublabel}</div>
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <Link
            href="/case-study"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors"
          >
            See More Case Studies
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="mt-16 border-t border-zinc-800">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">OUR CLIENTS</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {clientLogos.map((client, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-4 bg-white/5 rounded-xl grayscale hover:grayscale-0 transition-all duration-300"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-h-12 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
