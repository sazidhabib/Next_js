"use client";

const platformColors = {
  youtube: "bg-red-500",
  facebook: "bg-blue-600",
  instagram: "bg-pink-500",
  tiktok: "bg-gray-900",
  twitter: "bg-sky-500",
};

const platformLabels = {
  youtube: "YouTube",
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  twitter: "Twitter / X",
};

export default function DownloadResult({ result, onClose }) {
  if (!result) return null;

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-100">
          {/* Header */}
          <div className="flex items-start gap-4 p-6">
            {result.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={result.thumbnail}
                alt={result.title}
                className="h-24 w-40 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${platformColors[result.platform] || "bg-gray-500"}`}>
                {platformLabels[result.platform] || result.platform}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2">{result.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Download Options */}
          <div className="border-t border-gray-100 px-6 pb-6">
            <p className="pt-4 text-sm font-medium text-gray-700">Available Downloads</p>
            <div className="mt-3 grid gap-2">
              {result.downloads.map((dl, i) => (
                <a
                  key={i}
                  href={dl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${dl.type === "audio" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}>
                      {dl.type === "audio" ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-900">{dl.quality}</span>
                      <span className="ml-2 text-xs text-gray-500 uppercase">{dl.format}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-blue-600 group-hover:text-blue-700">
                    Download
                    <svg className="h-4 w-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
