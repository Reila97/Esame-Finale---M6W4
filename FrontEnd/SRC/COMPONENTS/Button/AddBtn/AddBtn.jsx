import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AddButton({ type, className = "", onClick }) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (type === 'post') {
      navigate("/new-post");
    } else if (type === 'comment') {
      // Se esiste una funzione onClick passata come prop, esegui quella
      if (onClick) {
        onClick();
      }
    }
  };

  return (
    <Button 
      variant={type === 'post' ? "primary" : "outline-primary"} 
      size={type === 'comment' ? "sm" : "md"}
      className={`d-inline-flex align-items-center shadow-sm ${className}`}
      onClick={handleAction} // Questo ora attiva lo switch in BlogPost
    >
      <i className={`bi ${type === 'post' ? 'bi-plus-circle' : 'bi-chat-left-dots'} me-2`}></i>
      {type === 'post' ? "Nuovo Articolo" : "Aggiungi Commento"}
    </Button>
  );
}

export default AddButton;