import React from "react";
import { ListGroup, Image } from "react-bootstrap";
import DeleteButton from "../Button/DeleteBtn/DeleteBtn.jsx";
import UpdateBtn from "../Button/UpdateBtn/UpdateBtn.jsx";

function Comment({ comment, postId }) {
  if (!comment) return null;

  const defaultAvatar = "https://placehold.co/50x50?text=U";

  const handleActionSuccess = () => {
    // In una app reale useresti un Context o Redux per aggiornare la lista,
    // per ora manteniamo il reload per coerenza con il resto del progetto.
    window.location.reload();
  };

  return (
    <ListGroup.Item className="border-0 px-0 py-2 bg-transparent">
      <div className="d-flex align-items-start position-relative">
        <Image
          src={comment.author?.avatar || defaultAvatar}
          roundedCircle
          width="30"
          height="30"
          className="me-2 shadow-sm"
          onError={(e) => { e.target.onerror = null; e.target.src = defaultAvatar; }}
          referrerPolicy="no-referrer"
        />

        <div className="flex-grow-1 p-2 rounded bg-white shadow-sm border">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <strong className="small text-capitalize">
              {comment.author
                ? `${comment.author.name} ${comment.author.surname}`
                : "Utente Anonimo"}
            </strong>
            <div className="d-flex gap-1 align-items-center">
                <small className="text-muted me-2" style={{ fontSize: "0.7rem" }}>
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ""}
                </small>
                {/* Bottoni piccoli per non disturbare il testo */}
                <UpdateBtn type="comment" id={comment._id} postId={postId} size="sm" />
                <DeleteButton
                    type="comment"
                    id={comment._id}
                    postId={postId}
                    onDeleteSuccess={handleActionSuccess}
                />
            </div>
          </div>

          <p className="mb-0 small text-secondary" style={{ lineHeight: "1.2" }}>
            {comment.text}
          </p>
        </div>
      </div>
    </ListGroup.Item>
  );
}

export default Comment;