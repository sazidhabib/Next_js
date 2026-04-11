import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import DetailModal from "./DetailModal";
import { useMenu } from '../store/MenuContext';

const truncateByChars = (text, limit) => {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};


const ReportCard = ({ title, date, description, image, onClick }) => {

  const formatDateBangla = (dateString) => {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Dynamically determine description length based on title length

  let descriptionLength = 150; // Default length
  if (title.length >= 70) {
    descriptionLength = 90; // Long title
  } else if (title.length <= 30) {
    descriptionLength = 200; // Short title
  }

  return (
    <div id="news-slider" className="owl-carousel" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="post-slide">
        <div className="post-img">
          <img src={image} className="card-img-to" alt={title} />
        </div>
        <div className="post-content">
          <h2 className="post-title">{title}</h2>
          <p className="post-description">
            প্রকাশ হয়েছে : {formatDateBangla(date)} <br />
            {truncateByChars(description, descriptionLength)}</p>
        </div>
      </div>
    </div>
  );
};


const Report = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { getMenuByOrder } = useMenu();
  const reportMenu = getMenuByOrder(4); // Assuming 'Report' is the forth menu item


  const customPagination = {
    clickable: true,
    renderBullet: function (index, className) {
      const total = reports.length;
      const current = this.swiper?.realIndex || 0;
      const width = window.innerWidth;

      let range = 1; // default for tablet
      if (width < 576) {
        range = 0; // mobile
      } else if (width >= 992) {
        range = 2; // desktop
      }

      if (index === 0 || index === total - 1 || Math.abs(index - current) <= range) {
        return `<span class="${className}"></span>`;
      }

      if (
        (index === 1 && current > range + 1) ||
        (index === total - 2 && current < total - range - 2)
      ) {
        return `<span class="swiper-pagination-ellipsis">...</span>`;
      }

      return "";
    }
  };


  const handleOpenModal = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/blogs`;
  const fullImageUrl = `${import.meta.env.VITE_API_BASE_URL}/uploads/`;

  useEffect(() => {
    const fetchPublishedReports = async () => {
      try {
        const response = await axios.get(API_URL);
        const publishedReports = response.data.filter(report => report.status === true);
        const sortedReports = publishedReports.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setReports(sortedReports);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedReports();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.swiperInstance?.pagination) {
        window.swiperInstance.pagination.render();
        window.swiperInstance.pagination.update();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  if (loading) return <div className="text-center">Loading reports...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <>
      <section className="publishedreport py-5" id={reportMenu?.path || "publishedreport"}>
        <div className="container py-5">
          <h2 className="publishedreport-sty mb-4">{reportMenu?.name || "প্রকাশিত রিপোর্ট"}</h2>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={3}
            autoplay={{ delay: 3000 }}
            loop={true}
            pagination={customPagination}
            onSwiper={(swiper) => {
              window.swiperInstance = swiper;
            }}
            breakpoints={{
              0: { slidesPerView: 1 },
              576: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
            }}
          >
            {reports.map((report) => (
              <SwiperSlide key={report._id}>
                <ReportCard
                  title={report.title}
                  date={report.publishDate}
                  description={report.description}
                  image={`${fullImageUrl}${report.image.startsWith("/") ? "" : "/"}${report.image}`}
                  onClick={() =>
                    handleOpenModal({
                      title: report.title,
                      publishDate: report.publishDate,
                      description: report.description,
                      image: `${fullImageUrl}${report.image.startsWith("/") ? "" : "/"}${report.image}`,
                    })
                  }
                />
              </SwiperSlide>
            ))}
          </Swiper>


          <DetailModal
            show={showModal}
            handleClose={handleCloseModal}
            item={selectedReport}
            showDate={true}
          />
        </div>
      </section>

    </>
  );
};

export default Report;