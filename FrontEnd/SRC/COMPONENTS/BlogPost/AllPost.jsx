import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Container, Row, Col, Spinner } from "react-bootstrap";

import BlogPost from "./BlogPost.jsx";
import AllComment from "../Comment/AllComment.jsx";

function AllPost() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3001/blogPosts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Gestione token scaduto o mancante
        if (res.status === 401) {
          navigate("/login");
          return;
        }

        if (!res.ok) throw new Error("Non sono riuscito a caricare i post.");

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [navigate]);

  return (
    <Container className="mt-5">
      <h1 className="mb-4">I nostri Blog Post</h1>

      {/* 1. Spinner centrato */}
      {isLoading && (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {/* 2. Messaggio di errore */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* 3. Render dei post solo se non stiamo caricando */}
      {!isLoading && !error && (
        <Row className="g-4">
          {posts.map((p) => (
            <Col key={p._id} sm={12} md={6} lg={4}>
              <div className="h-100 d-flex flex-column">
                <BlogPost post={p} />
                {/* Sezione Commenti integrata sotto la card */}
                <div className="mt-2 p-2 bg-light rounded shadow-sm">
                  <h6 className="text-muted border-bottom pb-1">Commenti:</h6>
                  <AllComment commentList={p.comments || []} />
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      {/* Se non ci sono post */}
      {!isLoading && posts.length === 0 && !error && (
        <p className="text-center">Nessun post trovato.</p>
      )}
    </Container>
  );
}

export default AllPost;
