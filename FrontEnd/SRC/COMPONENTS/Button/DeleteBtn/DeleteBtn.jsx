import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';

function DeleteButton({ type, id, postId, onDeleteSuccess }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // 1. Chiediamo conferma all'utente
    const confirmDelete = window.confirm(
      `Sei sicuro di voler eliminare questo ${type === 'author' ? 'profilo' : type === 'post' ? 'articolo' : 'commento'}? L'azione è irreversibile.`
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      
      // 2. Definiamo l'URL corretto in base al tipo
      const endpoints = {
        author: `http://localhost:3001/authors/${id}`,
        post: `http://localhost:3001/blogPosts/${id}`,
        comment: `http://localhost:3001/blogPosts/${postId}/comment/${id}`
      };

      const res = await fetch(endpoints[type], {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        alert("Eliminato con successo!");
        // 3. Callback fondamentale per aggiornare l'interfaccia senza ricaricare la pagina
        if (onDeleteSuccess) onDeleteSuccess(id);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Errore durante l'eliminazione");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button 
      variant="outline-danger" 
      size="sm" 
      onClick={handleDelete}
      disabled={isDeleting}
      className="d-inline-flex align-items-center"
    >
      {isDeleting ? (
        <Spinner animation="border" size="sm" />
      ) : (
        <>
          <i className="bi bi-trash me-1"></i>
          Elimina
        </>
      )}
    </Button>
  );
}

export default DeleteButton;