import ScrollToSection from '../components/ScrollToSection';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AboutUsPage from '../components/AboutUsPage';

async function getAboutData() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${API_URL}/about`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Server-side fetch error (about):', err);
    return null;
  }
}

export async function generateMetadata() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const slug = 'about-us';
    
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
        console.error('Error fetching about-us metadata:', error);
    }
    
    return {
        title: 'About Us',
    };
}

export default async function AboutUsRoute() {
    const initialData = await getAboutData();
    
    return (
        <>
            <ScrollToSection />
            <Header />
            <AboutUsPage initialData={initialData} />
            <Footer />
        </>
    );
}
