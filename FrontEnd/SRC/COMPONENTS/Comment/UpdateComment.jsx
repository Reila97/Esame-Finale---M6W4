import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card, Spinner, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

function UpdateComment() {
  const { postId, commentId } = useParams(); 
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3001/blogPosts/${postId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Post non trovato");

        const post = await res.json();
        const comment = post.comments?.find(c => c._id === commentId);
        
        if (comment) {
          setText(comment.text);
        } else {
          throw new Error("Il commento non esiste più");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComment();
  }, [postId, commentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/blogPosts/${postId}/comment/${commentId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });

      if (res.ok) {
        alert("Commento aggiornato!");
        navigate("/"); // Reindirizza alla Home per vedere le modifiche
      } else {
        throw new Error("Errore durante l'aggiornamento");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return (
    <Container className="text-center mt-5">
      <Spinner animation="border" variant="warning" />
    </Container>
  );

  return (
    <Container className="mt-5">
      <Card className="shadow-sm border-0 mx-auto" style={{ maxWidth: '600px' }}>
        <Card.Header className="bg-warning text-dark fw-bold border-0">
          Modifica Commento
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control 
                as="textarea" 
                rows={4}
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                required 
                placeholder="Modifica il tuo pensiero..."
                className="shadow-sm"
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="warning" type="submit" disabled={isUpdating || !text.trim()}>
                {isUpdating ? <Spinner size="sm" /> : "Salva Modifiche"}
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                Annulla
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default UpdateComment;