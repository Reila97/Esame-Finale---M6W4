import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Riceve 'type' (es. "authors", "posts", "comments") e 'id'
// Aggiungiamo 'postId' alle props
function UpdateBtn({ type, id, postId, className = "" }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    const routes = {
      author:`/edit-author/${id}`,
      post: `/edit-post/${id}`,
      // Se è un commento, costruiamo l'URL con entrambi gli ID
      comment: `/edit-comment/${postId}/${id}` 
    };

    navigate(routes[type]);
  };

  return (
    <Button 
      variant="outline-warning" 
      size="sm" 
      className={`d-inline-flex align-items-center ${className}`}
      onClick={handleEdit}
    >
      <i className="bi bi-pencil-square me-1"></i>
      Modifica
    </Button>
  );
}

export default UpdateBtn;
