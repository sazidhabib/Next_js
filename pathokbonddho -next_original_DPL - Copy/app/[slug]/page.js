import ScrollToSection from '../components/ScrollToSection';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageRenderer from '../components/PageRenderer';

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

async function getPageData(slug) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
  try {
    const listRes = await fetchWithTimeout(`${API_URL}/layout`, { next: { revalidate: 60 } });
    if (!listRes.ok) return null;
    const allPages = await listRes.json();
    
    const matchPage = allPages.find(p => p.name.toLowerCase() === slug.toLowerCase()) || 
                      allPages[0];
    
    if (!matchPage) return null;

    const layoutRes = await fetchWithTimeout(`${API_URL}/layout/${matchPage.id}`, { next: { revalidate: 60 } });
    if (!layoutRes.ok) return null;
    const layout = await layoutRes.json();

    // 2. Pre-resolve news data for all cells using dynamic tagging where needed
    if (layout?.PageSections) {
      const fetchPromises = [];
      const dynamicTagsMap = {}; // { [tag]: [cell1, cell2, ...] }
      
      // Identify the current page's canonical name (e.g., "সাহিত্য") to match against tags
      const categoryName = matchPage?.name;

      for (const section of layout.PageSections) {
        const rows = [...(section.rows || section.Rows || [])].sort((a, b) => (a.rowOrder || 0) - (b.rowOrder || 0));
        for (const row of rows) {
          const columns = [...(row.columns || row.Columns || [])].sort((a, b) => (a.colOrder || 0) - (b.colOrder || 0));
          for (const cell of columns) {
            if (cell.merged && !cell.masterCell) continue;

            if (cell.contentType === 'news') {
              const isAuto = layout.autoNewsSelection || section.autoNewsSelection;
              
              if (isAuto) {
                // If auto-news is active, prioritize dynamic fetching
                // We group cells by their tag. If no tag is set, or it matches the current category name/slug,
                // we treat it as a "category-wide" cell to ensure they all share the same chronological pool.
                let effectiveTag = cell.tag || slug;
                
                // If the tag is the category name (e.g. "সাহিত্য") or matches the slug (e.g. "literature"),
                // or if it's a generic "col-X" tag, we canonicalize it to the slug so they are fetched together.
                const isJunkTag = effectiveTag.startsWith('col-');
                if (isJunkTag || effectiveTag === categoryName || (effectiveTag && effectiveTag.toLowerCase() === slug.toLowerCase())) {
                    effectiveTag = `_cat_${slug}`;
                }

                if (!dynamicTagsMap[effectiveTag]) dynamicTagsMap[effectiveTag] = [];
                dynamicTagsMap[effectiveTag].push(cell);
              } else if (cell.contentId) {
                const fetchNews = async () => {
                  try {
                    const nRes = await fetchWithTimeout(`${API_URL}/news/${cell.contentId}`, { next: { revalidate: 60 } });
                    if (nRes.ok) {
                      const data = await nRes.json();
                      cell.resolvedContent = data.data || data.news || data;
                    }
                  } catch (e) {
                    // Silently skip
                  }
                };
                fetchPromises.push(fetchNews());
              } else if (cell.tag) {
                if (!dynamicTagsMap[cell.tag]) dynamicTagsMap[cell.tag] = [];
                dynamicTagsMap[cell.tag].push(cell);
              }
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

      // Handle dynamic tag fetches natively across the entire layout
      for (let [tag, cells] of Object.entries(dynamicTagsMap)) {
        const count = cells.length;
        const fetchDynamicTag = async () => {
          try {
            let url;
            if (tag.startsWith('_cat_')) {
                // Primary category pool: fetch by category slug
                const actualSlug = tag.replace('_cat_', '');
                url = `${API_URL}/news?categories=${encodeURIComponent(actualSlug)}&limit=${count}`;
            } else {
                // Specific tag pool
                url = `${API_URL}/news?tag=${encodeURIComponent(tag)}&limit=${count}`;
            }

            const nRes = await fetchWithTimeout(url, { next: { revalidate: 60 } });
            let fetchedItems = [];
            if (nRes.ok) {
              const data = await nRes.json();
              fetchedItems = data.news || data.rows || [];
            }
            
            // Fallback for specific tags if no results found
            if (fetchedItems.length === 0 && !tag.startsWith('_cat_')) {
              const cRes = await fetchWithTimeout(`${API_URL}/news?categories=${encodeURIComponent(tag)}&limit=${count}`, { next: { revalidate: 60 } });
              if (cRes.ok) {
                const cData = await cRes.json();
                fetchedItems = cData.news || cData.rows || [];
              }
            }

            // Distribute sequentially across assigned layout grid cells
            cells.forEach((cell, idx) => {
              cell.resolvedContent = fetchedItems[idx] || null;
            });
          } catch (e) {
            // Silently skip
          }
        };
        fetchPromises.push(fetchDynamicTag());
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

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
    
    try {
        const response = await fetchWithTimeout(`${API_URL}/menus`, { next: { revalidate: 60 } });
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
        // Silently fall back to defaults
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

