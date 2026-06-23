const fs = require('fs');
const path = require('path');

const OLD_ABOUT_US = path.join(__dirname, 'old/client/src/components/AboutUsPage.jsx');
const NEW_ABOUT_US = path.join(__dirname, 'app/components/AboutUsPage.jsx');

const OLD_NEWS_DETAILS = path.join(__dirname, 'old/client/src/components/NewsDetails.jsx');
const NEW_NEWS_DETAILS = path.join(__dirname, 'app/components/NewsDetails.jsx');

try {
    // 1. MIGRATING ABOUT US PAGE
    let aboutContent = fs.readFileSync(OLD_ABOUT_US, 'utf8');
    
    // Replace react-router-dom Link with next/link
    aboutContent = aboutContent.replace(/import \{ Link \} from ['"]react-router-dom['"];?/g, "import Link from 'next/link';");
    
    // Replace import.meta.env with empty string relative path
    aboutContent = aboutContent.replace(/import\.meta\.env\.VITE_API_BASE_URL/g, "''");
    
    // Convert to target Next.js Client Component
    aboutContent = '"use client";\n' + aboutContent;
    
    // Remove Header, Footer, ScrollToSection since page.js will manage layout
    aboutContent = aboutContent.replace(/import Header from ["'].\/Header["'];?/g, "");
    aboutContent = aboutContent.replace(/import Footer from ["'].\/Footer["'];?/g, "");
    aboutContent = aboutContent.replace(/import ScrollToSection from ["'].\/ScrollToSection["'];?/g, "");
    
    aboutContent = aboutContent.replace(/<Header \/>/g, "");
    aboutContent = aboutContent.replace(/<Footer \/>/g, "");
    aboutContent = aboutContent.replace(/<ScrollToSection \/>/g, "");
    
    // Replace 'to=' with 'href='
    aboutContent = aboutContent.replace(/<Link([^>]*?)to=/g, '<Link$1href=');
    
    // Write new About Us Component
    fs.writeFileSync(NEW_ABOUT_US, aboutContent);
    console.log("✅ Successfully migrated AboutUsPage.jsx");

    // 2. MIGRATING NEWS DETAILS PAGE
    let newsContent = fs.readFileSync(OLD_NEWS_DETAILS, 'utf8');

    // Remove useParams layout dependency and add Next.js prop dependency
    newsContent = newsContent.replace(/import \{ useParams, Link \} from 'react-router-dom';?/g, "import Link from 'next/link';");
    newsContent = newsContent.replace(/const NewsDetails = \(\) => \{/g, "const NewsDetails = ({ id }) => {");
    newsContent = newsContent.replace(/const \{ id \} = useParams\(\);/g, "");
    
    // Remove Helmet imports
    newsContent = newsContent.replace(/import \{ Helmet \} from 'react-helmet';?/g, "");

    // Clear internal dynamic imports
    newsContent = newsContent.replace(/import\.meta\.env\.VITE_API_BASE_URL/g, "''");

    // Clear internal Helmet logic blocks securely removing up to </Helmet>
    newsContent = newsContent.replace(/<Helmet>[\s\S]*?<\/Helmet>/g, "");
    
    // Replace Link props
    newsContent = newsContent.replace(/<Link([^>]*?)to=/g, '<Link$1href=');

    // Client Component Designation
    newsContent = '"use client";\n' + newsContent;

    fs.writeFileSync(NEW_NEWS_DETAILS, newsContent);
    console.log("✅ Successfully migrated NewsDetails.jsx");
    
} catch (error) {
    console.error("Migration Error:", error);
}
