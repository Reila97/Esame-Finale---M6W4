import { useState, useEffect } from "react";
import { Container, Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function NewBlogPost() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // 1. Recuperiamo l'oggetto utente completo dal localStorage
  const savedUser = JSON.parse(localStorage.getItem("userData"));

  const [formData, setFormData] = useState({
    title: "",
    category: "General",
    content: "",
    cover: "",
    readTime: { value: 1, unit: "min" },
    // 2. IMPORTANTE: Usiamo l'ID (_id), non l'email!
    author: savedUser?._id || "" 
  });

  // Se per qualche motivo l'utente non è loggato, lo rimandiamo al login
  useEffect(() => {
    if (!savedUser || !savedUser._id) {
      navigate("/login");
    }
  }, [savedUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "readTimeValue") {
      setFormData({ ...formData, readTime: { ...formData.readTime, value: Number(value) } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Controllo di sicurezza prima dell'invio
    if (!formData.author) {
        setError("Errore: Autore non identificato. Prova a rifare il login.");
        setIsSubmitting(false);
        return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/blogPosts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Post creato con successo!");
        navigate("/");
      } else {
        const errorData = await res.json();
        // Visualizziamo l'errore specifico del server
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

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Titolo</Form.Label>
                <Form.Control name="title" value={formData.title} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Categoria</Form.Label>
                <Form.Select name="category" value={formData.category} onChange={handleChange}>
                  <option value="General">General</option>
                  <option value="Tech">Tech</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Coding">Coding</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>URL Copertina</Form.Label>
            <Form.Control type="url" name="cover" value={formData.cover} onChange={handleChange} placeholder="https://..." />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contenuto</Form.Label>
            <Form.Control as="textarea" rows={6} name="content" value={formData.content} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Tempo di lettura (minuti)</Form.Label>
            <Form.Control type="number" name="readTimeValue" min="1" value={formData.readTime.value} onChange={handleChange} />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Pubblicazione..." : "Pubblica Post"}
            </Button>
            <Button variant="outline-secondary" onClick={() => navigate("/")}>Annulla</Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default NewBlogPost;