import ScrollToSection from '../../components/ScrollToSection';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import NewsDetails from '../../components/NewsDetails';

async function getSettings() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${API_URL}/designs?search=site-settings`, { next: { revalidate: 60 } });
    const data = res.ok ? await res.json() : null;
    const designs = data?.designs || data || [];
    const siteSettings = designs.find(d => d.slug === 'site-settings');
    return siteSettings?.design_data || {};
  } catch (err) {
    return {};
  }
}

async function getNewsData(id) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const [newsRes, headerAdsRes, sidebarAdsRes, footerAdsRes] = await Promise.all([
      fetch(`${API_URL}/news/${id}`, { next: { revalidate: 60 } }),
      fetch(`${API_URL}/ads/position?position=header&page=details`, { next: { revalidate: 60 } }),
      fetch(`${API_URL}/ads/position?position=sidebar&page=details`, { next: { revalidate: 60 } }),
      fetch(`${API_URL}/ads/position?position=footer&page=details`, { next: { revalidate: 60 } })
    ]);

    const newsData = newsRes.ok ? await newsRes.json() : null;
    const headerAds = headerAdsRes.ok ? await headerAdsRes.json() : [];
    const sidebarAds = sidebarAdsRes.ok ? await sidebarAdsRes.json() : [];
    const footerAds = footerAdsRes.ok ? await footerAdsRes.json() : [];

    return {
      news: newsData ? (newsData.data || newsData.news || newsData) : null,
      ads: { header: headerAds, sidebar: sidebarAds, footer: footerAds }
    };
  } catch (err) {
    console.error('Server-side fetch error (news details/ads):', err);
    return { news: null, ads: { header: [], sidebar: [], footer: [] } };
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const settings = await getSettings();

  try {
    const res = await fetch(`${API_URL}/news/${id}`, {
      next: { revalidate: 60 }
    });

    const rawData = await res.json();
    const news = rawData.data || rawData.news || rawData;

    const siteName = settings?.siteNameBn || 'পাঠকবন্ধু';
    const headline = news?.newsHeadline || news?.title || 'News';
    const description = news?.metaDescription || news?.shortDescription || news?.description?.slice(0, 160) || `Latest news from ${siteName}`;

    return {
      title: `${headline} | ${siteName}`,
      description: description,
      openGraph: {
        title: headline,
        description: description,
        type: 'article',
        images: news?.leadImage || news?.metaImage || news?.thumbImage ? [{ url: news.leadImage || news.metaImage || news.thumbImage }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: headline,
        description: description,
      }
    };
  } catch (err) {
    console.error('Metadata generation error:', err);
    const siteName = settings?.siteNameBn || 'পাঠকবন্ধু';
    return {
      title: `News | ${siteName}`,
      description: 'Latest news from পাঠকবন্ধু',
    };
  }
}

export default async function NewsRoute({ params }) {
  const { id } = await params;
  const { news, ads } = await getNewsData(id);

  return (
    <>
      <ScrollToSection />
      <Header />
      <main className="main-content bg-light" style={{ minHeight: "80vh" }}>
        <NewsDetails id={id} initialData={news} initialAds={ads} />
      </main>
      <Footer />
    </>
  );
}