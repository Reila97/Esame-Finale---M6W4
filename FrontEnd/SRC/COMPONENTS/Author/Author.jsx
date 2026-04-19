import React from "react";
import { Card, ListGroup } from "react-bootstrap";

function Author({ user }) {
  const defaultAvatar = "https://placehold.co/400x400?text=Autore";

  return (
    <Card className="h-100 shadow-sm border-0">
      <Card.Img
        variant="top"
        src={user?.avatar || defaultAvatar}
        alt={`${user?.name} ${user?.surname}`}
        style={{ height: "250px", objectFit: "cover" }}
        referrerPolicy="no-referrer" 
        onError={(e) => {
          e.target.onerror = null; // Previene loop infiniti se anche il placeholder fallisce
          e.target.src = defaultAvatar;
        }}
      />
      <Card.Body>
        <Card.Title className="text-capitalize">
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
            {user?.birthDate ? new Date(user.birthDate).toLocaleDateString() : "N/D"}
          </span>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
}

export default Author;
