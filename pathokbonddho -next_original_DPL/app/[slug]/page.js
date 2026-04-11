import ScrollToSection from '../components/ScrollToSection';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageRenderer from '../components/PageRenderer';

async function getPageData(slug) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const listRes = await fetch(`${API_URL}/layout`, { next: { revalidate: 60 } });
    if (!listRes.ok) return null;
    const allPages = await listRes.json();
    
    const matchPage = allPages.find(p => p.name.toLowerCase() === slug.toLowerCase()) || 
                      allPages[0];
    
    if (!matchPage) return null;

    const layoutRes = await fetch(`${API_URL}/layout/${matchPage.id}`, { next: { revalidate: 60 } });
    if (!layoutRes.ok) return null;
    const layout = await layoutRes.json();

    // 2. Pre-resolve news data for all cells in parallel
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
                    const nRes = await fetch(`${API_URL}/news/${cell.contentId}`, { next: { revalidate: 60 } });
                    if (nRes.ok) {
                      const data = await nRes.json();
                      newsItem = data.data || data.news || data;
                    }
                  } else if (cell.tag) {
                    const nRes = await fetch(`${API_URL}/news?tag=${cell.tag}&limit=1`, { next: { revalidate: 60 } });
                    if (nRes.ok) {
                      const data = await nRes.json();
                      const items = data.news || data.rows || [];
                      if (items.length > 0) newsItem = items[0];
                    }
                  }
                  cell.resolvedContent = newsItem;
                } catch (e) {
                  console.error('Error pre-fetching news for cell:', e);
                }
              };
              fetchPromises.push(fetchNews());
            } else if (cell.contentType === 'image' && cell.contentId) {
              const fetchImage = async () => {
                try {
                  const iRes = await fetch(`${API_URL}/photos/${cell.contentId}`, { next: { revalidate: 60 } });
                  if (iRes.ok) {
                    cell.resolvedContent = await iRes.json();
                  }
                } catch (e) {
                  console.error('Error pre-fetching image for cell:', e);
                }
              };
              fetchPromises.push(fetchImage());
            } else if ((cell.contentType === 'ads' || cell.contentType === 'ad') && cell.contentId) {
              const fetchAd = async () => {
                try {
                  const aRes = await fetch(`${API_URL}/ads/${cell.contentId}`, { next: { revalidate: 60 } });
                  if (aRes.ok) {
                    const data = await aRes.json();
                    cell.resolvedContent = data.data || data;
                  }
                } catch (e) {
                  console.error('Error pre-fetching ad for cell:', e);
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
    console.error('Server-side fetch error (slug):', err);
    return null;
  }
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    
    try {
        const response = await fetch(`${API_URL}/menus`, { next: { revalidate: 60 } });
        if (response.ok) {
            const data = await response.json();
            const menus = data.data || data || [];
            
            const menu = menus.find(m => {
                const cleanPath = m.path ? m.path.replace(/^\/+/, '') : '';
                return cleanPath.toLowerCase() === slug.toLowerCase();
            });
            
            if (menu) {
                return {
                    title: menu.metaTitle || menu.name,
                    ...(menu.metaDescription && { description: menu.metaDescription }),
                    ...(menu.metaKeywords && { keywords: menu.metaKeywords }),
                };
            }
        }
    } catch (error) {
        console.error('Error fetching menu metadata:', error);
    }
    
    return {
        title: slug.charAt(0).toUpperCase() + slug.slice(1),
    };
}

export default async function DynamicCategoryRoute({ params }) {
    const { slug } = await params;
    const initialData = await getPageData(slug);
    
    return (
        <>
            <ScrollToSection />
            <Header />
            <main className="main-content">
                <PageRenderer slug={slug} initialLayout={initialData} />
            </main>
            <Footer />
        </>
    );
}
