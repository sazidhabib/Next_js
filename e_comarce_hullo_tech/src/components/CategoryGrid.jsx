import Link from "next/link";
import { categories } from "../data/mockData";
import { Laptop, Monitor, Cpu, Smartphone, Tablet, Camera, Shield, PcCase } from "lucide-react";

const iconMap = {
  Desktop: PcCase,
  Laptop: Laptop,
  Cpu: Cpu,
  Monitor: Monitor,
  Smartphone: Smartphone,
  Tablet: Tablet,
  Camera: Camera,
  Shield: Shield,
};

export default function CategoryGrid() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {categories.map((category) => {
          const IconComponent = iconMap[category.icon];
          return (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className="group bg-white border border-star-gray rounded-lg p-3 flex flex-col items-center gap-2 hover:border-star-blue hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 bg-star-light-gray rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                {IconComponent && <IconComponent className="w-6 h-6 text-star-blue" />}
              </div>
              <h3 className="text-xs font-medium text-center text-star-text group-hover:text-star-blue transition-colors">
                {category.name}
              </h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
