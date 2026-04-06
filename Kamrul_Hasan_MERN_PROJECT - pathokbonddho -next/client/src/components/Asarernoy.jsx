import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import DetailModal from "./DetailModal";
import { useMenu } from '../store/MenuContext';

const truncateByChars = (text, limit) => {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};


const Story = ({ title, description, image, onClick }) => {
  const fullImageUrl = `${import.meta.env.VITE_API_BASE_URL}/uploads/${image}`;



  return (
    <div className="common-story" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="news-item p-3">

        <h4 className="news-title py-2 d-block d-md-none">{title}</h4>
      </div>
      <div className="row">
        <div className="col-4 d-block d-md-none">
          {image && (
            <img
              src={fullImageUrl}
              alt={title}
              className="img-fluid mb-2 rounded"
              style={{ maxHeight: "200px", objectFit: "cover", width: "100%" }}
            />
          )}
        </div>

        <div className="col-6 d-block d-md-none">

          <p className="news-description">

            {truncateByChars(description, 150)}</p>
        </div>

        <div className="col-md-3 d-flex align-items-center d-none d-md-block py-3">
          {/* Add the image here */}
          {image && (
            <img
              src={fullImageUrl}
              alt={title}
              className="img-fluid mb-2 rounded"
              style={{ maxHeight: "200px", objectFit: "cover", width: "100%" }}
            />
          )}
        </div>
        <div className="col-md-3 d-none d-md-block">
          <div className="news-item py-3 text-center">

            <h4 className="news-title">{title}</h4>
          </div>
        </div>
        <div className="col-md-6 d-none d-md-block">

          <p className="news-description">

            {truncateByChars(description, 150)}</p>
        </div>
      </div>
    </div>
  );
};




const Asarernoy = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 3; // Show 3 articles per page


  const { getMenuByOrder } = useMenu();
  const asarernoyMenu = getMenuByOrder(3); // Assuming 'Asarernoy' is the third menu item




  // Calculate total pages
  const totalPages = Math.ceil(articles.length / articlesPerPage);


  // Add in component state:
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/articles`;


  // Modal handlers:
  const handleOpenModal = (article) => {
    const fullArticle = {
      ...article,
      image: `${import.meta.env.VITE_API_BASE_URL}/uploads/${article.image}`,
    };
    setSelectedArticle(fullArticle);
    setShowModal(true);
  };


  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedArticle(null);
  };

  useEffect(() => {
    const fetchPublishedArticles = async () => {
      try {
        const response = await axios.get(API_URL);

        // Filter articles where status is true
        const publishedArticles = response.data.filter(article => article.status === true);

        // Sort articles in descending order based on date
        const sortedArticles = publishedArticles.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setArticles(sortedArticles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedArticles();
  }, []);


  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [articles, totalPages, currentPage]);

  if (loading) return <div className="text-center mt-4">Loading articles...</div>;
  if (error) return <div className="text-center text-danger mt-4">Error: {error}</div>;


  // Get current articles for the page
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  return (
    <section className="asarernoy" id={asarernoyMenu?.path || "asarernoy"}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-12 text-left">
            <img className="asarernoy-img img-fluid header-image" src="/images/Asarernoy.jpg" alt="Asarernoy" />
          </div>
          <div className="col-md-12">
            {currentArticles.map((article) => (
              <Story
                key={article._id}
                title={article.title}

                description={article.description}
                image={article.image}
                onClick={() => handleOpenModal(article)}
              />

            ))}

            <DetailModal
              show={showModal}
              handleClose={handleCloseModal}
              item={selectedArticle}
              showDate={false} // Show date in the modal
            />

            {/* Bootstrap Pagination */}
            <nav aria-label="Article Pagination">
              <ul className="pagination justify-content-center mt-4">
                {/* Previous button */}
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    আগে
                  </button>
                </li>

                {/* First page */}
                {currentPage > 3 && (
                  <>
                    <li className={`page-item ${currentPage === 1 ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage(1)}>1</button>
                    </li>
                    <li className="page-item disabled"><span className="page-link">...</span></li>
                  </>
                )}

                {/* Pages around current page */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page =>
                    page === 1 ||
                    Math.abs(currentPage - page) <= 1
                  )
                  .map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage(page)}>
                        {page}
                      </button>
                    </li>
                  ))}

                {/* Ellipsis before last page */}
                {currentPage < totalPages - 2 && (
                  <>
                    <li className="page-item disabled"><span className="page-link">...</span></li>
                    <li className={`page-item ${currentPage === totalPages ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
                    </li>
                  </>
                )}

                {/* Next button */}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    পরে
                  </button>
                </li>
              </ul>

            </nav>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Asarernoy;
