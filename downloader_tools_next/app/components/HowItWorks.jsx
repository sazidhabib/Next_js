const steps = [
  {
    number: "1",
    title: "Copy the Link",
    description: "Find the video you want to download on any social media platform and copy its URL from the share menu or address bar.",
    icon: CopyIcon,
  },
  {
    number: "2",
    title: "Paste & Choose Quality",
    description: "Paste the video URL into the download box above and click Download. Select your preferred quality.",
    icon: PasteIcon,
  },
  {
    number: "3",
    title: "Download the Video",
    description: "Click the download button for your chosen quality. The file saves directly to your device instantly.",
    icon: DownloadIcon,
  },
];

function CopyIcon() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
    </svg>
  );
}

function PasteIcon() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How to Download Videos</h2>
          <p className="mt-3 text-lg text-gray-600">Three simple steps to save any social media video</p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                <step.icon />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">{step.description}</p>
              <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                {step.number}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
