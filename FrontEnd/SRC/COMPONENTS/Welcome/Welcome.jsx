import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

function Welcome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Utilizziamo lo stesso trucco della Navbar per aggiornare lo stato al cambio rotta
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  return (
    <div className="welcome-page">
      {/* SEZIONE HERO: Benvenuto Generico */}
      <div className="bg-white p-5 mb-5 shadow-sm border-bottom">
        <Container className="text-center py-5">
          <h1 className="display-3 fw-bold text-dark">
            Benvenuto su <span className="text-info">StriveBlog</span> 🚀
          </h1>
          <p className="lead fs-4 text-secondary mx-auto" style={{ maxWidth: '800px' }}>
            Uno spazio aperto per condividere storie, approfondimenti e passioni. 
            Dall'arte alla scienza, dalla vita quotidiana alle grandi idee.
          </p>
          <hr className="my-4 mx-auto" style={{ width: '100px', borderTop: '3px solid #0dcaf0' }} />
          <p className="text-muted">Esplora i contenuti della community o inizia a pubblicare i tuoi.</p>
          
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Button 
              variant="dark" 
              size="lg" 
              className="px-4 shadow-sm"
              onClick={() => navigate("/posts")}
            >
              Esplora i Post
            </Button>
            
            {!isLoggedIn && (
              <Button 
                variant="outline-dark" 
                size="lg" 
                className="px-4 shadow-sm"
                onClick={() => navigate("/login")}
              >
                Inizia ora
              </Button>
            )}
          </div>
        </Container>
      </div>

      {/* SEZIONE FEATURES: Descrizioni Generiche */}
      <Container className="mb-5">
        <Row className="g-4 text-center">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm p-3 bg-light">
              <Card.Body>
               
                <Card.Text className="text-muted">
                  Pubblica i tuoi articoli su qualsiasi argomento: racconti, tutorial, opinioni o semplici riflessioni.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm p-3 bg-light">
              <Card.Body>
                <div className="fs-1 mb-3">🌍</div>
                <Card.Title className="fw-bold">Connettiti</Card.Title>
                <Card.Text className="text-muted">
                  Entra a far parte di una community globale. Commenta e scambia idee con persone che condividono i tuoi interessi.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm p-3 bg-light">
              <Card.Body>
                <div className="fs-1 mb-3">📚</div>
                <Card.Title className="fw-bold">Impara</Card.Title>
                <Card.Text className="text-muted">
                  Scopri nuovi punti di vista ogni giorno. Segui i tuoi autori preferiti per non perdere i loro aggiornamenti.
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