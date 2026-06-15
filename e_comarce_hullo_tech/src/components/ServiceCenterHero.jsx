"use client";

export default function ServiceCenterHero() {
  return (
    <section className="relative bg-gradient-to-r from-star-blue to-blue-600 text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            HulloTech Service Center
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Professional repair and maintenance services for all your
            electronics. Expert technicians. Quick turnaround. Warranty support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="px-8 py-3 bg-white text-star-blue rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Book Service
            </a>
            <a
              href="#locations"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-colors"
            >
              Find Center
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
