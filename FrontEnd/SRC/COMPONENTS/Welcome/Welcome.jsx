import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Welcome() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="welcome-page">
      {/* SEZIONE HERO (Il Benvenuto) */}
      <div className="bg-light p-5 rounded-lg mb-5 shadow-sm border-bottom">
        <Container className="text-center py-5">
          <h1 className="display-3 fw-bold text-primary">Benvenuto su TechBlog 🚀</h1>
          <p className="lead fs-4 text-secondary">
            Il luogo dove le idee prendono vita e la community condivide conoscenza.
          </p>
          <hr className="my-4" />
          <p>Esplora gli ultimi articoli dei nostri autori o unisciti alla conversazione.</p>
          
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => navigate("/posts")}
            >
              Leggi il Blog
            </Button>
            
            {!isLoggedIn && (
              <Button 
                variant="outline-primary" 
                size="lg" 
                onClick={() => navigate("/login")}
              >
                Accedi / Registrati
              </Button>
            )}
          </div>
        </Container>
      </div>

      {/* SEZIONE FEATURES (Perché usarlo?) */}
      <Container>
        <Row className="g-4 text-center">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm p-3">
              <Card.Body>
                <div className="fs-1 mb-3">✍️</div>
                <Card.Title className="fw-bold">Scrivi</Card.Title>
                <Card.Text className="text-muted">
                  Condividi i tuoi pensieri e le tue guide tecniche con migliaia di lettori.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm p-3">
              <Card.Body>
                <div className="fs-1 mb-3">💬</div>
                <Card.Title className="fw-bold">Interagisci</Card.Title>
                <Card.Text className="text-muted">
                  Commenta i post e confrontati con esperti del settore in tempo reale.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm p-3">
              <Card.Body>
                <div className="fs-1 mb-3">🔍</div>
                <Card.Title className="fw-bold">Scopri</Card.Title>
                <Card.Text className="text-muted">
                  Trova nuovi talenti nella nostra lista autori e segui i loro aggiornamenti.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Welcome;