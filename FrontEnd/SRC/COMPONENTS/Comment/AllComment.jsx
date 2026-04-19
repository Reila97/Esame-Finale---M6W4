import React from "react";
import { ListGroup } from "react-bootstrap";
import Comment from "./Comment.jsx";

function AllComment({ commentList, postId }) {
  // Messaggio di fallback se non ci sono commenti
  if (!commentList || commentList.length === 0) {
    return (
      <p className="text-muted small ps-2 mt-2 fst-italic">
        Ancora nessun commento. Sii il primo!
      </p>
    );
  }

  return (
    <div className="mt-2">
      <ListGroup variant="flush">
        {commentList.map((c) => (
          <Comment 
            key={c._id || Math.random()} 
            comment={c} 
            postId={postId}
          />          
        ))}
      </ListGroup>
    </div>
  );
}

export default AllComment;