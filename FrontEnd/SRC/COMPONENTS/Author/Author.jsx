import React from "react";
import { Card, ListGroup } from "react-bootstrap";

function Author({ user }) {
  // 1. Fallback per l'avatar (se l'utente non ne ha uno)
  const defaultAvatar = "https://placehold.co/400x400?text=Autore";

  return (
    <Card className="h-100 shadow-sm border-0">
      <Card.Img
        variant="top"
        src={user?.avatar || defaultAvatar} // Optional chaining + Fallback
        alt={`${user?.name} ${user?.surname}`}
        style={{ height: "250px", objectFit: "cover" }}
        // 2. Fondamentale per vedere foto di Google
        referrerPolicy="no-referrer" 
        // SE l'immagine fallisce il caricamento, usa questa funzione:
        onError={(e) => {
          e.target.src = "https://placehold.co/400x400?text=No+Image";
        }}
      />

      <Card.Body>
        <Card.Title className="text-capitalize">
          {/* 3. Optional chaining per sicurezza */}
          {user?.name || "Utente"} {user?.surname || "Anonimo"}
        </Card.Title>
      </Card.Body>

      <ListGroup className="list-group-flush">
        <ListGroup.Item>
          <strong>Email:</strong> <br />
          <span className="small text-truncate d-block">{user?.email}</span>
        </ListGroup.Item>

        <ListGroup.Item>
          <strong>Data di nascita:</strong> <br />
          <span className="small">
            {user?.birthDate
              ? new Date(user.birthDate).toLocaleDateString()
              : "N/D"}
          </span>
        </ListGroup.Item>
      </ListGroup>

      <Card.Footer className="bg-white text-center">
        <small className="text-muted">Profilo Autore</small>
      </Card.Footer>
    </Card>
  );
}

export default Author;
