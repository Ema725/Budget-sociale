import { Row, Col, Container, Button, Table, Spinner} from 'react-bootstrap';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { aggiornaBudget, aggiornaFase, fetchMiglioriProposte, fetchProposte, deleteAllProposte, deleteAllVoti, fetchAllUsers } from '../API.mjs';

function Fase3(props){

    const [bestProposte, setBestProposte] = useState([]);
    const [proposteScartate, setProposteScartate] = useState([]);
    const [utenti, setUtenti] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (props.fase !== 3) {
            navigate(`/fase${props.fase}`);
        }
    }, [props.fase, navigate]);

    useEffect(() =>{
        const getBestProposte = async () => {
            const miglioriProposte = await fetchMiglioriProposte();
            setBestProposte(miglioriProposte);
        }
        const getProposteScartate = async () => {
            const proposte = await fetchProposte();
            const miglioriProposte = await fetchMiglioriProposte();
            const miglioriProposteIds = new Set(miglioriProposte.map(p => p.id));
            const scarti = proposte.filter(p => !miglioriProposteIds.has(p.id)).sort((a, b) => b.rating - a.rating);
            setProposteScartate(scarti);
        }
        const getUtenti = async() =>{
            const users = await fetchAllUsers();
            setUtenti(users);
            setLoading(false);
        }
        getBestProposte();
        getProposteScartate();
        getUtenti();

    }, []);

    const handleReset = async () =>{
        await aggiornaFase(0);
        await aggiornaBudget(0);
        await deleteAllProposte();
        await deleteAllVoti();
        props.setFase(0);
        props.setBudget(0);
        navigate('/fase0');
    }

    if (loading) {
        return (
          <Container className="d-flex min-vh-100 justify-content-center align-items-center">
            <Spinner animation="border" />
          </Container>
        );
    }

    return(<>
    <TabellaProposte bestProposte = {bestProposte} utenti = {utenti}/>
    <TabellaProposteScartate proposteScartate = {proposteScartate}/>
    {props.login && props.user.role === "admin" && <Button variant="danger" className="position-fixed" style={{ bottom: '20px', right: '20px' }} onClick={handleReset} >
        Reset
    </Button>}
    </>)
}

function TabellaProposte(props) {

    const getUsernameById = (id) => {
        const user = props.utenti.find(u => u.id === id);
        return user.username;
    };

    return (
        <Container>
            <Row>
                <Col as="h2">Proposte approvate:</Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Testo</th>
                        <th>Username</th>
                        <th>Budget</th>
                        <th>Punteggio</th>
                    </tr>
                </thead>
                <tbody>
                    {props.bestProposte.map((proposta) => (
                            <tr key={proposta.id}>
                                <td>{proposta.text}</td>
                                <td>{getUsernameById(proposta.userID)}</td>
                                <td>{proposta.budget}€</td>
                                <td>{proposta.rating}</td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        </Container>
    );
}

function TabellaProposteScartate(props) {
    return (
        <Container>
            <Row>
                <Col as="h2">Proposte scartate:</Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Testo</th>
                        <th>Budget</th>
                        <th>Punteggio</th>
                    </tr>
                </thead>
                <tbody>
                    {props.proposteScartate.map((proposta) => (
                            <tr key={proposta.id}>
                                <td>{proposta.text}</td>
                                <td>{proposta.budget}€</td>
                                <td>{proposta.rating}</td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default Fase3;