import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css/animate.min.css';
import { AuthProvider } from './providers/AuthProvider';
import { MenuProvider } from './providers/MenuProvider';
import { SettingsProvider } from './providers/SettingsProvider';
import { CustomHelmetProvider } from './providers/HelmetProvider';
import { FaviconUpdater } from './providers/FaviconUpdater';
import { ToastContainer } from 'react-toastify';

async function getSiteSettings() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${API_URL}/designs?search=site-settings`, {
      next: { revalidate: 3600 },
      cache: 'force-cache'
    });
    const data = res.ok ? await res.json() : null;
    const designs = data?.designs || data || [];
    const siteSettings = designs.find(d => d.slug === 'site-settings');
    return siteSettings?.design_data || {};
  } catch (err) {
    return {};
  }
}

export async function generateMetadata() {
  const settings = await getSiteSettings();
  const siteName = settings?.siteNameBn || 'পাঠকবন্ধু';
  const faviconPath = settings?.favicon || '/favicon.ico';

  // Ensure favicon is a valid file path, not a data URL
  const isValidPath = faviconPath && !faviconPath.startsWith('data:');
  const favicon = isValidPath ? faviconPath : '/favicon.ico';

  return {
    title: `${siteName} - সংবাদ পোর্টাল`,
    description: settings?.seo?.description || 'স্বাধীন, সত্য ও বস্তুনিষ্ঠ সংবাদ মাধ্যম',
    icons: {
      icon: favicon,
    }
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body suppressHydrationWarning>
        <CustomHelmetProvider>
          <AuthProvider>
            <MenuProvider>
              <SettingsProvider>
                <FaviconUpdater />
                {children}
                <ToastContainer position="top-right" autoClose={3000} />
              </SettingsProvider>
            </MenuProvider>
          </AuthProvider>
        </CustomHelmetProvider>
      </body>
    </html>
  );
}
