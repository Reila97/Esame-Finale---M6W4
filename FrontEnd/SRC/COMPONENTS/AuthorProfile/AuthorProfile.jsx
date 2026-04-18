import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Image,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function AuthorProfile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const decoded = jwtDecode(token);
        // Usiamo l'ID del token per fare una chiamata GET specifica per l'autore
        // Assicurati che l'URL sia corretto per il tuo backend (es. /authors/me o /authors/ID)
        const res = await fetch(`http://localhost:3001/authors/${decoded.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const fullUserData = await res.json();
          setUser(fullUserData); // Ora 'user' contiene tutto ciò che è nel DB
        } else {
          throw new Error("Errore nel recupero dati");
        }
      } catch (error) {
        console.error("Errore profilo:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow border-0">
            {/* Header del Profilo con Background Color */}
            <div
              className="bg-primary rounded-top"
              style={{ height: "100px" }}
            ></div>

            <Card.Body className="text-center" style={{ marginTop: "-50px" }}>
              {/* Avatar Circolare */}
              <Image
                src={user?.avatar || "https://placehold.co/150x150?text=User"}
                roundedCircle
                thumbnail
                className="shadow"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
                referrerPolicy="no-referrer"
              />

              <h2 className="mt-3 text-capitalize">
                {user?.name} {user?.surname}
              </h2>
              <p className="text-muted">Autore & Contributor</p>

              <hr />

              <Row className="text-start mt-4">
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="border-0">
                      <strong>Email:</strong> <br />
                      <span className="text-secondary">{user?.email}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="border-0">
                      <strong>Data di Nascita:</strong> <br />
                      <span className="text-secondary">
                        {user?.birthDate
                          ? new Date(user.birthDate).toLocaleDateString()
                          : "Non specificata"}
                      </span>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="border-0">
                      <strong>Account ID:</strong> <br />
                      <span className="text-secondary small">
                        {user?.id || user?._id}
                      </span>
                    </ListGroup.Item>
                    <ListGroup.Item className="border-0">
                      <strong>Ruolo:</strong> <br />
                      <span className="badge bg-success">Attivo</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>

              <div className="d-flex justify-content-center gap-3 mt-4">
                <Button
                  variant="outline-primary"
                  onClick={() => navigate("/new-post")}
                >
                  Scrivi un nuovo Post
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                >
                  Logout
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AuthorProfile;
