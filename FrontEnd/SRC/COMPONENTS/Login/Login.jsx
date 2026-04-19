import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import {
  Button,
  FloatingLabel,
  Form,
  Spinner,
  Alert,
  Container,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // 1. Importiamo il navigatore

function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false); // Stato caricamento
  const [error, setError] = useState(null); // Stato errore
  const navigate = useNavigate(); // Inizializziamo navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  // Funzione di utilità per gestire il salvataggio dei dati post-login
  const handleLoginSuccess = async (token) => {
    localStorage.setItem("token", token);
    
    try {
      // Decodifichiamo il token per ottenere l'ID utente
      const decoded = jwtDecode(token);
      
      // Recuperiamo i dati completi dell'utente dal backend
      // (Serve per avere l'ID corretto, nome, cognome e avatar subito disponibili)
      const res = await fetch(`http://localhost:3001/authors/${decoded.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.ok) {
        const userData = await res.json();
        localStorage.setItem("userData", JSON.stringify(userData)); // SALVATAGGIO CRUCIALE
        navigate("/posts");
      } else {
        throw new Error("Errore nel recupero dati profilo");
      }
    } catch (err) {
      console.error("Dettagli errore:", err);
      setError("Login effettuato, ma errore nel caricamento del profilo.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (res.ok) {
        // Usiamo la funzione di supporto definita sopra
        await handleLoginSuccess(data.token);
      } else {
        setError(data.message || "Credenziali non valide");
      }
    } catch (error) {
      setError("Il server non risponde. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Funzione separata per gestire la risposta di Google per pulizia
const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const res = await fetch("http://localhost:3001/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

  if (res.ok) {
        await handleLoginSuccess(data.token);
      } else {
        setError("Errore durante l'accesso con Google");
      }
    } catch (err) {
      setError("Errore di connessione con Google");
    }
  };

 return (
    <Container className="d-flex justify-content-center mt-5">
      <div style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Bentornato</h2>

        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

        <Form onSubmit={handleSubmit} className="shadow-sm p-4 rounded bg-white border">
          <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
            <Form.Control
              type="email"
              name="email"
              placeholder="name@example.com"
              value={loginData.email}
              onChange={handleChange}
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </FloatingLabel>

          <Button
            variant="primary"
            type="submit"
            className="w-100 mb-3 fw-bold"
            disabled={isLoading}
          >
            {isLoading ? <Spinner animation="border" size="sm" /> : "Accedi"}
          </Button>

          <div className="text-center mb-3">
            <hr />
            <small className="text-muted bg-white px-2" style={{ position: 'relative', top: '-23px' }}>oppure</small>
          </div>

          <div className="d-flex justify-content-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Login Google fallito")}
              theme="filled_blue"
              shape="pill"
            />
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default Login;