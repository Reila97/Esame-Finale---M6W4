import { useState, useEffect } from "react";
import { Container, Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UniversalUploader from "../Button/UniversalUploader";

function NewBlogPost() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // 1. Recuperiamo l'utente dal localStorage
  const savedUser = JSON.parse(localStorage.getItem("userData"));

  // 2. Unico stato per il form (cover inizialmente vuota)
  const [formData, setFormData] = useState({
    title: "",
    category: "General",
    content: "",
    cover: "", // Verrà riempito dall'uploader
    readTime: { value: 1, unit: "min" },
    author: savedUser?._id || "",
  });

  // Protezione rotta
  useEffect(() => {
    if (!savedUser || !savedUser._id) {
      navigate("/login");
    }
  }, [savedUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "readTimeValue") {
      setFormData((prev) => ({
        ...prev,
        readTime: { ...prev.readTime, value: Number(value) },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.cover) {
      setError("Per favore, carica un'immagine di copertina prima di pubblicare.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/blogPosts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Post creato con successo!");
        navigate("/");
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Impossibile creare il post");
      }
    } catch (err) {
      setError("Errore di connessione al server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <Card className="shadow-sm p-4 border-0">
        <h2 className="mb-4">Crea un nuovo Blog Post</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* 3. Uploader Configurato Correttamente */}
        <div className="mb-4 p-3 border rounded bg-light">
          <label className="form-label d-block">1. Carica l'immagine di copertina</label>
          <UniversalUploader
            endpoint="http://localhost:3001/blogPosts/uploadTemp"
            fieldName="cover"
            method="POST" // Specifichiamo POST per la rotta temporanea
            onUploadSuccess={(newUrl) => {
              // Aggiorniamo il formData così il post "vede" l'immagine
              setFormData((prev) => ({ ...prev, cover: newUrl }));
            }}
          />
          {formData.cover && (
            <div className="mt-2 text-success small">
              ✅ Immagine caricata correttamente!
            </div>
          )}
        </div>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Titolo</Form.Label>
                <Form.Control
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Categoria</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="General">General</option>
                  <option value="Tech">Tech</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Coding">Coding</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>URL Copertina (generato automaticamente)</Form.Label>
            <Form.Control
              type="text"
              name="cover"
              value={formData.cover}
              readOnly // L'utente non deve scriverlo a mano, lo fa l'uploader
              placeholder="Carica un file sopra per ottenere l'URL..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contenuto</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Tempo di lettura (minuti)</Form.Label>
            <Form.Control
              type="number"
              name="readTimeValue"
              min="1"
              value={formData.readTime.value}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit" disabled={isSubmitting || !formData.cover}>
              {isSubmitting ? "Pubblicazione..." : "Pubblica Post"}
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

export default NewBlogPost;