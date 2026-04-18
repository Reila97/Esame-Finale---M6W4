import { Card, Badge, Image } from "react-bootstrap";

function BlogPost({ post }) {
  // Fallback per le immagini
  const defaultCover = "https://placehold.co/600x400?text=No+Cover";
  const defaultAvatar = "https://placehold.co/100x100?text=A";

  return (
    <Card className="h-100 shadow-sm border-0">
      {/* Immagine di copertina con gestione errore */}
      <Card.Img
        variant="top"
        src={post?.cover || defaultCover}
        alt={post?.title}
        onError={(e) => (e.target.src = defaultCover)}
        style={{ height: "200px", objectFit: "cover" }}
      />

      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          {/* Categoria con fallback "General" */}
          <Badge bg="info">{post?.category || "General"}</Badge>

          {/* Tempo di lettura con optional chaining */}
          <small className="text-muted">
            {post?.readTime?.value || 0} {post?.readTime?.unit || "min"}
          </small>
        </div>

        <Card.Title className="h5 text-truncate">{post?.title}</Card.Title>

        {/* Contenuto troncato per non rompere il layout delle card */}
        <Card.Text
          className="text-secondary flex-grow-1"
          style={{ fontSize: "0.9rem" }}
        >
          {post?.content?.substring(0, 100)}...
        </Card.Text>

        <hr />

        {/* Info Autore - Gestione se l'autore non è popolato */}
        <div className="d-flex align-items-center mt-auto">
          <Image
            src={post?.author?.avatar || defaultAvatar}
            roundedCircle
            width="30"
            height="30"
            className="me-2"
            referrerPolicy="no-referrer"
            onError={(e) => (e.target.src = defaultAvatar)}
          />
          <small className="fw-bold">
            {post?.author
              ? `${post.author.name} ${post.author.surname}`
              : "Autore Sconosciuto"}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
}

export default BlogPost;
