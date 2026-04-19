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

function MyNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // 1. Monitoraggio dello stato utente
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserData = localStorage.getItem("userData");

    if (token && storedUserData) {
      try {
        // Invece di decodificare solo il token, usiamo i dati ricchi 
        // che abbiamo salvato nel localStorage durante il login
        const userData = JSON.parse(storedUserData);
        setUser(userData);
      } catch (err) {
        // Se i dati nel localStorage sono corrotti, puliamo tutto
        handleLogout();
      }
    } else {
      setUser(null);
    }
  }, [location]); // Si aggiorna ad ogni cambio pagina per riflettere lo stato attuale

  // 2. Funzione di Logout completa
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData"); // Importante: rimuoviamo anche i dati utente
    setUser(null);
    navigate("/login");
  };

  // Fallback per l'avatar se non presente
  const defaultAvatar = "https://placehold.co/100x100?text=User";

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      sticky="top"
      className="shadow mb-4 border-bottom border-info"
    >
      <Container>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/" className="fw-bold text-info">
          🚀 StriveBlog
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/posts" className="hover-link">
              Blog
            </Nav.Link>
            <Nav.Link as={Link} to="/authors" className="hover-link">
              Autori
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto align-items-center">
            {user ? (
              /* Se l'utente è loggato */
              <NavDropdown
                title={
                  <div className="d-inline-flex align-items-center">
                    <Image
                      src={user.avatar || defaultAvatar}
                      roundedCircle
                      width="32"
                      height="32"
                      className="me-2 border border-info"
                      referrerPolicy="no-referrer"
                      onError={(e) => (e.target.src = defaultAvatar)}
                    />
                    <span className="d-none d-sm-inline">{user.name}</span>
                  </div>
                }
                id="user-dropdown"
                align="end"
              >
                <div className="px-3 py-2 small text-muted border-bottom mb-2">
                   Connesso come: <br/> <strong>{user.email}</strong>
                </div>
                <NavDropdown.Item as={Link} to="/profile">
                  Mio Profilo
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/new-post">
                  Scrivi Post
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={handleLogout}
                  className="text-danger fw-bold"
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              /* Se non è loggato */
              <div className="d-flex gap-2">
                <Button
                    variant="outline-info"
                    size="sm"
                    onClick={() => navigate("/login")}
                    className="px-4 pill-button"
                >
                    Accedi
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNav;