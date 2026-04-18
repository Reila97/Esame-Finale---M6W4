import React from "react";
import Comment from "./Comment.jsx";
import { ListGroup } from "react-bootstrap";

function AllComment({ commentList }) {
  // 1. Messaggio di fallback se non ci sono commenti
  if (!commentList || commentList.length === 0) {
    return (
      <p className="text-muted small ps-2 italic">
        Ancora nessun commento. Sii il primo!
      </p>
    );
  }

  return (
    <div className="mt-2">
      {/* 2. Usiamo ListGroup con flush per rimuovere i bordi esterni */}
      <ListGroup variant="flush">
        {commentList.map((c) => (
          // 3. È fondamentale passare la key qui sul componente che cicla
          <Comment key={c._id || Math.random()} comment={c} />
        ))}
      </ListGroup>
    </div>
  );
}

export default AllComment;
