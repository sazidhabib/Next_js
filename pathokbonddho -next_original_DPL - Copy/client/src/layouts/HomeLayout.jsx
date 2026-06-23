import React, { useEffect, useRef, useState, Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToSection from "../components/ScrollToSection";
import PageRenderer from "../components/PageRenderer";

const HomeLayout = () => {
  const location = useLocation();

  // Extract slug from path (e.g., "/activitse" -> "activitse")
  // If path is "/" or empty, default to "home"
  const path = location.pathname.replace(/^\/|\/$/g, "");
  const slug = path || "home";

  return (
    <>
      <ScrollToSection />

      <Header />
      <main className="main-content">
        {/* Render the dynamic page layout based on the URL slug */}
        <PageRenderer slug={slug} />
      </main>

      <Footer />
    </>
  );
};

export default HomeLayout;
