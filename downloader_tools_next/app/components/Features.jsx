const features = [
  {
    title: "Highest Quality",
    description: "Download Full HD, 2K, and 4K videos with sound. Most tools only support HD.",
    icon: QualityIcon,
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    title: "All Devices",
    description: "Works on mobile, PC, and tablet. Android & iOS supported. No software needed.",
    icon: DevicesIcon,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "100% Free",
    description: "Always free to use. No hidden fees, no registration required. Just paste and download.",
    icon: FreeIcon,
    gradient: "from-emerald-500 to-teal-500",
  },
];

function QualityIcon() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125M6 7.125v7.5m-2.25-3.75h12m-12 0V18" />
    </svg>
  );
}

function DevicesIcon() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  );
}

function FreeIcon() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );
}

export default function Features() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Why Use Our Video Downloader</h2>
          <p className="mt-3 text-lg text-gray-600">The fastest and most reliable video downloader available online</p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="group rounded-2xl bg-gray-50 p-8 ring-1 ring-gray-100 transition-all hover:bg-white hover:shadow-lg hover:ring-gray-200">
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-md group-hover:scale-110 transition-transform`}>
                <feature.icon />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
