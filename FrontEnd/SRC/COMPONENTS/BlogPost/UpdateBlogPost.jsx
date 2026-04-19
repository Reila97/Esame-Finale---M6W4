import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Card,
  Spinner,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import UniversalUploader from "../Button/UniversalUploader";

function UpdateBlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    cover: "",
    content: "",
    readTime: { value: 0, unit: "minutes" },
  });

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3001/blogPosts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Errore nel caricamento del post");

        const data = await res.json();
        setFormData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleReadTimeChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      readTime: {
        ...formData.readTime,
        [name]: name === "value" ? Number(value) : value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/blogPosts/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Post aggiornato con successo!");
        navigate("/");
      } else {
        throw new Error("Errore durante l'aggiornamento");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );

  return (
    <Container className="mt-5 pb-5">
      <Card className="shadow-sm p-4">
        <h2 className="mb-4">Modifica Blog Post</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        

        <UniversalUploader
          endpoint={`http://localhost:3001/blogPosts/${id}/cover`}
          fieldName="cover"
          onUploadSuccess={(newUrl) => {
            // IMPORTANTE: aggiorna formData così il Form vede il nuovo URL
            setFormData({ ...formData, cover: newUrl });

            // Se vuoi tenere setPost per altri motivi, ok, ma formData è fondamentale
            if (setPost) setPost({ ...post, cover: newUrl });
          }}
        />

        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Titolo</Form.Label>
            <Form.Control
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Categoria</Form.Label>
                <Form.Control
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>URL Copertina</Form.Label>
                <Form.Control
                  name="cover"
                  value={formData.cover}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="align-items-end mb-3">
            <Col xs={6} md={3}>
              <Form.Group>
                <Form.Label>Tempo lettura</Form.Label>
                <Form.Control
                  type="number"
                  name="value"
                  value={formData.readTime.value}
                  onChange={handleReadTimeChange}
                />
              </Form.Group>
            </Col>
            <Col xs={6} md={3}>
              <Form.Group>
                <Form.Label>Unità</Form.Label>
                <Form.Select
                  name="unit"
                  value={formData.readTime.unit}
                  onChange={handleReadTimeChange}
                >
                  <option value="minutes">minuti</option>
                  <option value="hours">ore</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label>Contenuto</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="primary" type="submit" disabled={isUpdating}>
              {isUpdating ? <Spinner size="sm" /> : "Salva Modifiche"}
            </Button>
            <Button variant="outline-secondary" onClick={() => navigate("/")}>
              Annulla
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default UpdateBlogPost;
