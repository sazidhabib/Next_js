import Link from "next/link";
import { Check, X } from "lucide-react";

const packages = [
  {
    name: "Starter",
    features: [
      { name: "Digital Audit & Strategy", included: true },
      { name: "Tracking Integration", included: true },
      { name: "Funnel Development", included: true },
      { name: "Campaign Automation", included: false },
      { name: "Analytics", included: false },
    ],
    channels: "Facebook",
    mediaSpending: "Depends on client's budget",
    setupCost: "10,000 TK",
    managementFee: "30,000 TK",
  },
  {
    name: "Growth Hacker",
    features: [
      { name: "Digital Audit & Strategy", included: true },
      { name: "Tracking Integration", included: true },
      { name: "Funnel Development", included: true },
      { name: "Campaign Automation", included: true },
      { name: "Analytics", included: true },
    ],
    channels: "Facebook, LinkedIn, Google Display, Google Search, YouTube, Programmatic Ads",
    mediaSpending: "Up to $1K",
    setupCost: "20,000 TK",
    managementFee: "45,000 TK",
  },
  {
    name: "Progressive",
    features: [
      { name: "Digital Audit & Strategy", included: true },
      { name: "Tracking Integration", included: true },
      { name: "Funnel Development", included: true },
      { name: "Campaign Automation", included: true },
      { name: "Analytics", included: true },
    ],
    channels: "Facebook, Google Search, Google Display, Email",
    mediaSpending: "$1K-$3K",
    setupCost: "25,000 TK",
    managementFee: "Starting at 60,000 TK",
  },
];

export default function PackagesSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-black mb-4">
            Our Packages
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Choose the perfect package for your business needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <div
              key={pkg.name}
              className={`relative bg-zinc-50 border border-zinc-800 rounded-2xl p-8 hover:border-primary/50 hover:bg-zinc-100 transition-all duration-300 ${index === 1 ? "md:-mt-4 md:mb-8" : ""
                }`}
            >
              {index === 1 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-sm font-medium px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-black mb-2">{pkg.name}</h3>
                <p className="text-zinc-500 text-sm">{pkg.mediaSpending}</p>
              </div>

              <div className="space-y-4 mb-8">
                {pkg.features.map((feature) => (
                  <div
                    key={feature.name}
                    className="flex items-start gap-3"
                  >
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
                    )}
                    <span
                      className={
                        feature.included ? "text-zinc-400" : "text-zinc-600"
                      }
                    >
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800 pt-6 mb-6">
                <div className="mb-4">
                  <p className="text-zinc-500 text-sm mb-1">Channel Coverage</p>
                  <p className="text-black text-sm">{pkg.channels}</p>
                </div>
                <div className="mb-4">
                  <p className="text-zinc-500 text-sm mb-1">
                    Tracking Integration & Funnel Setup
                  </p>
                  <p className="text-black font-semibold">{pkg.setupCost}</p>
                  <p className="text-zinc-600 text-xs">(One-time Cost)</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-sm mb-1">Campaign Management Fee</p>
                  <p className="text-black font-semibold text-lg">{pkg.managementFee}</p>
                  <p className="text-zinc-600 text-xs">(Monthly)</p>
                </div>
              </div>

              <Link
                href="/contact#packages"
                className="block w-full py-3 px-6 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl text-center transition-colors"
              >
                Choose Plan
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-zinc-500 text-sm mt-8">
          *Media payments are paid in advance
        </p>
      </div>
    </section>
  );
}
