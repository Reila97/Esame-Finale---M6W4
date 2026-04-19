import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap"; // Alert aggiunto
import BlogPost from "./BlogPost.jsx";

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

      {isLoading && (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!isLoading && !error && (
        <Row className="g-4">
          {posts.map((p) => (
            <Col key={p._id} sm={12} md={6} lg={4}>
              <BlogPost post={p} />
            </Col>
          ))}
        </Row>
      )}

      {!isLoading && posts.length === 0 && !error && (
        <Alert variant="info" className="text-center">Nessun post trovato.</Alert>
      )}
    </Container>
  );
}

export default AllPost;