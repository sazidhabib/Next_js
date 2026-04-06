"use client";
import { useEffect } from "react";
import { usePathname as useLocation } from 'next/navigation';

const ScrollToSection = () => {
    const location = useLocation();

    useEffect(() => {
        const sectionId = location.slice(1); // Removes the "/"
        if (sectionId) {
            const el = document.getElementById(sectionId);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    }, [location]);

    return null;
};

export default ScrollToSection;
