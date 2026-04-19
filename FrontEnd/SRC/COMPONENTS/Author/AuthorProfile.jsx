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
import UpdateBtn from "../Button/UpdateBtn/UpdateBtn.jsx";
import DeleteButton from "../Button/DeleteBtn/DeleteBtn.jsx";

function AuthorProfile() {
  // Inizializziamo lo stato provando a leggere dal localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userData");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(!user); // Carica solo se non abbiamo dati salvati
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const decoded = jwtDecode(token);
        const res = await fetch(`http://localhost:3001/authors/${decoded.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const fullUserData = await res.json();
          setUser(fullUserData);
          // Salviamo i dati aggiornati nel localStorage
          localStorage.setItem("userData", JSON.stringify(fullUserData));
        }
      } catch (error) {
        console.error("Errore profilo:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  if (isLoading && !user)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <Container className="mt-5">
      <div className="d-flex gap-2 mb-3">
        <UpdateBtn type="author" id={user?._id} />
        <DeleteButton
          type="author"
          id={user?._id}
          onDeleteSuccess={handleLogout}
        />
      </div>

      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow border-0">
            <div
              className="bg-primary rounded-top"
              style={{ height: "100px" }}
            ></div>
            <Card.Body className="text-center" style={{ marginTop: "-50px" }}>
              <Image
                src={user?.avatar || "https://placehold.co/150x150?text=User"}
                roundedCircle
                thumbnail
                className="shadow"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
              <h2 className="mt-3 text-capitalize">
                {user?.name} {user?.surname}
              </h2>
              <hr />
              <Row className="text-start mt-4">
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="border-0">
                      <strong>Email:</strong> <br /> {user?.email}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
              <div className="d-flex justify-content-center gap-3 mt-4">
                <Button
                  variant="outline-primary"
                  onClick={() => navigate("/new-post")}
                >
                  Nuovo Post
                </Button>
                <Button variant="danger" onClick={handleLogout}>
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
