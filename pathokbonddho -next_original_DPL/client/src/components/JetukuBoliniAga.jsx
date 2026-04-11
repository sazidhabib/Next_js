import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import BookReadingModal from './BookReadingModal';
import { useMenu } from '../store/MenuContext';
import axios from 'axios';

const JetukuBoliniAga = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedJetuku, setSelectedJetuku] = useState(null);
  const [jetukuData, setJetukuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/sections/jetukuboliniage`;
  const { getMenuByOrder } = useMenu();
  const jetukuMenu = getMenuByOrder(5); // Assuming 'Jetuku Bolini Aga' is the fifth menu item

  useEffect(() => {
    const fetchJetukuData = async () => {
      try {
        const response = await axios.get(API_URL);
        setJetukuData(response.data);
      } catch (err) {
        console.error("Error fetching jetuku data:", err);
        setError("Failed to load jetuku section content");
      } finally {
        setLoading(false);
      }
    };

    fetchJetukuData();
  }, []);

  const handleOpenModal = (content) => {
    setSelectedJetuku({
      title: jetukuData?.title || "যেটুকু বলিনি আগে",
      description: jetukuData?.description || ""
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedJetuku(null);
    setShowModal(false);
  };

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
    <section className="jetukuboliniaga" id={jetukuMenu?.path || "jetukuboliniaga"}>
      <div className="container">
        <h3 className="subheading">{jetukuMenu?.name || "যেটুকু বলিনি আগে"}</h3>
        <h2 className="mainheading">{jetukuData?.title || "যেটুকু বলিনি আগে"}</h2>

        <div className="row">
          <div className="col-lg-6 order-1 order-lg-1">
            <div className="icon-content">
              <div className="icon">
                <img src="/images/Book_Icon.JPG" alt="Book Icon" />
              </div>
              <div className="main-text">
                <p
                  onClick={() => handleOpenModal(jetukuData)}
                  style={{ cursor: "pointer" }}
                  title="সম্পূর্ণ লেখাটি পড়তে ক্লিক করুন"
                >
                  {jetukuData?.description
                    ? (jetukuData.description.length > 600
                      ? `${jetukuData.description.slice(0, 600)}...`
                      : jetukuData.description)
                    : "কন্টেন্ট লোড হচ্ছে..."}
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 order-2 order-lg-2">
            <div className="jetuku-img">
              <img
                src={jetukuData?.imageUrl
                  ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${jetukuData.imageUrl.replace(/^\/+/, "")}`
                  : "./images/jetukuboinai age.jpg"}
                alt="kamrulhasan_jetukuboli_age"
                className="img-fluid"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "./images/jetukuboinai age.jpg";
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      <BookReadingModal
        show={showModal}
        handleClose={handleCloseModal}
        item={selectedJetuku}
      />
    </section>
  );
};

export default JetukuBoliniAga;