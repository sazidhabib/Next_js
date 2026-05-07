import Link from "next/link";
import { Mail } from "lucide-react";

export default function Footer() {
  const footerSections = [
    {
      title: "Shop",
      links: ["Laptops", "Smartphones", "Gaming", "Accessories", "Smart Home"],
    },
    {
      title: "Support",
      links: ["Help Center", "Contact Us", "Shipping Info", "Returns", "Warranty"],
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Press", "Blog"],
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
    },
  ];

  return (
    <footer className="bg-white border-t border-star-gray mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-star-blue mb-4">HulloTech</h3>
            <p className="text-gray-600 text-sm mb-4">Your trusted tech marketplace in Bangladesh.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Subscribe for offers"
                className="flex-1 px-3 py-2 border border-star-gray rounded text-sm focus:outline-none focus:border-star-blue"
              />
              <button className="btn-primary">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-3">{section.title}</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                {section.links.map((link) => (
                  <li key={link} className="hover:text-star-blue cursor-pointer">
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-star-gray text-center text-sm text-gray-500">
          <p>© 2026 HulloTech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
