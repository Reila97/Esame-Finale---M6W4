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
        localStorage.setItem("token", data.token);
        // 2. Navighiamo verso la rotta principale
        navigate("/posts");
      } else {
        // Mostriamo il messaggio che arriva dal backend (es. "Password errata")
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

      const res = await fetch("http://localhost:3001/auth/login/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/posts");
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
        <h2 className="text-center mb-4">Accedi</h2>

        {/* 3. Alert per gli errori */}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
          <FloatingLabel
            controlId="floatingInput"
            label="Email address"
            className="mb-3"
          >
            <Form.Control
              type="email"
              name="email"
              placeholder="name@example.com"
              value={loginData.email}
              onChange={handleChange}
              required
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingPassword"
            label="Password"
            className="mb-3"
          >
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </FloatingLabel>

          {/* 4. Bottone con Spinner dinamico */}
          <Button
            variant="primary"
            type="submit"
            className="w-100 mb-3"
            disabled={isLoading} // Disabilita se sta caricando
          >
            {isLoading ? <Spinner animation="border" size="sm" /> : "Accedi"}
          </Button>

          <div className="text-center mb-3">
            <small className="text-muted">oppure</small>
          </div>

          {/* LOGIN CON GOOGLE */}
          <div className="d-flex justify-content-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Login Google fallito")}
              theme="outline"
              size="large"
            />
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default Login;
