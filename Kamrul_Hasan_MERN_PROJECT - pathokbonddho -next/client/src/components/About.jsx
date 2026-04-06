
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useMenu } from '../store/MenuContext';
import axios from 'axios';

const About = () => {
  const { getMenuByOrder } = useMenu();
  const aboutMenu = getMenuByOrder(2); // Assuming 'About' is the second menu item
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center">
        {error}
      </div>
    );
  }

  return (
    <>
      <section className="about-us" id={aboutMenu?.path || "about-us"}>
        <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100">
          <div className="row align-items-center w-100">
            <div className="col-lg-6 text-center text-lg-end">
              <img
                src={aboutData?.imageUrl
                  ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${aboutData.imageUrl.replace(/^\/+/, "")}`
                  : "/images/kamrul_hasan_bio2.jpg"}
                alt="kamrulhasan_bio"
                className="img-fluid profile-image"
              />
            </div>
            <div className="col-lg-6 text-center text-lg-start">
              <h2 className="title">{aboutMenu?.name || "আমার আমি"}</h2>
              <h3 className="subtitle">{aboutData?.title || "সাংবাদিকতা আমার সবকিছু"}</h3>
              <p className="description">
                {aboutData?.description || `
                  বরেন্দ্রভূমির সন্তান। সাংবাদিকতা করছেন তিন দশক ধরে। অর্জনের ঝুলিতে আছে অপরাধবিষয়ক রিপোর্টিংয়ে দীর্ঘদিনের কাজের অভিজ্ঞতা। সেই সূত্রে জুটেছে দেশি-বিদেশি পুরস্কারও। 
                  বরেন্দ্রভূমির সন্তান। সাংবাদিকতা করছেন তিন দশক ধরে। অর্জনের ঝুলিতে আছে অপরাধবিষয়ক রিপোর্টিংয়ে দীর্ঘদিনের কাজের অভিজ্ঞতা। সেই সূত্রে জুটেছে দেশি-বিদেশি পুরস্কারও।
                  বরেন্দ্রভূমির সন্তান। সাংবাদিকতা করছেন তিন দশক ধরে। অর্জনের ঝুলিতে আছে অপরাধবিষয়ক রিপোর্টিংয়ে দীর্ঘদিনের কাজের অভিজ্ঞতা। সেই সূত্রে জুটেছে দেশি-বিদেশি পুরস্কারও।
                `}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
