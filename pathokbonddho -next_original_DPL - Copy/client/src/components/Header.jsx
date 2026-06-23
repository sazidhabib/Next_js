import { useState, useEffect, useRef } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../index.css";
import { Link } from 'react-router-dom';
import { useMenu } from '../store/MenuContext';
import { Spinner } from 'react-bootstrap';
import axios from 'axios';



const Header = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMediumOrSmaller, setIsMediumOrSmaller] = useState(window.innerWidth < 992);
  const { menus, loading, getMenuByOrder } = useMenu();



  const lastScrollY = useRef(window.scrollY);
  const [showScrollingNavbar, setShowScrollingNavbar] = useState(false);




  // Render menu links dynamically
  const renderMenuLinks = (onClickHandler = null) => {
    if (loading) return <li>Loading menus...</li>;

    return menus.sort((a, b) => a.order - b.order).map((menu, index) => (
      <li className="nav-item" key={menu._id || index}>
        <Link
          to={menu.path.startsWith('/') ? menu.path : `/${menu.path}`}
          className="nav-link text-white"
          onClick={onClickHandler}
        >
          {menu.name}
        </Link>
      </li>
    ));
  };

  const homeMenu = getMenuByOrder(1);




  // Track screen size on resize
  useEffect(() => {
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
    <header className="header_contentent ">
      {/* Mobile Top Bar */}
      {isMediumOrSmaller && (
        <div
          className="mobile-topbardef d-flex justify-content-between align-items-center px-3 py-2 bg-dark w-100"

        >
          <div className="hamburger" onClick={toggleSidebar}>
            <i className="fas fa-bars text-white fs-4"></i>
          </div>
          <div className="social-iconst">
            <a key="linkedin" href="https://www.linkedin.com/in/kamrul-hasan-journalist/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-white me-2"><i className="fa-brands fa-linkedin-in"></i></a>
            <a key="twitter" href="#" className="text-white me-2"><i className="fa-brands fa-x-twitter"></i></a>
            <a key="facebook" href="https://www.facebook.com/kamrul.hasan.75286" target="_blank" rel="noopener noreferrer" className="text-white me-2"><i className="fa-brands fa-facebook-f"></i></a>
            <a key="instagram" href="https://www.instagram.com/kamrul4112/?igsh=cGNhMnp6ZW9nNHFt&utm_source=qr#" target="_blank" rel="noopener noreferrer" className="text-white"><i className="fa-brands fa-instagram"></i></a>
          </div>
        </div>
      )}

      {/* Top Bar hidden */}
      {isMediumOrSmaller && (
        <div
          className="mobile-topbar d-flex justify-content-between align-items-center px-3 py-2 bg-dark position-fixed w-100"
          style={{
            top: showScrollingNavbar ? "0" : "-100px",
            transition: "top 0.3s ease-in-out",
            zIndex: 1050,
          }}
        >
          <div className="hamburger" onClick={toggleSidebar}>
            <i className="fas fa-bars text-white fs-4"></i>
          </div>
          <div className="social-iconst">
            <a key="linkedin" href="https://www.linkedin.com/in/kamrul-hasan-journalist/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-white me-2"><i className="fa-brands fa-linkedin-in"></i></a>
            <a key="twitter" href="#" className="text-white me-2"><i className="fa-brands fa-x-twitter"></i></a>
            <a key="facebook" href="https://www.facebook.com/kamrul.hasan.75286" target="_blank" rel="noopener noreferrer" className="text-white me-2"><i className="fa-brands fa-facebook-f"></i></a>
            <a key="instagram" href="https://www.instagram.com/kamrul4112/?igsh=cGNhMnp6ZW9nNHFt&utm_source=qr#" target="_blank" rel="noopener noreferrer" className="text-white"><i className="fa-brands fa-instagram"></i></a>
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
              <div className="modal-header border-0">
                <h5 className="modal-title">মেনু</h5>
                <button type="button" className="btn-close btn-close-white" onClick={toggleSidebar}></button>
              </div>
              <div className="modal-body d-flex flex-column align-items-start">
                <ul className="nav flex-column w-100">
                  {renderMenuLinks(() => setShowSidebar(false))}
                </ul>

                <div className="social-icons mt-3">
                  <a key="linkedin" href="https://www.linkedin.com/in/kamrul-hasan-journalist/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-white me-2"><i className="fa-brands fa-linkedin-in"></i></a>
                  <a key="twitter" href="#" className="text-white me-2"><i className="fa-brands fa-x-twitter"></i></a>
                  <a key="facebook" href="https://www.facebook.com/kamrul.hasan.75286" target="_blank" rel="noopener noreferrer" className="text-white me-2"><i className="fa-brands fa-facebook-f"></i></a>
                  <a key="instagram" href="https://www.instagram.com/kamrul4112/?igsh=cGNhMnp6ZW9nNHFt&utm_source=qr#" target="_blank" rel="noopener noreferrer" className="text-white"><i className="fa-brands fa-instagram"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isMediumOrSmaller && (
        <div className="site-header">
          {/* Top Bar */}
          <div className="top-bar-custom container" style={{ top: showScrollingNavbar ? "-50px" : "0", opacity: showScrollingNavbar ? 0 : 1, transition: "all 0.3s ease-in-out" }}>

            <div className="top-bar-left">
              <span>২৮ ফেব্রুয়ারি, ২০২৬</span>
            </div>
            <div className="top-bar-right">
              <a href="#"><i className="fas fa-search"></i></a>
              <a href="https://www.facebook.com/kamrul.hasan.75286" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
              <a href="https://www.instagram.com/kamrul4112/?igsh=cGNhMnp6ZW9nNHFt&utm_source=qr#" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
              <a href="https://www.linkedin.com/in/kamrul-hasan-journalist/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
            </div>
          </div>

          {/* White Sticky Navbar */}
          <div className={`main-navbar-custom ${showScrollingNavbar ? 'sticky' : ''}`}>
            <div className="inside_main container">
              <Link to="/" className="logo-container">
                <img src="/images/Logo.png" alt="Pathokbonddho Logo" className="logo-logo" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                <span style={{ display: 'none', color: '#006a60', fontSize: '28px', fontWeight: 'bold' }}>পাঠকবন্ধু</span>
              </Link>
              <ul className="nav-custom-links">
                {menus.sort((a, b) => a.order - b.order).map((menu, index) => (
                  <li key={menu._id || index}>
                    <Link
                      to={menu.path.startsWith('/') ? menu.path : `/${menu.path}`}
                      className={`nav-link-custom ${window.location.pathname === (menu.path.startsWith('/') ? menu.path : `/${menu.path}`) ? 'active' : ''}`}
                    >
                      {menu.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}

    </header>
  );

};

export default Header;
