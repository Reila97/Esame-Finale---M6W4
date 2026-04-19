import { Card, Badge, Image } from "react-bootstrap";
import UpdateBtn from "../Button/UpdateBtn/UpdateBtn.jsx";
import DeleteButton from "../Button/DeleteBtn/DeleteBtn.jsx";
import AddButton from "../Button/AddBtn/AddBtn.jsx";
import AllComment from "../Comment/AllComment.jsx"; // Importato correttamente
import { useState } from "react";
import NewComment from "../Comment/NewComment.jsx";

function BlogPost({ post }) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const defaultCover = "https://placehold.co/600x400?text=No+Cover";
  const defaultAvatar = "https://placehold.co/100x100?text=A";

  const handleRefresh = () => {
    // Invece di reload() potresti usare uno stato globale o rinfrescare la lista, 
    // ma manteniamo la tua logica corretta per ora:
    window.location.reload();
  };

  return (
    <div className="h-100 d-flex flex-column mb-4">
      <div className="d-flex gap-2 mb-2">
        <AddButton type="comment" onClick={() => setShowCommentForm(!showCommentForm)} />
        <UpdateBtn type="post" id={post._id} />
        <DeleteButton type="post" id={post._id} onDeleteSuccess={handleRefresh} />
      </div>

      <Card className="h-100 shadow-sm border-0">
        <Card.Img
          variant="top"
          src={post?.cover || defaultCover}
          alt={post?.title}
          onError={(e) => { e.target.onerror = null; e.target.src = defaultCover; }}
          style={{ height: "200px", objectFit: "cover" }}
        />

        <Card.Body className="d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Badge bg="info">{post?.category || "General"}</Badge>
            <small className="text-muted">
              {post?.readTime?.value || 0} {post?.readTime?.unit || "min"}
            </small>
          </div>

          <Card.Title className="h5 text-truncate">{post?.title}</Card.Title>
          <Card.Text className="text-secondary flex-grow-1" style={{ fontSize: "0.9rem" }}>
            {post?.content?.substring(0, 100)}...
          </Card.Text>

          <hr />

          <div className="d-flex align-items-center mt-auto">
            <Image
              src={post?.author?.avatar || defaultAvatar}
              roundedCircle width="30" height="30" className="me-2"
              referrerPolicy="no-referrer"
              onError={(e) => { e.target.onerror = null; e.target.src = defaultAvatar; }}
            />
            <small className="fw-bold">
              {post?.author ? `${post.author.name} ${post.author.surname}` : "Autore Sconosciuto"}
            </small>
          </div>
        </Card.Body>
      </Card>

      {showCommentForm && (
        <div className="mt-2 p-3 bg-white border rounded shadow-sm">
          <NewComment postId={post._id} onSuccess={() => setShowCommentForm(false)} />
        </div>
      )}

      <div className="mt-2 p-2 bg-light rounded shadow-sm">
        <h6 className="text-muted border-bottom pb-1 small">Commenti:</h6>
        <AllComment commentList={post.comments} postId={post._id} />
      </div>
    </div>
  );
}

export default BlogPost;