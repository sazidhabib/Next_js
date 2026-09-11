const features = [
  {
    title: "Fast & Reliable",
    description: "Get your media in seconds with our optimized servers.",
    icon: FastIcon,
    bg: "bg-purple-100 text-purple-600",
  },
  {
    title: "No Watermark",
    description: "Download clean, original files without any watermark.",
    icon: WatermarkIcon,
    bg: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "High Quality",
    description: "Choose from multiple resolutions and formats.",
    icon: HighQualityIcon,
    bg: "bg-blue-100 text-blue-600",
  },
  {
    title: "Works Everywhere",
    description: "Use on any device — desktop, tablet or mobile.",
    icon: DevicesIcon,
    bg: "bg-indigo-100 text-indigo-600",
  },
];

function FastIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function WatermarkIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function HighQualityIcon() {
  return (
    <div className="flex h-5 w-5 items-center justify-center font-bold text-[10px] tracking-tighter border-2 border-current rounded-md">
      HD
    </div>
  );
}

function DevicesIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  );
}

export default function Features() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex flex-col items-start rounded-2xl bg-white p-6 sm:p-7 border border-slate-100 shadow-sm transition-all hover:border-slate-200 hover:shadow-md"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${feature.bg} shadow-inner transition-transform group-hover:scale-110`}>
                <feature.icon />
              </div>
              <h3 className="mt-5 text-base sm:text-lg font-bold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trusted By Divider */}
        <div className="mt-14 sm:mt-16 flex items-center justify-center gap-4 text-xs font-medium text-slate-400">
          <div className="h-[1px] w-12 sm:w-20 bg-slate-200" />
          <span>Trusted by millions of users worldwide</span>
          <div className="h-[1px] w-12 sm:w-20 bg-slate-200" />
        </div>
      </div>
    </section>
  );
}
