"use client";
import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useMenu } from '../providers/MenuProvider';
import { useSettings } from '../providers/SettingsProvider';
import { Spinner } from 'react-bootstrap';

const normalizePath = (path, includeQuery = false) => {
  if (!path) return '/';
  const [base, query] = path.split('?');
  const normalizedBase = base.replace(/\/$/, '') || '/';
  return includeQuery && query ? `${normalizedBase}?${query}` : normalizedBase;
};

const Header = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMediumOrSmaller, setIsMediumOrSmaller] = useState(false);
  const { menus, loading, getMenuByOrder } = useMenu();
  const { settings } = useSettings();
  const pathname = usePathname();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;

  const router = useRouter();
  const lastScrollY = useRef(0);
  const [showScrollingNavbar, setShowScrollingNavbar] = useState(false);
  const normalizedPathname = normalizePath(pathname);

  const [currentDate, setCurrentDate] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const date = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    setCurrentDate(date.toLocaleDateString('bn-BD', options));
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Render menu links dynamically
  const renderMenuLinks = (onClickHandler = null) => {
    if (loading) return <li>Loading menus...</li>;

    return menus.sort((a, b) => a.order - b.order).map((menu, index) => {
      const fullPath = menu.path.startsWith('/') ? menu.path : `/${menu.path}`;
      const hasQuery = fullPath.includes('?');

      const menuPathNormalized = normalizePath(fullPath, false);
      const isBasePathActive = normalizedPathname === menuPathNormalized;

      let isActive = isBasePathActive;

      // If menu path has query params, we need to check them too
      if (hasQuery && isBasePathActive && searchParams) {
        const targetParams = new URLSearchParams(fullPath.split('?')[1]);
        isActive = Array.from(targetParams.entries()).every(([key, value]) =>
          searchParams.get(key) === value
        );
      } else if (!hasQuery && isBasePathActive && searchParams && searchParams.toString()) {
        // If this is a base path (like /news) but there are query params active
        // we might NOT want to show it as active if there's a more specific menu item
        // But for now, let's stick to the Admin pattern: 
        // "All News" is not active if a specific type is selected.
        if (menuPathNormalized === '/news' && searchParams.get('category')) {
          isActive = false;
        }
      }

      return (
        <li className="nav-item" key={menu._id || index}>
          <Link
            href={fullPath}
            className={`nav-link ${isActive ? 'active fw-bold' : 'text-white'}`}
            onClick={onClickHandler}
          >
            {menu.name}
          </Link>
        </li>
      );
    });
  };

  const homeMenu = getMenuByOrder(1);

  // Track screen size on resize
  useEffect(() => {
    // FIX 1b: Set initial values inside useEffect
    setIsMediumOrSmaller(window.innerWidth < 992);
    lastScrollY.current = window.scrollY;

    const handleResize = () => {
      setIsMediumOrSmaller(window.innerWidth < 992);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (showSidebar && currentScrollY > lastScrollY.current) {
        setShowSidebar(false);
      }

      if (currentScrollY < 400) {
        setShowScrollingNavbar(false);
      } else if (currentScrollY < lastScrollY.current) {
        // scrolling up
        setShowScrollingNavbar(true);
      } else {
        // scrolling down
        setShowScrollingNavbar(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [showSidebar]);

  const shouldShowMobileSidebar = isMediumOrSmaller && showSidebar;

  const toggleSidebar = () => {
    if (isMediumOrSmaller) {
      setShowSidebar(prev => !prev);
    }
  };

  return (
    <header className="header_contentent custom-font">
      {/* Green Top Bar - All Devices */}
      <div className="top-bar-custom-wrapper" style={{ backgroundColor: '#006a60', color: 'white' }}>
        <div className="top-bar-custom container px-3 px-lg-0" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 0',
          fontSize: '0.85rem'
        }}>
          <div className="top-bar-left">
            <span>{currentDate || '২৮ ফেব্রুয়ারি, ২০২৬'}</span>
          </div>
          <div className="top-bar-right d-flex gap-3 align-items-center">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="d-flex align-items-center bg-white rounded px-2 py-1" style={{ border: '1px solid #ccc' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="খুঁজুন..."
                  className="border-0 small"
                  style={{ outline: 'none', width: '120px', fontSize: '0.8rem', color: '#333' }}
                  autoFocus
                />
                <button type="submit" className="border-0 bg-transparent p-0 text-dark">
                  <i className="fas fa-search small"></i>
                </button>
                <i className="fas fa-times ms-2 text-muted small cursor-pointer" onClick={() => setIsSearchOpen(false)}></i>
              </form>
            ) : (
              <i className="fas fa-search text-white small cursor-pointer" onClick={() => setIsSearchOpen(true)}></i>
            )}
            {settings?.social?.facebook && (
              <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer" className="text-white"><i className="fab fa-facebook-f"></i></a>
            )}
            {settings?.social?.instagram && (
              <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="text-white"><i className="fab fa-instagram"></i></a>
            )}
            {settings?.social?.linkedin && (
              <a href={settings.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-white"><i className="fab fa-linkedin-in"></i></a>
            )}
            {settings?.social?.youtube && (
              <a href={settings.social.youtube} target="_blank" rel="noopener noreferrer" className="text-white"><i className="fab fa-youtube"></i></a>
            )}
            {settings?.social?.twitter && (
              <a href={settings.social.twitter} target="_blank" rel="noopener noreferrer" className="text-white"><i className="fa-brands fa-x-twitter"></i></a>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Top Bar */}
      {isMediumOrSmaller && (
        <div
          className="mobile-topbardef d-flex justify-content-between align-items-center px-3 py-2 bg-white shadow-sm w-100"
        >
          <div className="hamburger" onClick={toggleSidebar}>
            <i className="fas fa-bars text-dark fs-4"></i>
          </div>
          <Link href="/" className="mobile-logo">
            <Image
              src={settings?.logo || "/images/Logo.png"}
              alt="Pathokbonddho Logo"
              width={100}
              height={35}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>
        </div>
      )}

      {/* Top Bar hidden */}
      {isMediumOrSmaller && (
        <div
          className="mobile-topbar d-flex justify-content-between align-items-center px-3 py-2 bg-white shadow-sm position-fixed w-100"
          style={{
            top: showScrollingNavbar ? "0" : "-150px",
            transition: "top 0.3s ease-in-out",
            zIndex: 1050,
          }}
        >
          <div className="hamburger" onClick={toggleSidebar}>
            <i className="fas fa-bars text-dark fs-4"></i>
          </div>
          <Link href="/" className="mobile-logo">
            <Image
              src={settings?.logo || "/images/Logo.png"}
              alt="Pathokbonddho Logo"
              width={100}
              height={35}
              style={{ objectFit: 'contain' }}
            />
          </Link>
        </div>
      )}




      {/* Bootstrap Modal Sidebar for Small/Medium Devices */}
      {shouldShowMobileSidebar && (
        <div
          className="modal d-block bg-opacity-75"
          tabIndex="-1"
          onClick={toggleSidebar}
          style={{ top: showSidebar ? "0" : "-100px", transition: "top 0.3s, opacity 0.3s", opacity: showSidebar ? 1 : 0 }}
        >
          <div
            className="modal-dialog"
            style={{ maxWidth: "300px", margin: "0" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-content bg-dark text-white">
              <div className="modal-header border-0">
                <h5 className="modal-title">মেনু</h5>
                <button type="button" className="btn-close btn-close-white" onClick={toggleSidebar}></button>
              </div>
              <div className="modal-body d-flex flex-column align-items-start">
                {/* Mobile Search In Sidebar */}
                <form onSubmit={handleSearch} className="w-100 mb-3 d-flex align-items-center bg-white rounded px-3 py-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="খুঁজুন..."
                    className="border-0 w-100"
                    style={{ outline: 'none', color: '#333' }}
                  />
                  <button type="submit" className="border-0 bg-transparent p-0 text-dark">
                    <i className="fas fa-search"></i>
                  </button>
                </form>

                <ul className="nav flex-column w-100">
                  {renderMenuLinks(() => setShowSidebar(false))}
                </ul>

                <div className="social-icons mt-3">
                  {settings?.social?.linkedin && (
                    <a key="linkedin" href={settings.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-white me-2"><i className="fa-brands fa-linkedin-in"></i></a>
                  )}
                  {settings?.social?.twitter && (
                    <a key="twitter" href={settings.social.twitter} target="_blank" rel="noopener noreferrer" className="text-white me-2"><i className="fa-brands fa-x-twitter"></i></a>
                  )}
                  {settings?.social?.facebook && (
                    <a key="facebook" href={settings.social.facebook} target="_blank" rel="noopener noreferrer" className="text-white me-2"><i className="fa-brands fa-facebook-f"></i></a>
                  )}
                  {settings?.social?.instagram && (
                    <a key="instagram" href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="text-white me-2"><i className="fa-brands fa-instagram"></i></a>
                  )}
                  {settings?.social?.youtube && (
                    <a key="youtube" href={settings.social.youtube} target="_blank" rel="noopener noreferrer" className="text-white me-2"><i className="fa-brands fa-youtube"></i></a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isMediumOrSmaller && (
        <div className="site-header">
          {/* White Sticky Navbar */}
          <div className={`main-navbar-custom ${showScrollingNavbar ? 'sticky' : ''}`}>
            <div className="inside_main container">
              <Link href="/" className="logo-container d-flex align-items-center gap-3" style={{ textDecoration: 'none' }}>
                <Image
                  src={settings?.logo || "/images/Logo.png"}
                  alt={settings?.siteNameBn || "Logo"}
                  width={150}
                  height={50}
                  className="logo-logo"
                  priority
                  style={{ objectFit: 'contain' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h1 style={{ margin: 0, color: '#006a60', fontSize: '24px', fontWeight: 'bold' }}>
                    {settings?.siteNameBn || 'পাঠকবন্ধু'}
                  </h1>
                  {settings?.tagline && (
                    <p style={{ margin: 0, color: '#555', fontSize: '12px', fontStyle: 'italic' }}>
                      {settings.tagline}
                    </p>
                  )}
                </div>
              </Link>
              <ul className="nav-custom-links">
                {menus.sort((a, b) => a.order - b.order).map((menu, index) => {
                  const menuPath = normalizePath(menu.path.startsWith('/') ? menu.path : `/${menu.path}`);
                  const isActive = normalizedPathname === menuPath;
                  return (
                    <li key={menu._id || index}>
                      <Link
                        href={menuPath}
                        className={`nav-link-custom fw-bold ${isActive ? 'active' : ''}`}
                      >
                        {menu.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

    </header>
  );

};

export default Header;
