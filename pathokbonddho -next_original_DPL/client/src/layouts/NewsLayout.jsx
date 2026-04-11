import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToSection from "../components/ScrollToSection";

const NewsLayout = () => {
    return (
        <>
            <ScrollToSection />
            <Header />
            <main className="main-content bg-light" style={{ minHeight: "80vh" }}>
                {/* The child component (NewsDetails) will be rendered here */}
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default NewsLayout;
