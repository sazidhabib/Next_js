import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToSection = () => {
    const location = useLocation();

    useEffect(() => {
        const sectionId = location.pathname.slice(1); // Removes the "/"
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
