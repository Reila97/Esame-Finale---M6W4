import { useState } from "react";
import { Form, Button, InputGroup, Spinner, Alert } from "react-bootstrap";

function NewComment({ postId, onSuccess }) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    setIsSending(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/blogPosts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (res.ok) {
        setText("");
        if (onSuccess) onSuccess(); 
        window.location.reload(); 
      } else {
        const errData = await res.json();
        throw new Error(errData.message || "Errore nell'invio");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="p-2 border rounded bg-light shadow-sm mt-2">
      {error && <Alert variant="danger" className="py-1 small">{error}</Alert>}
      <Form.Group>
        <Form.Label className="small fw-bold text-muted ps-1">Lascia un commento</Form.Label>
        <InputGroup size="sm">
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Scrivi qui..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className="border-0 shadow-none"
          />
          <Button variant="primary" type="submit" disabled={isSending || !text.trim()}>
            {isSending ? <Spinner animation="border" size="sm" /> : "Invia"}
          </Button>
        </InputGroup>
      </Form.Group>
    </Form>
  );
}

export default NewComment;