import { Col, Container, Row, Spinner } from "react-bootstrap";
import Author from "./Author";

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";



function AllAuthors() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // 2. Stato per il caricamento
    const [error, setError] = useState(null);         // 3. Stato per l'errore
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token'); // Recuperiamo il token

                const res = await fetch('http://localhost:3001/authors', {
                    headers: {
                        // 4. Aggiungiamo l'Authorization Header
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (res.status === 401) {
                    // 5. Se il token è scaduto o mancante, reindirizziamo al login
                    navigate('/login');
                    return;
                }

                if (!res.ok) throw new Error("Errore nel recupero degli autori");

                const data = await res.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false); // Smette di caricare a prescindere dall'esito
            }
        };

        fetchUsers();
    }, [navigate]);

    return (
        <Container className="mt-5">
            <h1 className="mb-4">Lista degli utenti</h1>

            {/* 6. Gestione UI condizionale */}
            {isLoading && (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {!isLoading && !error && (
                <Row className="g-4">
                    {users.map((u) => (
                        <Col key={u._id} sm={12} md={6} lg={4}>
                            <Author user={u} />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default AllAuthors;