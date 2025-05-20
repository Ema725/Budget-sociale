import { Row, Col, Container, Button, Table, ButtonGroup} from 'react-bootstrap';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Proposta, Voto } from '../Proposta.mjs';
import { aggiornaFase, fetchProposte, addVote, removeVote, addVoto, fetchVoti, removeVoto } from '../API.mjs';

function Fase2(props){
    
    const [proposte, setProposte] = useState([]);
    const [voti, setVoti] = useState([]);
    const navigate = useNavigate();

    const handleFase = async () =>{
        await aggiornaFase(3);
        props.setFase(3);
        navigate('/fase3');
    }

    useEffect(() => {
        if (props.fase !== 2) {
            navigate(`/fase${props.fase}`);
        }
    }, [props.fase, navigate]);

    useEffect(() => {
        const getProposte = async () => {
            // elenco di tutte le proposte
            const elencoProposte = await fetchProposte();
            // elenco di tutti i voti
            const tuttiIVoti = await fetchVoti();
            // elenco voti dell'utente loggato
            const elencoVoti = tuttiIVoti.filter(v => v.userid == props.user.id);
            // elenco che verrà riempito coi voti giusti
            const elencoProposteVoti = elencoProposte.map(p => {
                const votoUtente = elencoVoti.find(v => v.propostaid == p.id);
                return new Proposta(p.id, p.text, p.budget, p.userID, votoUtente ? votoUtente.voto : 0);
            });

            setProposte(elencoProposteVoti);
            // inizializzo lo stato coi voti dell'utente loggato
            setVoti(elencoVoti);
        }
        getProposte();
    }, [props.user]);

    const handleVote = async (id, voto) => {
        const v = new Voto(id, props.user.id, voto);
        try {
            await addVote(id, voto);
            await addVoto(v);
            setProposte(prevProposte => prevProposte.map(p => 
                p.id === id ? { ...p, rating: voto } : p
            ));
            setVoti(oldvoti => [...oldvoti, v]);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRemoveVote = async (proposta) => {
        let voto = {}
        for(let v of voti){
            if(v.propostaid == proposta.id)
                voto = v;
        }
        try {
            await removeVote(proposta.id, proposta.rating);
            await removeVoto(voto);
            setProposte(prevProposte => prevProposte.map(p => 
                p.id === proposta.id ? { ...p, rating: 0 } : p
            ));
            setVoti((oldvoti) => oldvoti.filter(v => v.propostaid != proposta.id));
        } catch (err) {
            console.error(err);
        }
        
    };

    return(
    <>
        {props.login && <>
        <Container className="d-flex min-vh-100 justify-content-center align-items-center">
            <TabellaProposte proposte = {proposte} voti = {voti} onVote={handleVote} onRemoveVote={handleRemoveVote} user = {props.user}/>
        </Container>
        {props.user.role === "admin" && <Button variant="success" className="position-fixed" style={{ bottom: '20px', right: '20px' }} onClick={handleFase}>
            Termina votazione
        </Button>}
        </>}
        {!props.login && <Container className="d-flex min-vh-100 justify-content-center align-items-center">
            <Col as='h1' className="text-center">
                Le proposte sono ancora in fase di votazione...
            </Col>
        </Container>}
    </>
    )
}

function TabellaProposte(props) {
    return (
        <Container>
            <Row>
                <Col as="h2">Vota le proposte:</Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Testo</th>
                        <th>Budget</th>
                        <th>Voti</th>
                    </tr>
                </thead>
                <tbody>
                    {props.proposte.map((proposta) => (
                            <tr key={proposta.id}>
                                <td>{proposta.text}</td>
                                <td>{proposta.budget}€</td>
                                <td>
                                {proposta.rating !== 0 ? (
                                    <span>{`Voto: ${proposta.rating}`}</span>
                                ) : (
                                    <ButtonGroup className="me-2" aria-label="Voti">
                                        <Button variant="primary" onClick={() => props.onVote(proposta.id, 1)} disabled={proposta.userID == props.user.id}>1</Button>
                                        <Button variant="primary" onClick={() => props.onVote(proposta.id, 2)} disabled={proposta.userID == props.user.id}>2</Button>
                                        <Button variant="primary" onClick={() => props.onVote(proposta.id, 3)} disabled={proposta.userID == props.user.id}>3</Button>
                                    </ButtonGroup>
                                )}
                                    <Button variant="danger" size="sm" className="ms-2" onClick={() => props.onRemoveVote(proposta)} disabled = {proposta.rating === 0}>Cancella voto</Button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default Fase2;