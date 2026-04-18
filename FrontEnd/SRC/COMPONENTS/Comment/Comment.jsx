import React from "react";
import { ListGroup, Image } from "react-bootstrap";

function Comment({ comment }) {
  // 1. Fallback immediato
  if (!comment) return null;

  const defaultAvatar = "https://placehold.co/50x50?text=U";

  return (
    <ListGroup.Item className="border-0 px-0 py-2 bg-transparent">
      <div className="d-flex align-items-start">
        {/* 2. Avatar piccolo e circolare */}
        <Image
          src={comment.author?.avatar || defaultAvatar}
          roundedCircle
          width="30"
          height="30"
          className="me-2 shadow-sm"
          onError={(e) => (e.target.src = defaultAvatar)}
          referrerPolicy="no-referrer"
        />

        <div className="flex-grow-1 p-2 rounded bg-white shadow-sm border">
          <div className="d-flex justify-content-between align-items-center mb-1">
            {/* 3. Nome autore in grassetto */}
            <strong className="small text-capitalize">
              {comment.author
                ? `${comment.author.name} ${comment.author.surname}`
                : "Utente"}
            </strong>
            {/* 4. Data formattata meglio */}
            <small className="text-muted" style={{ fontSize: "0.75rem" }}>
              {comment.createdAt
                ? new Date(comment.createdAt).toLocaleDateString()
                : ""}
            </small>
          </div>

          {/* 5. Testo del commento */}
          <p className="mb-0 small text-secondary">{comment.text}</p>
        </div>
      </div>
    </ListGroup.Item>
  );
}

export default Comment;
