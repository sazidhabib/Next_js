"use client";
import { useEffect, useState, useRef } from "react";
import { Spinner } from "react-bootstrap";
import Link from 'next/link';
import Image from 'next/image';
import "@fortawesome/fontawesome-free/css/all.min.css";
import api from '@/app/lib/api';
import { useSettings } from '../providers/SettingsProvider';

const AboutUsPage = ({ initialData }) => {
  const { settings } = useSettings();
  const [aboutData, setAboutData] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef([]);

  useEffect(() => {
    if (initialData) {
      setAboutData(initialData);
      setLoading(false);
      return;
    }

    const fetchAboutData = async () => {
      try {
        const response = await api.get('/about');
        setAboutData(response.data);
      } catch (err) {
        console.error("Error fetching about data:", err);
        setError("Failed to load about section content");
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, [initialData]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (loading) return;

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

  const getFullImageUrl = (path) => {
    if (!path) return "/images/kamrul_hasan_bio2.jpg";
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    // Ensure we append /uploads/ if it's just a filename
    const cleanPath = path.replace(/^\/+/, "");
    return cleanPath.startsWith('uploads/')
      ? `${baseUrl}/${cleanPath}`
      : `${baseUrl}/uploads/${cleanPath}`;
  };

  const imageUrl = getFullImageUrl(aboutData?.imageUrl);

  const statsArray = aboutData?.stats?.length > 0 ? aboutData.stats : [
    { icon: "fas fa-calendar-alt", number: "৩০+", label: "বছরের অভিজ্ঞতা" },
    { icon: "fas fa-trophy", number: "২০+", label: "জাতীয় ও আন্তর্জাতিক পুরস্কার" },
    { icon: "fas fa-newspaper", number: "৫০০০+", label: "প্রকাশিত প্রতিবেদন" },
    { icon: "fas fa-users", number: "১ লক্ষ+", label: "পাঠক ও অনুসারী" },
  ];

  const missionData = aboutData?.missionVision?.mission || {
    title: "আমাদের মিশন",
    icon: "fas fa-bullseye",
    description: "সত্য ও নিরপেক্ষ সংবাদ পরিবেশনের মাধ্যমে পাঠকদের কাছে বিশ্বস্ত তথ্য পৌঁছে দেওয়া। অনুসন্ধানী সাংবাদিকতার মাধ্যমে সমাজের অসঙ্গতি তুলে ধরা এবং জনগণের কণ্ঠস্বর হিসেবে কাজ করা।"
  };

  const visionData = aboutData?.missionVision?.vision || {
    title: "আমাদের ভিশন",
    icon: "fas fa-eye",
    description: "একটি সচেতন ও তথ্যসমৃদ্ধ সমাজ গড়ে তোলা যেখানে প্রতিটি মানুষ সঠিক তথ্যের ভিত্তিতে সিদ্ধান্ত নিতে পারে। ডিজিটাল প্ল্যাটফর্মের মাধ্যমে মানসম্মত সাংবাদিকতাকে সবার কাছে সহজলভ্য করা।"
  };

  const valuesArray = aboutData?.values?.length > 0 ? aboutData.values : [
    { icon: "fas fa-shield-alt", title: "সত্যনিষ্ঠা", description: "প্রতিটি সংবাদ যাচাই-বাছাই করে প্রকাশ করা আমাদের প্রথম অঙ্গীকার।" },
    { icon: "fas fa-balance-scale", title: "নিরপেক্ষতা", description: "পক্ষপাতহীন ও ভারসাম্যপূর্ণ সংবাদ পরিবেশন আমাদের মূল লক্ষ্য।" },
    { icon: "fas fa-handshake", title: "দায়বদ্ধতা", description: "পাঠক ও সমাজের প্রতি আমাদের দায়বদ্ধতা সর্বোচ্চ।" },
    { icon: "fas fa-lightbulb", title: "উদ্ভাবন", description: "আধুনিক প্রযুক্তি ব্যবহার করে সংবাদ পরিবেশনে নতুন মাত্রা যোগ করা।" },
  ];

  const socials = aboutData?.socialLinks || {};

  if (loading && !aboutData) {
    return (
      <div className="aboutus-loading d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (error && !aboutData) {
    return (
      <div className="aboutus-error text-center py-5">
        <i className="fas fa-exclamation-triangle fs-1 text-danger mb-3"></i>
        <p className="lead">{error}</p>
        <Link href="/" className="btn btn-primary">প্রধান পাতায় ফিরুন</Link>
      </div>
    );
  }

  return (
    <main className="aboutus-page custom-font">
      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="aboutus-hero">
        <div className="aboutus-hero-overlay"></div>
        <div className="aboutus-hero-content text-center">
          {aboutData?.introTag && <div className="aboutus-hero-badge">{aboutData.introTag}</div>}
          <h1 className="aboutus-hero-title">{aboutData?.heroTitle || "পাঠকবন্ধু"}</h1>
          <p className="aboutus-hero-subtitle">
            {aboutData?.heroSubtitle || "সত্য, বস্তুনিষ্ঠ ও নিরপেক্ষ সংবাদ পরিবেশনে অঙ্গীকারবদ্ধ"}
          </p>
          <div className="aboutus-hero-divider mx-auto"></div>
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
              <div className="aboutus-bio-image-wrapper position-relative">
                <div className="aboutus-bio-image-accent"></div>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '5/5' }}>
                  <Image
                    src={imageUrl}
                    alt={aboutData?.introTitle || "পাঠকবন্ধুর লোগো"}
                    fill
                    className="aboutus-bio-image object-fit-cover rounded shadow"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                  />
                </div>
                <div className="aboutus-bio-image-badge">
                  <i className="fas fa-pen-nib"></i>
                  <span>{aboutData?.introTag || "পরিচিতি"}</span>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="aboutus-bio-content">
                <div className="aboutus-section-tag">
                  <span></span>{aboutData?.introTag || "পরিচিতি"}
                </div>
                <h2 className="aboutus-bio-title">
                  {aboutData?.introTitle || aboutData?.title || "কামরুল হাসান"}
                </h2>
                <p className="aboutus-bio-description" style={{ whiteSpace: 'pre-wrap' }}>
                  {aboutData?.introDescription || aboutData?.description ||
                    `বরেন্দ্রভূমির সন্তান। সাংবাদিকতা করছেন তিন দশক ধরে। অর্জনের ঝুলিতে আছে অপরাধবিষয়ক রিপোর্টিংয়ে দীর্ঘদিনের কাজের অভিজ্ঞতা। সেই সূত্রে জুটেছে দেশি-বিদেশি পুরস্কারও। পেশাগত জীবনে তিনি সত্য ও বস্তুনিষ্ঠ সাংবাদিকতার জন্য নিবেদিত। তাঁর লেখনী ও প্রতিবেদনে প্রতিফলিত হয় সমাজের অসঙ্গতি, মানুষের কণ্ঠস্বর এবং পরিবর্তনের আকাঙ্ক্ষা।`}
                </p>
                <div className="aboutus-bio-social d-flex gap-3 mt-4">
                  {socials.facebook && (
                    <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="aboutus-social-link">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  )}
                  {socials.twitter && (
                    <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="aboutus-social-link">
                      <i className="fa-brands fa-x-twitter"></i>
                    </a>
                  )}
                  {socials.linkedin && (
                    <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="aboutus-social-link">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  )}
                  {socials.email && (
                    <a href={`mailto:${socials.email}`} className="aboutus-social-link">
                      <i className="fas fa-envelope"></i>
                    </a>
                  )}
                  {/* Default fallbacks if none provided */}
                  {!socials.facebook && !socials.twitter && !socials.linkedin && !socials.email && (
                    <>
                      {settings?.social?.facebook && (
                        <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer" className="aboutus-social-link">
                          <i className="fab fa-facebook-f"></i>
                        </a>
                      )}
                      {settings?.social?.instagram && (
                        <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="aboutus-social-link">
                          <i className="fab fa-instagram"></i>
                        </a>
                      )}
                      {settings?.social?.linkedin && (
                        <a href={settings.social.linkedin} target="_blank" rel="noopener noreferrer" className="aboutus-social-link">
                          <i className="fab fa-linkedin-in"></i>
                        </a>
                      )}
                      {settings?.social?.twitter && (
                        <a href={settings.social.twitter} target="_blank" rel="noopener noreferrer" className="aboutus-social-link">
                          <i className="fa-brands fa-x-twitter"></i>
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS SECTION ═══════════════ */}
      <section
        className={`aboutus-stats py-5 ${visibleSections.has("stats") ? "aboutus-visible" : ""}`}
        ref={(el) => addRef(el, 1)}
        data-section="stats"
      >
        <div className="container">
          <div className="row g-4">
            {statsArray.map((stat, index) => (
              <div className="col-6 col-md-3" key={index}>
                <div className="aboutus-stat-card text-center p-4 rounded shadow-sm" style={{ animationDelay: `${index * 0.15}s` }}>
                  <div className="aboutus-stat-icon mb-2">
                    <i className={`${stat.icon} fs-2`}></i>
                  </div>
                  <div className="aboutus-stat-value fw-bold fs-3">{stat.number || stat.value}</div>
                  <div className="aboutus-stat-label text-muted">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ MISSION / VISION ═══════════════ */}
      <section
        className={`aboutus-mission py-5 ${visibleSections.has("mission") ? "aboutus-visible" : ""}`}
        ref={(el) => addRef(el, 2)}
        data-section="mission"
      >
        <div className="container">
          <div className="text-center mb-5">
            <div className="aboutus-section-tag d-inline-block px-3 py-1 bg-light rounded-pill mb-2">
              আমাদের লক্ষ্য
            </div>
            <h2 className="aboutus-section-title">মিশন ও ভিশন</h2>
          </div>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="aboutus-glass-card mission-card p-5 rounded border shadow-sm h-100">
                <div className="aboutus-glass-icon mb-3">
                  <i className={`${missionData.icon} fs-1 `}></i>
                </div>
                <h3>{missionData.title}</h3>
                <p>{missionData.description}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="aboutus-glass-card vision-card p-5 rounded border shadow-sm h-100">
                <div className="aboutus-glass-icon mb-3">
                  <i className={`${visionData.icon} fs-1`}></i>
                </div>
                <h3>{visionData.title}</h3>
                <p>{visionData.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ VALUES SECTION ═══════════════ */}
      <section
        className={`aboutus-values py-5 ${visibleSections.has("values") ? "aboutus-visible" : ""}`}
        ref={(el) => addRef(el, 3)}
        data-section="values"
      >
        <div className="container">
          <div className="text-center mb-5">
            <div className="aboutus-section-tag d-inline-block px-3 py-1 bg-light rounded-pill mb-2">
              মূল্যবোধ
            </div>
            <h2 className="aboutus-section-title">আমাদের মূলনীতি</h2>
          </div>
          <div className="row g-4">
            {valuesArray.map((value, index) => (
              <div className="col-sm-6 col-lg-3" key={index}>
                <div className="aboutus-value-card text-center p-4 h-100 border rounded shadow-sm" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="aboutus-value-icon mb-3">
                    <i className={`${value.icon} fs-2 `}></i>
                  </div>
                  <h4>{value.title}</h4>
                  <p className="text-muted small">{value.description || value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA SECTION ═══════════════ */}
      <section className="aboutus-cta py-5 bg-primary text-white text-center">
        <div className="container">
          <h2 className="mb-3">{aboutData?.ctaTitle || "আমাদের সাথে যুক্ত থাকুন"}</h2>
          <p className="mb-4">{aboutData?.ctaSubtitle || "সর্বশেষ সংবাদ ও আপডেটের জন্য আমাদের অনুসরণ করুন"}</p>
          <div className="aboutus-cta-buttons d-flex justify-content-center gap-3">
            <Link href="/" className="btn btn-light px-4 py-2 fw-bold ">
              <i className="fas fa-home me-2"></i>প্রধান পাতা
            </Link>
            {(socials.facebook || socials.email || socials.linkedin) && (
              <a href={socials.facebook || socials.linkedin || `mailto:${socials.email}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light px-4 py-2 fw-bold">
                <i className={`${socials.facebook ? "fab fa-facebook-f" : socials.linkedin ? "fab fa-linkedin" : "fas fa-envelope"} me-2`}></i>যোগাযোগ করুন
              </a>
            )}
            {Object.keys(socials).length === 0 && settings?.social?.facebook && (
              <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light px-4 py-2 fw-bold">
                <i className="fab fa-facebook-f me-2"></i>ফেসবুক
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUsPage;
