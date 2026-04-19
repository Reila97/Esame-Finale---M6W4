import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card, Spinner, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import UniversalUploader from "../Button/UniversalUploader";

function UpdateAuthor() {
  const { id } = useParams(); // Prende l'ID dall'URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    birthDate: "",
    avatar: "",
  });

  const [author, setAuthor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Carichiamo i dati attuali dell'autore al montaggio
  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3001/authors/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Errore nel caricamento dell'autore");

        const data = await res.json();

        // Formattiamo la data per l'input type="date" (YYYY-MM-DD)
        if (data.birthDate && typeof data.birthDate === "string") {
          data.birthDate = data.birthDate.split("T")[0];
        }

        setFormData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthor();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 2. Gestione del salvataggio (PUT)
  // ... (import uguali a prima)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/authors/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        // IMPORTANTE: Aggiorniamo il localStorage con i nuovi dati
        localStorage.setItem("userData", JSON.stringify(updatedUser));

        alert("Profilo aggiornato con successo!");
        navigate("/profile");
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
    <Container className="mt-5">
      <Card className="shadow-sm p-4">
        <h2 className="mb-4">Modifica Profilo</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <UniversalUploader
          endpoint={`http://localhost:3001/authors/${id}/avatar`}
          fieldName="avatar"
          onUploadSuccess={(newUrl) => setAuthor({ ...author, avatar: newUrl })}
        />

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cognome</Form.Label>
            <Form.Control
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Data di Nascita</Form.Label>
            <Form.Control
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="success" type="submit" disabled={isUpdating}>
              {isUpdating ? "Salvataggio..." : "Salva Modifiche"}
            </Button>
            <Button variant="secondary" onClick={() => navigate("/profile")}>
              Annulla
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default UpdateAuthor;
