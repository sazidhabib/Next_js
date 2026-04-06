import { useEffect, useState, useRef } from "react";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToSection from "./ScrollToSection";

const AboutUsPage = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef([]);

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/sections/about`;

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await axios.get(API_URL);
        setAboutData(response.data);
      } catch (err) {
        console.error("Error fetching about data:", err);
        setError("Failed to load about section content");
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.dataset.section]));
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [loading]);

  const addRef = (el, index) => {
    sectionRefs.current[index] = el;
  };

  const imageUrl = aboutData?.imageUrl
    ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${aboutData.imageUrl.replace(/^\/+/, "")}`
    : "/images/kamrul_hasan_bio2.jpg";

  const stats = [
    { icon: "fas fa-calendar-alt", value: "৩০+", label: "বছরের অভিজ্ঞতা" },
    { icon: "fas fa-trophy", value: "২০+", label: "জাতীয় ও আন্তর্জাতিক পুরস্কার" },
    { icon: "fas fa-newspaper", value: "৫০০০+", label: "প্রকাশিত প্রতিবেদন" },
    { icon: "fas fa-users", value: "১ লক্ষ+", label: "পাঠক ও অনুসারী" },
  ];

  if (loading) {
    return (
      <>
        <Header />
        <div className="aboutus-loading">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">লোড হচ্ছে...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="aboutus-error">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <Link to="/" className="btn aboutus-btn-primary">প্রধান পাতায় ফিরুন</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <ScrollToSection />
      <Header />
      <main className="aboutus-page">

        {/* ═══════════════ HERO SECTION ═══════════════ */}
        <section className="aboutus-hero">
          <div className="aboutus-hero-overlay"></div>
          <div className="aboutus-hero-content">
            <div className="aboutus-hero-badge">আমাদের সম্পর্কে</div>
            <h1 className="aboutus-hero-title">পাঠকবন্ধু</h1>
            <p className="aboutus-hero-subtitle">
              সত্য, বস্তুনিষ্ঠ ও নিরপেক্ষ সংবাদ পরিবেশনে অঙ্গীকারবদ্ধ
            </p>
            <div className="aboutus-hero-divider"></div>
          </div>
        </section>

        {/* ═══════════════ BIO SECTION ═══════════════ */}
        <section
          className={`aboutus-bio ${visibleSections.has("bio") ? "aboutus-visible" : ""}`}
          ref={(el) => addRef(el, 0)}
          data-section="bio"
        >
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-5">
                <div className="aboutus-bio-image-wrapper">
                  <div className="aboutus-bio-image-accent"></div>
                  <img
                    src={imageUrl}
                    alt="পাঠকবন্ধুর লোগো"
                    className="aboutus-bio-image"
                  />
                  <div className="aboutus-bio-image-badge">
                    <i className="fas fa-pen-nib"></i>
                    <span>পাঠকবন্ধুর লোগো</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="aboutus-bio-content">
                  <div className="aboutus-section-tag">
                    <span></span>পরিচিতি
                  </div>
                  <h2 className="aboutus-bio-title">
                    {aboutData?.title || "কামরুল হাসান"}
                  </h2>
                  <p className="aboutus-bio-description custom-font">
                    {aboutData?.description ||
                      `বরেন্দ্রভূমির সন্তান। সাংবাদিকতা করছেন তিন দশক ধরে। অর্জনের ঝুলিতে আছে অপরাধবিষয়ক রিপোর্টিংয়ে দীর্ঘদিনের কাজের অভিজ্ঞতা। সেই সূত্রে জুটেছে দেশি-বিদেশি পুরস্কারও। পেশাগত জীবনে তিনি সত্য ও বস্তুনিষ্ঠ সাংবাদিকতার জন্য নিবেদিত। তাঁর লেখনী ও প্রতিবেদনে প্রতিফলিত হয় সমাজের অসঙ্গতি, মানুষের কণ্ঠস্বর এবং পরিবর্তনের আকাঙ্ক্ষা।`}
                  </p>
                  <div className="aboutus-bio-social">
                    <a href="https://www.facebook.com/kamrul.hasan.75286" target="_blank" rel="noopener noreferrer" className="aboutus-social-link">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://www.instagram.com/kamrul4112/" target="_blank" rel="noopener noreferrer" className="aboutus-social-link">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/kamrul-hasan-journalist/" target="_blank" rel="noopener noreferrer" className="aboutus-social-link">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" className="aboutus-social-link">
                      <i className="fab fa-x-twitter"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ STATS SECTION ═══════════════ */}
        <section
          className={`aboutus-stats ${visibleSections.has("stats") ? "aboutus-visible" : ""}`}
          ref={(el) => addRef(el, 1)}
          data-section="stats"
        >
          <div className="container">
            <div className="row g-4">
              {stats.map((stat, index) => (
                <div className="col-6 col-md-3" key={index}>
                  <div className="aboutus-stat-card" style={{ animationDelay: `${index * 0.15}s` }}>
                    <div className="aboutus-stat-icon">
                      <i className={stat.icon}></i>
                    </div>
                    <div className="aboutus-stat-value">{stat.value}</div>
                    <div className="aboutus-stat-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ MISSION / VISION ═══════════════ */}
        <section
          className={`aboutus-mission ${visibleSections.has("mission") ? "aboutus-visible" : ""}`}
          ref={(el) => addRef(el, 2)}
          data-section="mission"
        >
          <div className="container">
            <div className="text-center mb-5">
              <div className="aboutus-section-tag center">
                <span></span>আমাদের লক্ষ্য
              </div>
              <h2 className="aboutus-section-title">মিশন ও ভিশন</h2>
            </div>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="aboutus-glass-card mission-card">
                  <div className="aboutus-glass-icon">
                    <i className="fas fa-bullseye"></i>
                  </div>
                  <h3>আমাদের মিশন</h3>
                  <p>
                    সত্য ও নিরপেক্ষ সংবাদ পরিবেশনের মাধ্যমে পাঠকদের কাছে বিশ্বস্ত তথ্য পৌঁছে দেওয়া। অনুসন্ধানী সাংবাদিকতার মাধ্যমে সমাজের অসঙ্গতি তুলে ধরা এবং জনগণের কণ্ঠস্বর হিসেবে কাজ করা।
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="aboutus-glass-card vision-card">
                  <div className="aboutus-glass-icon">
                    <i className="fas fa-eye"></i>
                  </div>
                  <h3>আমাদের ভিশন</h3>
                  <p>
                    একটি সচেতন ও তথ্যসমৃদ্ধ সমাজ গড়ে তোলা যেখানে প্রতিটি মানুষ সঠিক তথ্যের ভিত্তিতে সিদ্ধান্ত নিতে পারে। ডিজিটাল প্ল্যাটফর্মের মাধ্যমে মানসম্মত সাংবাদিকতাকে সবার কাছে সহজলভ্য করা।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ VALUES SECTION ═══════════════ */}
        <section
          className={`aboutus-values ${visibleSections.has("values") ? "aboutus-visible" : ""}`}
          ref={(el) => addRef(el, 3)}
          data-section="values"
        >
          <div className="container">
            <div className="text-center mb-5">
              <div className="aboutus-section-tag center">
                <span></span>মূল্যবোধ
              </div>
              <h2 className="aboutus-section-title">আমাদের মূলনীতি</h2>
            </div>
            <div className="row g-4">
              {[
                { icon: "fas fa-shield-alt", title: "সত্যনিষ্ঠা", desc: "প্রতিটি সংবাদ যাচাই-বাছাই করে প্রকাশ করা আমাদের প্রথম অঙ্গীকার।" },
                { icon: "fas fa-balance-scale", title: "নিরপেক্ষতা", desc: "পক্ষপাতহীন ও ভারসাম্যপূর্ণ সংবাদ পরিবেশন আমাদের মূল লক্ষ্য।" },
                { icon: "fas fa-handshake", title: "দায়বদ্ধতা", desc: "পাঠক ও সমাজের প্রতি আমাদের দায়বদ্ধতা সর্বোচ্চ।" },
                { icon: "fas fa-lightbulb", title: "উদ্ভাবন", desc: "আধুনিক প্রযুক্তি ব্যবহার করে সংবাদ পরিবেশনে নতুন মাত্রা যোগ করা।" },
              ].map((value, index) => (
                <div className="col-sm-6 col-lg-3" key={index}>
                  <div className="aboutus-value-card" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="aboutus-value-icon">
                      <i className={value.icon}></i>
                    </div>
                    <h4>{value.title}</h4>
                    <p>{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ CTA SECTION ═══════════════ */}
        <section className="aboutus-cta">
          <div className="container text-center">
            <h2>আমাদের সাথে যুক্ত থাকুন</h2>
            <p>সর্বশেষ সংবাদ ও আপডেটের জন্য আমাদের অনুসরণ করুন</p>
            <div className="aboutus-cta-buttons">
              <Link to="/" className="aboutus-btn-primary">
                <i className="fas fa-home me-2"></i>প্রধান পাতা
              </Link>
              <a href="https://www.facebook.com/kamrul.hasan.75286" target="_blank" rel="noopener noreferrer" className="aboutus-btn-outline">
                <i className="fab fa-facebook-f me-2"></i>ফেসবুক
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
};

export default AboutUsPage;
