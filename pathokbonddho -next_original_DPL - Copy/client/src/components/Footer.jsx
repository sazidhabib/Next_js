import React from 'react';
import { MdEmail } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useMenu } from '../store/MenuContext';

const Footer = () => {
    const { menus, loading } = useMenu();

    return (
        <footer className="bg-dark text-white pt-5 pb-3 mt-auto custom-font" style={{ borderTop: '4px solid #006a60' }}>
            <div className="container">
                <div className="row mb-4">
                    {/* Brand Column */}
                    <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                        <Link to="/" className="text-decoration-none d-inline-block mb-3">
                            <img src="/images/Logo.png" alt="Pathokbonddho Logo" height="80" className=" bg-white rounded p-1" />
                        </Link>
                        <p className="text-light opacity-75 medium lh-lg">
                            সত্য, বস্তুনিষ্ঠ ও নিরপেক্ষ সংবাদ পরিবেশনে অঙ্গীকারবদ্ধ।
                            দেশ-বিদেশের সর্বশেষ খবর, রাজনীতি, অর্থনীতি, খেলাধুলা ও বিনোদনের সকল খবর সবার আগে জানতে আমাদের সাথেই থাকুন।
                        </p>
                        <div className="d-flex gap-3 mt-4">
                            <a href="https://www.facebook.com/kamrul.hasan.75286" target="_blank" rel="noopener noreferrer" className="text-white hover-opacity transition" style={{ transition: 'opacity 0.2s', opacity: 0.8 }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.8}>
                                <i className="fab fa-facebook-f fs-5"></i>
                            </a>
                            <a href="#" className="text-white hover-opacity transition" style={{ transition: 'opacity 0.2s', opacity: 0.8 }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.8}>
                                <i className="fa-brands fa-x-twitter fs-5"></i>
                            </a>
                            <a href="https://www.instagram.com/kamrul4112/?igsh=cGNhMnp6ZW9nNHFt&utm_source=qr#" target="_blank" rel="noopener noreferrer" className="text-white hover-opacity transition" style={{ transition: 'opacity 0.2s', opacity: 0.8 }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.8}>
                                <i className="fab fa-instagram fs-5"></i>
                            </a>
                            <a href="https://www.linkedin.com/in/kamrul-hasan-journalist/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-white hover-opacity transition" style={{ transition: 'opacity 0.2s', opacity: 0.8 }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.8}>
                                <i className="fab fa-linkedin-in fs-5"></i>
                            </a>
                            <a href="#" className="text-white hover-opacity transition" style={{ transition: 'opacity 0.2s', opacity: 0.8 }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.8}>
                                <i className="fab fa-youtube fs-5"></i>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links Column */}
                    <div className="col-lg-4 col-md-6 mb-4 mb-lg-0 px-lg-5">
                        <h5 className="text-uppercase mb-4 fw-bold text-start" style={{ color: '#006a60' }}>গুরুত্বপূর্ণ লিংক</h5>
                        {loading ? (
                            <div className="text-muted small">Loading menus...</div>
                        ) : (
                            <ul className="list-unstyled d-flex flex-wrap gap-2">
                                {menus.sort((a, b) => a.order - b.order).slice(0, 10).map((menu, index) => (
                                    <li key={menu._id || index} style={{ width: '45%' }}>
                                        <Link
                                            to={menu.path.startsWith('/') ? menu.path : `/${menu.path}`}
                                            className="text-light text-decoration-none opacity-75 medium transition d-flex align-items-center"
                                            style={{ transition: 'all 0.2s' }}
                                            onMouseOver={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = '#006a60'; e.currentTarget.style.transform = 'translateX(5px)'; }}
                                            onMouseOut={e => { e.currentTarget.style.opacity = 0.75; e.currentTarget.style.color = ''; e.currentTarget.style.transform = 'translateX(0)'; }}
                                        >
                                            <i className="fas fa-angle-right me-2" style={{ fontSize: '10px' }}></i>
                                            {menu.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Contact & Address Column */}
                    <div className="col-lg-4 col-md-12">
                        <h5 className="text-uppercase mb-4 fw-bold text-start" style={{ color: '#006a60' }}>যোগাযোগ</h5>
                        <ul className="list-unstyled text-light opacity-75 medium lh-lg">
                            <li className="d-flex align-items-start mb-3">
                                <i className="fas fa-map-marker-alt mt-1 me-3 text-white fs-5 opacity-100"></i>
                                <span>কামরুল হাসান, ঢাকা, বাংলাদেশ</span>
                            </li>
                            <li className="d-flex align-items-center mb-3">
                                <MdEmail className="me-3 text-white fs-5 opacity-100" />
                                <a href="mailto:me@kamrulhasan.info" className="text-light text-decoration-none hover-opacity transition" style={{ transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.75}>
                                    me@kamrulhasan.info
                                </a>
                            </li>
                            <li className="d-flex align-items-center">
                                <i className="fas fa-phone-alt me-3 text-white fs-5 opacity-100"></i>
                                <span>যোগাযোগের নম্বর শীঘ্রই আসছে...</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr className="border-secondary mb-4" />

                {/* Bottom Bar */}
                <div className="row align-items-center pb-2">
                    <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                        <small className="text-light opacity-75">
                            &copy; {new Date().getFullYear()} পাঠকবন্ধু. সকল অধিকার সংরক্ষিত।
                        </small>
                    </div>
                    <div className="col-md-6 text-center text-md-end">
                        <div className="d-inline-flex gap-3">
                            <a href="/nitimala.html" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-none opacity-75 small transition hover-opacity" style={{ transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.75}>
                                নীতিমালা
                            </a>
                            <span className="text-secondary opacity-50">|</span>
                            <Link className="text-light text-decoration-none opacity-75 small transition hover-opacity" style={{ transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.75} to="/about-us">
                                আমাদের সম্পর্কে
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
