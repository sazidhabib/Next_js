export default function SEOContent({ platformName }) {
  const heading = platformName
    ? `SaveSocialVideos: Online ${platformName} Video Downloader`
    : "SaveSocialVideos: Download Facebook, YouTube & Instagram Videos Online";

  const p1 = platformName
    ? `In today's digital era, ${platformName} is filled with incredible video content. Whether it's a helpful tutorial, a funny clip, or a trending viral video, there are times when you want to save these videos for offline viewing. This is where SaveSocialVideos comes in – your ultimate tool for high-quality ${platformName} video downloads without watermarks.`
    : `In today's digital era, social media platforms like Facebook, YouTube, Instagram, and TikTok are filled with incredible video content. Whether it's a helpful tutorial, a funny reel, or a trending viral video, there are times when you want to save these videos for offline viewing. This is where SaveSocialVideos comes in – your ultimate tool for high-quality video downloads.`;

  const h2 = platformName ? `Why Choose Our ${platformName} Video Downloader?` : "Why Choose Our Universal Video Downloader?";
  const p2 = platformName
    ? `Our online downloader provides a clean, user-friendly experience focused on performance. We support downloading high-definition videos from ${platformName} without annoying watermarks, ensuring a smooth and safe process.`
    : `Most online downloaders are filled with intrusive ads and malicious scripts. SaveSocialVideos provides a clean, user-friendly experience focused on performance. We support Facebook Reels download, YouTube to MP4 conversion, Instagram Reels saving, and TikTok No-Watermark downloads all in one place.`;

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {heading}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {p1}
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8">{h2}</h3>
          <p className="text-gray-600 leading-relaxed">
            {p2}
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8">Our Commitment to Quality</h3>
          <p className="text-gray-600 leading-relaxed">
            We don&apos;t just download videos; we ensure you get the best possible version. Our engine automatically detects the highest available resolution, from standard 720p to stunning 4K Ultra HD. We also provide multiple format options and audio extraction for those who only need the soundtrack of a video.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8">Frequently Asked Questions</h3>
          <div className="space-y-4 mt-4">
            <FAQItem
              question="Is it free to download videos?"
              answer="Yes! SaveSocialVideos is 100% free. No registration, no hidden fees. Simply paste the video link and download."
            />
            <FAQItem
              question="What video quality can I download?"
              answer="We support up to 4K Ultra HD quality, depending on the source video. Options typically include 720p, 1080p, 2K, and 4K."
            />
            <FAQItem
              question="Do I need to install any software?"
              answer="No. SaveSocialVideos works entirely in your web browser. No software or browser extension is required."
            />
            <FAQItem
              question="Which devices are supported?"
              answer="Our downloader works on all devices including Android, iOS, Windows, macOS, and Linux. Just open any web browser and start downloading."
            />
            <FAQItem
              question="Are downloaded videos saved on your servers?"
              answer="No. We do not store any videos on our servers. The download links are generated in real-time and sent directly to your device."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }) {
  return (
    <div className="rounded-xl bg-white p-5 ring-1 ring-gray-100">
      <h4 className="font-semibold text-gray-900">{question}</h4>
      <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{answer}</p>
    </div>
  );
}
