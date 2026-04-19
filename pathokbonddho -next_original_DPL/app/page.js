import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToSection from './components/ScrollToSection';
import PageRenderer from './components/PageRenderer';

// Helper to prevent fetch from hanging when backend isn't ready
async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function generateMetadata() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

  try {
    const response = await fetchWithTimeout(`${API_URL}/menus`, { next: { revalidate: 60 } });
    if (response.ok) {
      const data = await response.json();
      const menus = data.data || data || [];

      const menu = menus.find(m => m.path === '/' || m.name.toLowerCase() === 'home' || m.path.toLowerCase() === 'home' || m.order === 1);

      if (menu) {
        return {
          title: menu.metaTitle || menu.name || 'পাঠকবন্ধু',
          ...(menu.metaDescription ? { description: menu.metaDescription } : { description: 'Welcome to পাঠকবন্ধু, the news portal.' }),
          ...(menu.metaKeywords && { keywords: menu.metaKeywords }),
        };
      }
    }
  } catch (error) {
    // Silently fall back to defaults — backend may not be ready yet
  }

  return {
    title: 'পাঠকবন্ধু | Largest friends community by Ajker Patrika',
    description: 'Welcome to পাঠকবন্ধু, the news portal.',
  };
}

async function getPageData(slug = 'home') {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
  try {
    // 1. Resolve page ID from slug
    const listRes = await fetchWithTimeout(`${API_URL}/layout`, { next: { revalidate: 60 } });
    if (!listRes.ok) {
      return null;
    }
    const allPages = await listRes.json();

    const matchPage = allPages.find(p => p.name.toLowerCase() === slug.toLowerCase()) ||
      allPages.find(p => p.name.toLowerCase() === 'home') ||
      (allPages.length > 0 ? allPages[0] : null);

    if (!matchPage) {
      return null;
    }

    // 2. Fetch full layout details
    const layoutRes = await fetchWithTimeout(`${API_URL}/layout/${matchPage.id}`, { next: { revalidate: 60 } });
    if (!layoutRes.ok) return null;
    const layout = await layoutRes.json();

    // 3. Pre-resolve news data for all cells in parallel
    if (layout?.PageSections) {
      const fetchPromises = [];

      for (const section of layout.PageSections) {
        const rows = section.rows || section.Rows || [];
        for (const row of rows) {
          const columns = row.columns || row.Columns || [];
          for (const cell of columns) {
            if (cell.contentType === 'news' && (cell.contentId || cell.tag)) {
              const fetchNews = async () => {
                try {
                  let newsItem = null;
                  if (cell.contentId) {
                    const nRes = await fetchWithTimeout(`${API_URL}/news/${cell.contentId}`, { next: { revalidate: 60 } });
                    if (nRes.ok) {
                      const data = await nRes.json();
                      newsItem = data.data || data.news || data;
                    }
                  } else if (cell.tag) {
                    const nRes = await fetchWithTimeout(`${API_URL}/news?tag=${cell.tag}&limit=1`, { next: { revalidate: 60 } });
                    if (nRes.ok) {
                      const data = await nRes.json();
                      const items = data.news || data.rows || [];
                      if (items.length > 0) newsItem = items[0];
                    }
                  }
                  cell.resolvedContent = newsItem;
                } catch (e) {
                  // Silently skip — will be fetched client-side
                }
              };
              fetchPromises.push(fetchNews());
            } else if (cell.contentType === 'image' && cell.contentId) {
              const fetchImage = async () => {
                try {
                  const iRes = await fetchWithTimeout(`${API_URL}/photos/${cell.contentId}`, { next: { revalidate: 60 } });
                  if (iRes.ok) {
                    cell.resolvedContent = await iRes.json();
                  }
                } catch (e) {
                  // Silently skip
                }
              };
              fetchPromises.push(fetchImage());
            } else if ((cell.contentType === 'ads' || cell.contentType === 'ad') && cell.contentId) {
              const fetchAd = async () => {
                try {
                  const aRes = await fetchWithTimeout(`${API_URL}/ads/${cell.contentId}`, { next: { revalidate: 60 } });
                  if (aRes.ok) {
                    const data = await aRes.json();
                    cell.resolvedContent = data.data || data;
                  }
                } catch (e) {
                  // Silently skip
                }
              };
              fetchPromises.push(fetchAd());
            }
          }
        }
      }

      // Execute all fetches in parallel
      if (fetchPromises.length > 0) {
        await Promise.all(fetchPromises);
      }
    }

    return layout;
  } catch (err) {
    return null;
  }
}

export default async function HomePage() {
  const initialData = await getPageData('home');

  return (
    <>
      <ScrollToSection />
      <Header />
      <main className="main-content custom-font">
        <PageRenderer slug="home" initialLayout={initialData} />
      </main>
      <Footer />
    </>
  );
}

