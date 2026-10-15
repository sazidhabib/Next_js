"use client";
import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useMenu } from '../providers/MenuProvider';
import { useSettings } from '../providers/SettingsProvider';
import { formatBengaliDate } from '@/app/lib/dateUtils';
import HeaderAd from './HeaderAd';
import ThemeToggle from './ThemeToggle';

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
    setCurrentDate(formatBengaliDate(new Date()));
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

  // Track screen size and scroll direction smoothly
  useEffect(() => {
    setIsMediumOrSmaller(window.innerWidth < 992);
    lastScrollY.current = window.scrollY;

    const handleResize = () => {
      setIsMediumOrSmaller(window.innerWidth < 992);
    };

    let ticking = false;
    let accumulatedDelta = 0;
    let prevScrollY = window.scrollY;
    const SCROLL_THRESHOLD = 140; // Height of top-bar and site logo before auto-hide takes effect
    const DELTA_MIN = 8; // Filter out micro-scroll vibrations / trackpad bounce

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - prevScrollY;

      // Close mobile sidebar if scrolling down significantly
      if (showSidebar && diff > 10) {
        setShowSidebar(false);
      }

      if (currentScrollY <= SCROLL_THRESHOLD) {
        // Near top of page: hide the floating sticky navbar (default in-page navbar is already visible)
        setShowScrollingNavbar(false);
        accumulatedDelta = 0;
      } else {
        // Scrolled down past header area
        if (diff > 0) {
          // Scrolling DOWN: reset negative delta and accumulate down delta
          if (accumulatedDelta < 0) accumulatedDelta = 0;
          accumulatedDelta += diff;
          if (accumulatedDelta >= DELTA_MIN) {
            setShowScrollingNavbar(false);
          }
        } else if (diff < 0) {
          // Scrolling UP: reset positive delta and accumulate up delta
          if (accumulatedDelta > 0) accumulatedDelta = 0;
          accumulatedDelta += diff;
          if (Math.abs(accumulatedDelta) >= DELTA_MIN) {
            setShowScrollingNavbar(true);
          }
        }
      }

      prevScrollY = currentScrollY;
      lastScrollY.current = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

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

  const renderDesktopNavbarInner = () => (
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
      <div className="nav-actions d-flex justify-content-end align-items-center">
        <ThemeToggle showLabel={false} />
      </div>
    </div>
  );

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
              <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer" className="text-white"><i className="fa-brands fa-facebook-f"></i></a>
            )}
            {settings?.social?.instagram && (
              <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="text-white"><i className="fa-brands fa-instagram"></i></a>
            )}
            {settings?.social?.linkedin && (
              <a href={settings.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-white"><i className="fa-brands fa-linkedin-in"></i></a>
            )}
            {settings?.social?.youtube && (
              <a href={settings.social.youtube} target="_blank" rel="noopener noreferrer" className="text-white"><i className="fa-brands fa-youtube"></i></a>
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
          className="mobile-topbardef d-flex justify-content-between align-items-center px-3 py-2 shadow-sm w-100"
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
              className="h-14 w-auto md:h-14 lg:h-16"
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>
          <div className="d-flex align-items-center">
            <ThemeToggle size="sm" />
          </div>
        </div>
      )}

      {/* Top Bar hidden (smooth floating on scroll up) */}
      {isMediumOrSmaller && (
        <div
          className={`mobile-topbar d-flex justify-content-between align-items-center px-3 py-2 shadow-sm position-fixed w-100 ${showScrollingNavbar ? 'is-visible' : 'is-hidden'}`}
          style={{
            top: 0,
            left: 0,
            right: 0,
            transform: showScrollingNavbar ? "translateY(0)" : "translateY(-100%)",
            transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease",
            pointerEvents: showScrollingNavbar ? "auto" : "none",
            visibility: showScrollingNavbar ? "visible" : "hidden",
            zIndex: 1060,
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
              className="h-10 w-auto md:h-10 lg:h-12"
              style={{ objectFit: 'contain' }}
            />
          </Link>
          <div className="d-flex align-items-center">
            <ThemeToggle size="sm" />
          </div>
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
              <div className="modal-header border-0 d-flex justify-content-between align-items-center">
                <h5 className="modal-title m-0">মেনু</h5>
                <div className="d-flex align-items-center gap-2">
                  <ThemeToggle size="sm" />
                  <button type="button" className="btn-close btn-close-white" onClick={toggleSidebar}></button>
                </div>
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
        <>
          {/* Main In-Flow Desktop Navbar (Never causes layout shift) */}
          <div className="site-header position-relative" style={{ zIndex: 1020 }}>
            <div className="main-navbar-custom">
              {renderDesktopNavbarInner()}
            </div>
          </div>

          {/* Floating Smooth Auto-Hiding Navbar (Appears seamlessly on scroll up) */}
          <div
            className={`main-navbar-custom sticky-floating-navbar ${showScrollingNavbar ? 'is-visible' : 'is-hidden'}`}
            aria-hidden={!showScrollingNavbar}
          >
            {renderDesktopNavbarInner()}
          </div>
        </>
      )}

      {/* Header Ad */}
      <HeaderAd />

    </header>
  );

};

export default Header;
