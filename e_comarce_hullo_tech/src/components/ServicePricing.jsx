"use client";

import { Check } from "lucide-react";

const pricingPlans = [
  {
    id: 1,
    name: "Basic Diagnosis",
    price: "৳ 500",
    description: "Hardware/Software assessment",
    features: [
      "Device inspection",
      "Problem diagnosis",
      "Quotation provided",
      "No hidden charges",
    ],
  },
  {
    id: 2,
    name: "Standard Service",
    price: "৳ 1,500+",
    description: "Common repairs & maintenance",
    features: [
      "Diagnosis included",
      "Standard parts",
      "90-day warranty",
      "Express service available",
    ],
    featured: true,
  },
  {
    id: 3,
    name: "Premium Service",
    price: "৳ 3,000+",
    description: "Complex repairs & upgrades",
    features: [
      "Comprehensive diagnosis",
      "Genuine parts only",
      "Extended warranty",
      "Priority support",
    ],
  },
];

export default function ServicePricing() {
  return (
    <section className="bg-star-light-gray py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Service Pricing
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Transparent pricing with no hidden charges. Final cost depends on
            device and repair complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg overflow-hidden transition-all ${
                plan.featured
                  ? "border-2 border-star-blue shadow-lg scale-105 md:scale-100"
                  : "border border-star-gray bg-white"
              } ${plan.featured ? "bg-white" : "bg-white"}`}
            >
              {plan.featured && (
                <div className="bg-star-blue text-white py-2 text-center text-sm font-bold">
                  MOST POPULAR
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                <div className="mb-6">
                  <div className="text-3xl font-bold text-star-blue">
                    {plan.price}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Diagnosis cost waived if repair approved
                  </p>
                </div>

                <button
                  className={`w-full py-2 rounded-lg font-bold transition-colors mb-6 ${
                    plan.featured
                      ? "bg-star-blue text-white hover:bg-star-dark-blue"
                      : "border border-star-blue text-star-blue hover:bg-blue-50"
                  }`}
                >
                  Book Now
                </button>

                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info Table */}
        <div className="bg-white rounded-lg border border-star-gray overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50 border-b border-star-gray">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">
                    Service Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">
                    Typical Cost Range
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">
                    Turnaround Time
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-star-gray hover:bg-blue-50">
                  <td className="px-6 py-3 text-sm text-gray-700">
                    Screen Replacement (Laptop)
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    ৳ 4,000 - ৳ 8,000
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">2-3 days</td>
                </tr>
                <tr className="border-b border-star-gray hover:bg-blue-50">
                  <td className="px-6 py-3 text-sm text-gray-700">
                    Phone Screen Replacement
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    ৳ 3,000 - ৳ 7,000
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">Same day</td>
                </tr>
                <tr className="border-b border-star-gray hover:bg-blue-50">
                  <td className="px-6 py-3 text-sm text-gray-700">
                    Battery Replacement
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    ৳ 1,500 - ৳ 4,000
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">1-2 hours</td>
                </tr>
                <tr className="border-b border-star-gray hover:bg-blue-50">
                  <td className="px-6 py-3 text-sm text-gray-700">
                    Keyboard/Charging Port Repair
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    ৳ 800 - ৳ 2,500
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">Same day</td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="px-6 py-3 text-sm text-gray-700">
                    Software/Virus Removal
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    ৳ 500 - ৳ 1,500
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">2-4 hours</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> Prices shown are estimates. Exact pricing
            will be provided after device diagnosis. All prices are VAT
            inclusive.
          </p>
        </div>
      </div>
    </section>
  );
}
