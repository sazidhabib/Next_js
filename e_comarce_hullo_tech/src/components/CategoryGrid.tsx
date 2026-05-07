import Link from "next/link";
import { categories } from "@/data/mockData";
import { Laptop, Monitor, Cpu, Smartphone, Tablet, Camera, Shield, PcCase } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
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
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((category) => {
          const IconComponent = iconMap[category.icon];
          return (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className="bg-white border border-star-gray rounded-lg p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-star-light-gray rounded-lg flex items-center justify-center">
                {IconComponent && <IconComponent className="w-6 h-6 text-star-blue" />}
              </div>
              <h3 className="text-xs font-medium text-center">{category.name}</h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
