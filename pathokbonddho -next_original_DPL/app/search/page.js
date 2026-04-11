import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import NewsWidget from '../components/widgets/NewsWidget';

async function getSearchResults(query) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${API_URL}/news?search=${encodeURIComponent(query)}&limit=20`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.news || data.rows || [];
  } catch (err) {
    console.error('Search fetch error:', err);
    return [];
  }
}

export default async function SearchPage({ searchParams }) {
  const { q } = await searchParams;
  const results = q ? await getSearchResults(q) : [];

  return (
    <>
      <Header />
      <main className="main-content py-5 bg-light min-vh-100">
        <Container>
          <div className="search-header custom-font mb-5">
            <h2 className="fw-bold font-bangla border-bottom pb-3">
              "{q}" এর জন্য অনুসন্ধানের ফলাফল
            </h2>
            <p className="text-muted small mt-2">
              মোট {results.length.toLocaleString('bn-BD')} টি সংবাদ পাওয়া গেছে
            </p>
          </div>

          {results.length > 0 ? (
            <Row className="g-4">
              {results.map((news) => (
                <Col key={news._id || news.id} xs={12} md={6} lg={4} xl={3}>
                  <NewsWidget
                    cell={{
                      contentType: 'news',
                      contentId: news._id || news.id,
                      resolvedContent: news,
                      design: 'image-top'
                    }}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Alert variant="info" className="text-center py-5 shadow-sm border-0 bg-white">
              <div className="mb-3 fs-1">🔍</div>
              <h4 className="font-bangla fw-bold">কোন সংবাদ পাওয়া যায়নি</h4>
              <p className="text-muted mb-0">দয়া করে অন্য কোনো শব্দ দিয়ে চেষ্টা করুন।</p>
            </Alert>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
