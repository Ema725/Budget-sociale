import { Row, Col, Container, Form, FormGroup, FormControl, Button, Table } from 'react-bootstrap';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { addProposta, updateProposta, deleteProposta, aggiornaFase, fetchProposte } from '../API.mjs';
import { Proposta } from '../Proposta.mjs';


function Fase1(props){
    const [numProposte, setNumProposte] = useState(0);
    const [testo, setTesto] = useState('');
    const [budget, setBudget] = useState(100);
    const [proposte, setProposte] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      if (props.fase !== 1) {
          navigate(`/fase${props.fase}`);
      }
    }, [props.fase, navigate]);

    useEffect(()=>{
        const getProposte = async ()=>{
            const elencoProposte = await fetchProposte();
            const elencoutente = elencoProposte.filter(p => p.userID == props.user.id);
            setProposte(elencoutente);
            setNumProposte(elencoutente.length);
        }
        getProposte();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (editingId !== null) {
            const propostamod = new Proposta(editingId, testo, budget, props.user.id, 0);
            // Modifica proposta esistente
            try{
                await updateProposta(propostamod);
                setProposte((vecchieProposte) =>
                    vecchieProposte.map((proposta) =>
                        proposta.id === editingId
                            ? new Proposta(editingId, testo, budget, proposta.userID, proposta.rating)
                            : proposta
                    )
                );
                setEditingId(null);
            } catch(err){
                console.error(err)
            }
        } else {
            //l' id qua è provvisorio, posso mettere qualunque cosa
        const p = new Proposta(proposte.length + 1, testo, budget, props.user.id, 0);
        const id = await addProposta(p);
        console.log("ID ritornato:", id);
        setProposte(vecchieProposte => [...vecchieProposte, new Proposta(id, testo, budget, props.user.id, 0)]);
        setNumProposte((numProposte) => numProposte + 1);
        }        
        setTesto('');
        setBudget(100);
    };

    const handleEdit = (id) => {
        const proposta = proposte.find((p) => p.id === id);
        if (proposta) {
            setTesto(proposta.text);
            setBudget(proposta.budget);
            setEditingId(id);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProposta(id);
            setProposte((vecchieProposte) => vecchieProposte.filter(proposta => proposta.id !== id));
            setNumProposte((numProposte) => numProposte + -1);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFase = async () =>{
        await aggiornaFase(2);
        props.setFase(2);
        navigate('/fase2');
    }

    return(
        <>
            {props.login && <>
            {(numProposte < 3 || editingId != null) && <Container className="d-flex min-vh-100 justify-content-center align-items-center">
                <Row className="flex-column align-items-center">
                    <Col as='h1' className="text-center">
                        Inserisci la tua proposta
                    </Col>
                    <Form onSubmit={handleSubmit}>
                    <FormGroup className='mb-3'>
                        <Form.Label>Testo</Form.Label>
                        <FormControl type="text" required={true} minLength={2} maxLength={50} value={testo} onChange = {(event) => setTesto(event.target.value)}></FormControl>
                    </FormGroup>
                    <FormGroup className='mb-3'> 
                        <Form.Label>Budget</Form.Label>
                        <FormControl type="number" required={true} min="100" max={props.budget} value={budget} onChange = {(event) => setBudget(event.target.value)}></FormControl>
                    </FormGroup>
                    <Button variant='success' type='submit'>{editingId !== null ? 'Update' : 'Add'}</Button>
                    </Form>
                </Row>
            </Container>}
            <Container className="d-flex flex-column align-items-center">
                <TabellaProposte proposte = {proposte} onDelete={handleDelete} onEdit={handleEdit}/>
                {props.user.role === "admin" && <Button variant="success" className="mt-3" onClick={handleFase}>
                    Termina processo di proposta
                </Button>}
            </Container>
            </>}
            {!props.login && <Container className="d-flex min-vh-100 justify-content-center align-items-center">
                <Row className="flex-column align-items-center">
                    <Col as='h1' className="text-center">
                        Le proposte sono ancora in fase di definizione..
                    </Col>
                </Row>
            </Container>}
        </>
    )
}

function TabellaProposte(props) {
    return (
        <Container>
            <Row>
                <Col as="h2">Proposte:</Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Testo</th>
                        <th>Budget</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {props.proposte.map((proposta) => (
                            <tr key={proposta.id}>
                                <td>{proposta.text}</td>
                                <td>{proposta.budget}€</td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => props.onEdit(proposta.id)}>Modifica</Button>
                                    <Button variant="danger" size="sm" className="ms-2" onClick={() => props.onDelete(proposta.id)}>Cancella</Button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default Fase1;