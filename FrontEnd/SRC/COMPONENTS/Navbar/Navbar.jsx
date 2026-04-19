import React, { useEffect, useState } from "react";
import {
  Navbar,
  Container,
  Nav,
  Button,
  Image,
  NavDropdown,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function MyNav() {
  const navigate = useNavigate();
  const location = useLocation(); // Per sapere in che pagina siamo
  const [user, setUser] = useState(null);

  // 1. Controlliamo se c'è un utente loggato all'avvio e ad ogni cambio di pagina
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // Salviamo i dati dell'utente (nome, avatar, etc.)
      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]); // Si aggiorna quando cambiamo rotta

  // 2. Funzione di Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      sticky="top"
      className="shadow-sm mb-4"
    >
      <Container>
        {/* Brand - Usiamo Link per non ricaricare la pagina */}
        <Navbar.Brand as={Link} to="/" className="fw-bold text-info">
          🚀 TechBlog
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/posts">
              Blog
            </Nav.Link>
            <Nav.Link as={Link} to="/authors">
              Autori
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto align-items-center">
            {user ? (
              /* 3. Se l'utente è loggato, mostriamo il suo profilo */
              <NavDropdown
                title={
                  <div className="d-inline-flex align-items-center">
                    <Image
                      src={user.avatar}
                      roundedCircle
                      width="30"
                      height="30"
                      className="me-2"
                      referrerPolicy="no-referrer"
                    />
                    <span>{user.name}</span>
                  </div>
                }
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  Mio Profilo
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/new-post">
                  Scrivi Post
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={handleLogout}
                  className="text-danger"
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              /* 4. Se non è loggato, mostriamo il tasto Accedi */
              <Button
                variant="outline-info"
                size="sm"
                onClick={() => navigate("/login")}
              >
                Accedi
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNav;
